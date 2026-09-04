import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import enPages from "../src/locale/en-US/pages.js";
import enUi from "../src/locale/en-US/ui.js";
import viPages from "../src/locale/vi/pages.js";
import viUi from "../src/locale/vi/ui.js";
import zhCNPages from "../src/locale/zh-CN/pages.js";
import zhCNUi from "../src/locale/zh-CN/ui.js";
import zhTWPages from "../src/locale/zh-TW/pages.js";
import zhTWUi from "../src/locale/zh-TW/ui.js";
import settings from "../src/settings.js";

const locales = {
    "zh-CN": { pages: zhCNPages, ui: zhCNUi },
    "zh-TW": { pages: zhTWPages, ui: zhTWUi },
    "en-US": { pages: enPages, ui: enUi },
    vi: { pages: viPages, ui: viUi },
};

const srcRoot = fileURLToPath(new URL("../src", import.meta.url));
const i18nHeadPath = fileURLToPath(new URL("../src/router/i18n-head.js", import.meta.url));

const mobileI18nRoots = [
    "views/cj/mobile",
    "components/cj/mobile",
    "views/quest/mobile",
    "components/quest/mobile",
    "views/knowledge/mobile",
    "components/knowledge/mobile",
];

// 这里只允许非界面协议值、游戏固有数据、字体名和开发日志；注释会在扫描前按语法边界遮罩。
// 每项同时绑定文件与原文，避免为同文案在其他位置留下全局豁免。
const mobileCjkAllowlist = {
    "views/cj/mobile/detail.vue": ["filter_category=成就", "图片加载失败", "全局状态设置成功"],
    "views/cj/mobile/index.vue": ["filter_category=成就"],
    "components/cj/mobile/wiki-view-drawer.vue": ["图片加载失败", "全局状态设置成功"],
    "views/quest/mobile/detail.vue": ["filter_category=成就"],
    "views/quest/mobile/index.vue": ["filter_category=成就"],
    "views/knowledge/mobile/detail.vue": ["filter_category=通识"],
    "views/knowledge/mobile/index.vue": ["微软雅黑"],
};

function flattenLeaves(value, prefix = "", result = new Map()) {
    for (const [key, child] of Object.entries(value || {})) {
        const current = prefix ? `${prefix}.${key}` : key;
        if (child && typeof child === "object" && !Array.isArray(child)) {
            flattenLeaves(child, current, result);
        } else {
            result.set(current, child);
        }
    }
    return result;
}

function placeholders(value) {
    return [...String(value).matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort();
}

function sourcePath(file) {
    return path.relative(srcRoot, file).split(path.sep).join("/");
}

function lineNumberAt(source, index) {
    return source.slice(0, index).split("\n").length;
}

function maskLineComment(line) {
    let quote = "";
    let escaped = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];
        if (quote) {
            if (escaped) {
                escaped = false;
            } else if (character === "\\") {
                escaped = true;
            } else if (character === quote) {
                quote = "";
            }
            continue;
        }

        if (character === '"' || character === "'" || character === "`") {
            quote = character;
            continue;
        }
        if (character === "/" && line[index + 1] === "/") {
            return `${line.slice(0, index)}${" ".repeat(line.length - index)}`;
        }
    }

    return line;
}

function maskComments(source) {
    const blockMasked = source.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, (comment) =>
        comment.replace(/[^\n]/g, " ")
    );
    return blockMasked.split("\n").map(maskLineComment).join("\n");
}

function removeLiteral(line, literal) {
    return line.split(literal).join(" ".repeat(literal.length));
}

async function sourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const target = path.join(directory, entry.name);
            if (entry.isDirectory()) return sourceFiles(target);
            return /\.(?:js|vue|css|less|scss)$/.test(entry.name) ? [target] : [];
        })
    );
    return files.flat();
}

