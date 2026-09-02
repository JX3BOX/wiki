import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function readSource(relativePath) {
    return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

async function collectVueSources(directory = new URL("../src/", import.meta.url)) {
    const entries = await readdir(directory, { withFileTypes: true });
    const sources = [];
    for (const entry of entries) {
        const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
        if (entry.isDirectory()) {
            sources.push(...(await collectVueSources(url)));
        } else if (entry.name.endsWith(".vue")) {
            sources.push(await readFile(url, "utf8"));
        }
    }
    return sources;
}

test("Element Plus Popover 使用 visible 参数同步可见性", async () => {
    const sources = await Promise.all([readSource("src/components/item/plan.vue"), readSource("src/views/quest/quest.vue")]);

    for (const source of sources) {
        assert.doesNotMatch(source, /<el-popover\b[^>]*\bv-model\s*=/gs);
    }
    assert.equal(sources[0].match(/v-model:visible=/g)?.length, 2);
    assert.equal(sources[1].match(/v-model:visible=/g)?.length, 1);
});

test("任务地图在 Tab 显示后使用当前 Element Plus 字段重算尺寸", async () => {
    const source = await readSource("src/views/quest/single.vue");

    assert.match(source, /tab\.paneName === "map"/);
    assert.match(source, /this\.\$refs\.map && this\.\$refs\.map\.updateSize\(\)/);
    assert.doesNotMatch(source, /tab\.name\s*==+\s*"map"/);
});

test("任务地图坐标样式挂载在真实定位容器上", async () => {
    const source = await readSource("src/components/quest/single/quest-map.vue");

    assert.match(source, /<div\s+v-if="filter\[point\.Types\]"\s+class="u-map-point__warpper"/);
    assert.match(source, /:style="pointStyle\(point\.Coordinates, mapId\)"/);
    assert.doesNotMatch(source, /<el-popover\s+[^>]*class="u-map-point__warpper"/);
});

test("任务地图高度随响应式轮播自然撑开", async () => {
    const source = await readSource("src/assets/css/quest/single/quest-map.less");

    assert.doesNotMatch(source, /\.m-quest-map\s*\{[^}]*min-height:\s*768px/s);
});

test("全局事件监听在组件卸载时使用同一处理函数注销", async () => {
    const contracts = [
        ["src/views/cj/detail.vue", "openWikiPush", "handleWikiPush"],
        ["src/views/quest/single.vue", "openWikiPush", "handleWikiPush"],
        ["src/views/item/detail.vue", "openWikiPush", "handleWikiPush"],
        ["src/views/knowledge/knowledge-single.vue", "openWikiPush", "handleWikiPush"],
        ["src/views/cj/index.vue", "append-to-leap-schema", "handleAppendToLeapSchema"],
        ["src/components/item/my-plans.vue", "plan_list_refresh", "handlePlanListRefresh"],
    ];

    for (const [relativePath, eventName, handlerName] of contracts) {
        const source = await readSource(relativePath);
        assert.match(source, new RegExp(`bus\\.on\\("${eventName}", this\\.${handlerName}\\)`));
        assert.match(source, new RegExp(`bus\\.off\\("${eventName}", this\\.${handlerName}\\)`));
    }

    const qrCode = await readSource("src/components/common/qr-code.vue");
    assert.match(qrCode, /document\.addEventListener\("click", this\.handleDocumentClick\)/);
    assert.match(qrCode, /document\.removeEventListener\("click", this\.handleDocumentClick\)/);
});

test("PC 详情页复用可取消的文章图片就绪追踪", async () => {
    const detailPages = [
        "src/views/cj/detail.vue",
        "src/views/item/detail.vue",
        "src/views/quest/single.vue",
        "src/views/knowledge/knowledge-single.vue",
    ];

    for (const relativePath of detailPages) {
        const source = await readSource(relativePath);
        assert.match(source, /createArticleReadyTracker/);
        assert.match(source, /this\.articleReadyTracker\.cancel\(\)/);
        assert.doesNotMatch(source, /new Image\(\)|initImageLoader|preloadAllImages/);
    }
});

test("Element Plus 图标按实际使用集合注册", async () => {
    const bootstrap = await readSource("src/utils/bootstrap.js");
    const legacyIcon = await readSource("src/components/common/legacy-icon.vue");
    const directlyUsedIcons = [
        "ArrowLeft",
        "CaretRight",
        "Check",
        "Close",
        "Filter",
        "Plus",
        "QuestionFilled",
        "Refresh",
        "Search",
        "Setting",
        "Upload",
    ];
    const legacyMappedIcons = [...legacyIcon.matchAll(/"el-icon-[^"]+":\s*"([A-Za-z0-9]+)"/g)].map(
        (match) => match[1]
    );
    const expectedIcons = new Set([...directlyUsedIcons, ...legacyMappedIcons]);

    assert.doesNotMatch(bootstrap, /import \* as ElementPlusIconsVue/);
    for (const icon of expectedIcons) {
        assert.match(bootstrap, new RegExp(`\\b${icon},`), `${icon} 未在 bootstrap 中注册`);
    }
});

test("源码使用的 Element Plus 组件与指令均按需注册", async () => {
    const bootstrap = await readSource("src/utils/bootstrap.js");
    const sources = await collectVueSources();
    const usedTags = new Set();

    for (const source of sources) {
        for (const match of source.matchAll(/<el-([a-z0-9-]+)\b/g)) usedTags.add(match[1]);
    }

    for (const tag of usedTags) {
        const componentName = `El${tag
            .split("-")
            .map((part) => part[0].toUpperCase() + part.slice(1))
            .join("")}`;
        assert.match(bootstrap, new RegExp(`\\b${componentName},`), `${tag} 未在 bootstrap 中注册`);
    }

    assert.match(bootstrap, /\bElLoading,/);
    assert.match(bootstrap, /\bElInfiniteScroll,/);
    assert.match(bootstrap, /\bElRate,/);
    assert.doesNotMatch(bootstrap, /import ElementPlus from "element-plus"/);
});

test("小程序标识不再切换独立页面或加载专用样式", async () => {
    const routerSources = await Promise.all(
        ["cj", "knowledge", "item", "quest"].map((name) => readSource(`src/router/${name}.js`))
    );
    const appStyles = await readSource("src/assets/css/app.less");
    const bootstrap = await readSource("src/utils/bootstrap.js");

    for (const source of routerSources) {
        assert.doesNotMatch(source, /@\/views\/(?:cj|knowledge|item|quest)\/mobile\//);
        assert.doesNotMatch(source, /\bisMiniProgram\b|\bisApp\b/);
    }
    assert.doesNotMatch(appStyles, /miniprogram\/app\.less/);
    assert.match(bootstrap, /classList\.add\("v-miniprogram"\)/);
});

test("成就角色选择仅使用对象或 null 表示当前角色", async () => {
    const sidebar = await readSource("src/components/cj/sidebar.vue");
    const store = await readSource("src/store/cj.js");

    assert.doesNotMatch(sidebar, /this\.currentRole\s*=\s*""/);
    assert.doesNotMatch(sidebar, /key:\s*"role",\s*value:\s*""/);
    assert.doesNotMatch(sidebar, /list\.find\([^\n]+\)\s*\|\|\s*""/);
    assert.match(store, /\brole:\s*null,/);
});

test("成就详情的历史版本与打赏操作适配移动端窄屏", async () => {
    const styles = await readSource("src/assets/css/cj/detail.less");

    assert.match(styles, /\.m-histories\s*\{[\s\S]*?table-layout:\s*fixed/);
    assert.match(styles, /td:nth-child\(-n \+ 3\)[\s\S]*?white-space:\s*nowrap/);
    assert.match(styles, /\.m-wiki-thx-panel \.w-thx-panel\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    assert.match(styles, /\.u-count\s*\{[\s\S]*?white-space:\s*nowrap/);
});

test("任务名称颜色不在 JavaScript 中使用 Less 变量", async () => {
    const sources = await Promise.all([
        readSource("src/components/quest/result/quest-card.vue"),
        readSource("src/views/quest/single.vue"),
    ]);

    for (const source of sources) {
        const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1] || "";
        assert.doesNotMatch(script, /@v4primary/);
        assert.match(source, /:class="questNameClass"/);
    }
});
