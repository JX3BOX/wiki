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

const locales = {
    "zh-CN": { pages: zhCNPages, ui: zhCNUi },
    "zh-TW": { pages: zhTWPages, ui: zhTWUi },
    "en-US": { pages: enPages, ui: enUi },
    vi: { pages: viPages, ui: viUi },
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

async function sourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const target = path.join(directory, entry.name);
            if (entry.isDirectory()) return sourceFiles(target);
            return /\.(?:js|vue)$/.test(entry.name) ? [target] : [];
        })
    );
    return files.flat();
}

test("四个语言包拥有相同键与插值参数", () => {
    const baseline = flattenLeaves(locales["zh-CN"]);
    const expectedKeys = [...baseline.keys()].sort();

    for (const [locale, messages] of Object.entries(locales)) {
        const leaves = flattenLeaves(messages);
        assert.deepEqual([...leaves.keys()].sort(), expectedKeys, `${locale} 的翻译键不完整`);
        for (const key of expectedKeys) {
            assert.equal(typeof leaves.get(key), "string", `${locale}.${key} 必须是字符串`);
            assert.deepEqual(
                placeholders(leaves.get(key)),
                placeholders(baseline.get(key)),
                `${locale}.${key} 的插值参数不一致`
            );
        }
    }
});

test("源码中的静态 i18n 引用在所有语言包中存在", async () => {
    const srcRoot = fileURLToPath(new URL("../src", import.meta.url));
    const files = await sourceFiles(srcRoot);
    const references = new Map();
    const referencePattern = /\$t\s*\(\s*["']([^"']+)["']/g;

    for (const file of files) {
        const source = await readFile(file, "utf8");
        for (const match of source.matchAll(referencePattern)) {
            const locations = references.get(match[1]) || [];
            locations.push(path.relative(srcRoot, file));
            references.set(match[1], locations);
        }
    }

    for (const [locale, messages] of Object.entries(locales)) {
        const keys = flattenLeaves(messages);
        const missing = [...references.keys()].filter((key) => !keys.has(key));
        assert.deepEqual(
            missing,
            [],
            `${locale} 缺少源码引用：${missing.map((key) => `${key} (${references.get(key).join(", ")})`).join("; ")}`
        );
    }
});