test("四个语言包拥有相同且非空的键与插值参数", () => {
    const baseline = flattenLeaves(locales["zh-CN"]);
    const expectedKeys = [...baseline.keys()].sort();

    for (const [locale, messages] of Object.entries(locales)) {
        const leaves = flattenLeaves(messages);
        assert.deepEqual([...leaves.keys()].sort(), expectedKeys, `${locale} 的翻译键不完整`);
        for (const key of expectedKeys) {
            const value = leaves.get(key);
            assert.equal(typeof value, "string", `${locale}.${key} 必须是字符串`);
            assert.ok(value.trim(), `${locale}.${key} 不得为空字符串`);
            assert.deepEqual(placeholders(value), placeholders(baseline.get(key)), `${locale}.${key} 的插值参数不一致`);
        }
    }
});

test("源码中的 ui/pages 字面量引用在所有语言包中存在", async () => {
    const files = (await sourceFiles(srcRoot)).filter((file) => !sourcePath(file).startsWith("locale/"));
    const references = new Map();
    const referencePattern = /(?<![\\\w$])(["'`])((?:ui|pages)(?:\.[A-Za-z0-9_-]+)+)\1(?![\w-])/g;

    for (const file of files) {
        const source = maskComments(await readFile(file, "utf8"));
        for (const match of source.matchAll(referencePattern)) {
            const key = match[2];
            const locations = references.get(key) || new Set();
            locations.add(`${sourcePath(file)}:${lineNumberAt(source, match.index)}`);
            references.set(key, locations);
        }
    }

    for (const [locale, messages] of Object.entries(locales)) {
        const keys = flattenLeaves(messages);
        const missing = [...references.keys()].filter((key) => !keys.has(key)).sort();
        assert.deepEqual(
            missing,
            [],
            `${locale} 缺少源码引用：${missing
                .map((key) => `${key} (${[...references.get(key)].sort().join(", ")})`)
                .join("; ")}`
        );
    }
});

test("移动端成就、任务、物品与通识组件没有未登记的用户可见中文硬编码", async () => {
    const files = (await Promise.all(mobileI18nRoots.map((root) => sourceFiles(path.join(srcRoot, root))))).flat();
    const usedAllowlist = new Set();
    const violations = [];

    for (const file of files) {
        const relativeFile = sourcePath(file);
        const allowedLiterals = mobileCjkAllowlist[relativeFile] || [];
        const lines = maskComments(await readFile(file, "utf8")).split("\n");

        for (const [index, originalLine] of lines.entries()) {
            let line = originalLine;
            for (const literal of allowedLiterals) {
                if (line.includes(literal)) {
                    usedAllowlist.add(`${relativeFile}\0${literal}`);
                    line = removeLiteral(line, literal);
                }
            }

            const texts = [...line.matchAll(/[\p{Script=Han}]+/gu)].map((match) => match[0]);
            if (texts.length) {
                violations.push(`${relativeFile}:${index + 1} ${texts.map((text) => `“${text}”`).join("、")} | ${originalLine.trim()}`);
            }
        }
    }

    const unusedAllowlist = Object.entries(mobileCjkAllowlist).flatMap(([file, literals]) =>
        literals
            .filter((literal) => !usedAllowlist.has(`${file}\0${literal}`))
            .map((literal) => `${file} 未使用 allowlist “${literal}”`)
    );
    const diagnostics = [...violations, ...unusedAllowlist];

    assert.equal(
        diagnostics.length,
        0,
        `发现中文硬编码或过期 allowlist：\n${diagnostics.map((item) => `- ${item}`).join("\n")}`
    );
});

test("样式伪元素仅保留线上兼容所需的“主”徽标", async () => {
    const files = (await sourceFiles(srcRoot)).filter((file) => /\.(?:css|less|scss)$/.test(file));
    const pattern = /content\s*:\s*(["'])[^"']*\p{Script=Han}[^"']*\1/gu;
    const allowed = new Set([
        'assets/css/item/item-plan.less\0content: "主"',
        'assets/css/item/plan-detail.less\0content: "主"',
    ]);
    const usedAllowlist = new Set();
    const violations = [];

    for (const file of files) {
        const source = maskComments(await readFile(file, "utf8"));
        for (const match of source.matchAll(pattern)) {
            const allowlistKey = `${sourcePath(file)}\0${match[0]}`;
            if (allowed.has(allowlistKey)) {
                usedAllowlist.add(allowlistKey);
                continue;
            }
            violations.push(`${sourcePath(file)}:${lineNumberAt(source, match.index)} ${match[0]}`);
        }
    }

    assert.deepEqual([...usedAllowlist].sort(), [...allowed].sort(), "CSS content 兼容 allowlist 已失效");
    assert.deepEqual(violations, [], `CSS content 不得绕过 i18n：${violations.join("; ")}`);
});

test("繁体翻译保留台湾用语且不存在乱码或机械 SEO 重复", () => {
    assert.equal(zhTWUi.common.actions.search, "搜尋");
    assert.equal(zhTWUi.common.actions.save, "儲存");
    assert.equal(zhTWUi.common.actions.create, "建立");
    assert.equal(zhTWUi.common.labels.server, "伺服器");
    assert.equal(zhTWUi.common.labels.buyoutPrice, "直購價");
    assert.equal(zhTWUi.common.status.networkError, "網路請求異常");
    assert.equal(zhTWPages.quest.home.title, "任務百科");
    assert.equal(zhTWPages.common.appendTitle, "｜劍網3魔盒（JX3BOX）");

    const malformedPattern = /\uFFFD|[\uE000-\uF8FF]|锛|銆|鈥|馃|鍧囦环|鐗╁搧|缂樿捣|鏆傛棤|浠锋牸|杩\?/u;
    const malformed = [...flattenLeaves({ pages: zhTWPages, ui: zhTWUi })]
        .filter(([, value]) => malformedPattern.test(value))
        .map(([key, value]) => `${key}=${value}`);
    assert.deepEqual(malformed, [], `繁体翻译疑似包含乱码：${malformed.join("; ")}`);

    const mainlandTerms = [
        "搜索",
        "数据",
        "數據",
        "加载",
        "加載",
        "登录",
        "登錄",
        "图标",
        "圖標",
        "批量",
        "拖拽",
        "坐标",
        "交互",
        "可否",
        "保存",
        "过滤",
        "過濾",
        "添加",
        "关键词",
        "当前",
        "自定义",
        "默认",
        "创建",
        "支持",
        "游戏",
        "视频",
        "软件",
        "信息",
        "网络",
        "服务器",
        "复制",
        "参数",
        "参考",
        "常规",
        "前缀",
        "后缀",
        "编辑于",
        "破败",
        "推荐",
        "修理费",
        "结束",
        "一种",
        "戰阶",
        "剧情",
    ];
    const mainlandUsage = [...flattenLeaves({ pages: zhTWPages, ui: zhTWUi })].flatMap(([key, value]) =>
        mainlandTerms.filter((term) => value.includes(term)).map((term) => `${key} 包含“${term}”`)
    );
    assert.deepEqual(mainlandUsage, [], `繁体翻译仍含大陆用语或简体字：${mainlandUsage.join("; ")}`);

    const sections = ["cj", "item", "quest", "knowledge"];
    for (const field of ["keywords", "description"]) {
        const values = sections.map((section) => Object.values(zhTWPages[section])[0][field]);
        assert.equal(new Set(values).size, sections.length, `繁体 pages.${field} 不得由同一份机械文案覆盖所有业务`);
    }
});

test("router i18n head 只依赖 pages.common fallback 契约", async () => {
    const source = maskComments(await readFile(i18nHeadPath, "utf8"));
    const requiredKeys = [
        "pages.common.appendTitle",
        "pages.common.fallbackDescription",
        "pages.common.fallbackKeywords",
        "pages.common.fallbackTitle",
    ];
    const commonKeyPattern = /(["'`])(pages\.common\.[A-Za-z0-9_-]+)\1/g;
    const actualKeys = [...new Set([...source.matchAll(commonKeyPattern)].map((match) => match[2]))].sort();

    assert.deepEqual(actualKeys, requiredKeys, "i18n head 必须完整且仅使用四个 pages.common fallback key");
    assert.doesNotMatch(source, /import\s+settings\s+from|from\s+["'][^"']*settings(?:\.js)?["']/, "i18n head 不得重新依赖 settings");
    assert.deepEqual(
        zhCNPages.common,
        {
            appendTitle: settings.suffix,
            fallbackTitle: settings.title,
            fallbackKeywords: settings.keywords,
            fallbackDescription: settings.description,
        },
        "简中 head fallback 必须与线上 settings 文案逐字一致"
    );
});
