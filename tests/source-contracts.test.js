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
    const expectedIcons = [
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

    assert.doesNotMatch(bootstrap, /import \* as ElementPlusIconsVue/);
    for (const icon of expectedIcons) {
        assert.match(bootstrap, new RegExp(`\\b${icon},`));
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
    assert.doesNotMatch(bootstrap, /import ElementPlus from "element-plus"/);
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
