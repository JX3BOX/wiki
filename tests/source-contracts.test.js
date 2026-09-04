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

test("通识分类列表不会把子列表解析成自身并递归挂载", async () => {
    const source = await readSource("src/views/knowledge/knowledge-list.vue");

    assert.doesNotMatch(source, /<knowledgeList\b/);
});

test("通识列表卡片在手机窄屏保持标题与元信息列对齐", async () => {
    const item = await readSource("src/components/knowledge/list-item.vue");
    const itemStyles = await readSource("src/assets/css/knowledge/item.less");
    const list = await readSource("src/components/knowledge/list.vue");

    assert.match(item, /class="u-tags-content"/);
    assert.match(item, /class="u-remark-content"/);
    assert.match(itemStyles, /\.u-name\s*\{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*auto minmax\(0, 1fr\)/);
    assert.doesNotMatch(itemStyles, /flex:\s*1 1 220px/);
    assert.match(itemStyles, /\.u-tags\s*\{[\s\S]*?grid-template-columns:\s*18px minmax\(0, 1fr\)/);
    assert.match(list, /\.v-knowledge-list\s+\.m-knowledge\s*\{/);
});

test("通识详情的标题、提示条与打赏区在手机窄屏不会压缩溢出", async () => {
    const detailStyles = await readSource("src/assets/css/knowledge/single.less");

    assert.match(detailStyles, /\.v-knowledge-single\s+\.u-detail-title\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) auto/);
    assert.match(detailStyles, /\.m-wiki-top__content\s*\{[\s\S]*?line-height:\s*1\.75/);
    assert.match(detailStyles, /\.m-wiki-thx-panel \.w-thx-panel\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    assert.match(detailStyles, /\.u-count\s*\{[\s\S]*?white-space:\s*nowrap/);
    assert.match(detailStyles, /\.w-thx-copyright\s*\{[\s\S]*?text-align:\s*left[\s\S]*?line-height:\s*1\.7/);
});

test("四类 Wiki 详情的头部操作在移动端收为可访问的图标按钮", async () => {
    const detailPages = await Promise.all(
        [
            "src/views/cj/detail.vue",
            "src/views/item/detail.vue",
            "src/views/quest/single.vue",
            "src/views/knowledge/knowledge-single.vue",
            "src/components/common/wiki-revisions.vue",
        ].map(readSource)
    );
    const appStyles = await readSource("src/assets/css/app.less");

    for (const source of detailPages) {
        assert.match(source, /class="[^"]*u-wiki-action[^"]*"/);
        assert.match(source, /:aria-label="\$t\([^)]+\)"/);
        assert.match(source, /class="u-wiki-action-label"/);
    }

    assert.match(appStyles, /\.m-wiki-post-panel[^\n{]*\.u-wiki-action\.u-btn--link\s*\{[\s\S]*?width:\s*36px[\s\S]*?height:\s*36px/);
    assert.match(appStyles, /\.m-wiki-post-panel[^\n{]*\.m-panel-actions\s*\{[\s\S]*?position:\s*static[\s\S]*?transform:\s*none/);
    assert.match(appStyles, /\.u-wiki-action-label\s*\{[\s\S]*?position:\s*absolute[\s\S]*?clip-path:\s*inset\(50%\)/);
});

test("公共机器人提示在四类 Wiki 详情的移动端按完整语句换行", async () => {
    const robotTip = await readSource("src/components/common/wiki-robot-tip.vue");
    const detailPages = await Promise.all(
        [
            "src/views/cj/detail.vue",
            "src/views/item/detail.vue",
            "src/views/quest/single.vue",
            "src/views/knowledge/knowledge-single.vue",
        ].map(readSource)
    );

    for (const source of detailPages) assert.match(source, /wiki-robot-tip|WikiRobotTip|wikiRobotTip/);
    assert.match(robotTip, /\.m-qq\s*\{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) auto/);
    assert.match(robotTip, /\.m-reply\s*\{[\s\S]*?display:\s*flex[\s\S]*?flex-wrap:\s*wrap/);
    assert.match(robotTip, /\.u-reply\s*\{[\s\S]*?max-width:\s*100%[\s\S]*?white-space:\s*normal[\s\S]*?overflow-wrap:\s*anywhere/);
});

test("四类 Wiki 详情的打赏说明在移动端不会从单词中间断行", async () => {
    const appStyles = await readSource("src/assets/css/app.less");

    assert.match(appStyles, /\.m-wiki-post-panel \.m-wiki-thx-panel \.w-thx-panel\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    assert.match(appStyles, /\.m-wiki-post-panel \.m-wiki-thx-panel \.u-count\s*\{[\s\S]*?white-space:\s*nowrap/);
    assert.match(appStyles, /\.m-wiki-post-panel \.m-wiki-thx-panel \.w-thx-copyright\s*\{[\s\S]*?text-align:\s*left[\s\S]*?word-break:\s*normal[\s\S]*?overflow-wrap:\s*anywhere/);
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
    // 可达的 JX3BOX DesignTask 内部使用 el-rate，必须保留全局兼容注册。
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

test("成就详情的历史版本与打赏模块在移动端完整展示长文案", async () => {
    const styles = await readSource("src/assets/css/cj/detail.less");

    assert.match(styles, /\.m-histories\s*\{[\s\S]*?tr\s*\{[\s\S]*?grid-template-columns:\s*minmax\(72px, auto\) minmax\(0, 1fr\)/);
    assert.match(styles, /&:nth-child\(3\),\s*&:nth-child\(4\)\s*\{[\s\S]*?grid-column:\s*1 \/ -1/);
    assert.match(styles, /&::before\s*\{[\s\S]*?white-space:\s*normal[\s\S]*?overflow-wrap:\s*anywhere/);
    assert.match(styles, /\.m-wiki-thx-panel\s*\{[\s\S]*?\.w-thx-panel\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    assert.match(styles, /\.u-count\s*\{[\s\S]*?white-space:\s*nowrap/);
    assert.match(styles, /\.w-thx-copyright\s*\{[\s\S]*?text-align:\s*left[\s\S]*?line-height:\s*1\.7/);
});

test("物品详情的打赏操作在手机窄屏不会压缩计数", async () => {
    const styles = await readSource("src/assets/css/item/detail.less");

    assert.match(styles, /#m-item-view\s*\{[\s\S]*?\.m-wiki-thx-panel \.w-thx-panel\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    assert.match(styles, /\.m-wiki-thx-panel \.w-thx-panel \.u-count\s*\{[\s\S]*?flex:\s*none/);
    assert.match(styles, /\.m-wiki-thx-panel \.u-count\s*\{[\s\S]*?white-space:\s*nowrap/);
    assert.match(styles, /\.m-wiki-thx-panel \.w-thx-copyright\s*\{[\s\S]*?text-align:\s*left[\s\S]*?line-height:\s*1\.7/);
});

test("公共历史版本在手机端切换为不横向溢出的摘要卡片", async () => {
    const revisions = await readSource("src/components/common/wiki-revisions.vue");

    assert.match(revisions, /:data-label="\$t\('ui\.common\.labels\.revisionNote'\)"/);
    assert.match(revisions, /@media screen and \(max-width: 480px\)/);
    assert.match(revisions, /grid-template-columns:\s*48px minmax\(86px, 1fr\) minmax\(72px, 1fr\)/);
    assert.match(revisions, /&:nth-child\(4\)\s*\{[\s\S]*?grid-column:\s*1 \/ -1/);
});

test("物品清单弹层不使用无语义的子清单箭头并保持两级列表对齐", async () => {
    const plan = await readSource("src/components/item/plan.vue");

    assert.doesNotMatch(plan, /class="el-icon-arrow-right"/);
    assert.match(plan, /\.u-child\s*\{[\s\S]*?display:\s*flex/);
    assert.match(plan, /\.u-child\s*\{[\s\S]*?padding:\s*7px 10px 7px 28px/);
});

test("移动端操作区与多语言导航文本允许在窄屏内完整展示", async () => {
    const appStyles = await readSource("src/assets/css/app.less");
    const achievementHomeStyles = await readSource("src/assets/css/cj/home.less");
    const commonNav = await readSource("src/components/common/nav.vue");

    assert.match(appStyles, /\.m-search-view \.m-normal-op\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    assert.match(appStyles, /\.el-button \+ \.el-button\s*\{[\s\S]*?margin-left:\s*0/);
    assert.match(achievementHomeStyles, /\.u-qlink a\s*\{[\s\S]*?height:\s*auto/);
    assert.match(achievementHomeStyles, /span\s*\{[\s\S]*?white-space:\s*normal[\s\S]*?overflow-wrap:\s*anywhere/);
    assert.match(commonNav, /\.u-menu\s*\{[\s\S]*?writing-mode:\s*vertical-rl/);
    assert.match(commonNav, /text-orientation:\s*mixed/);
});

test("Wiki 首页待攻略入口在桌面端单行展示并在手机端紧凑排列", async () => {
    const counter = await readSource("src/components/common/counter.vue");
    const commonStyles = await readSource("src/assets/css/common/index.less");
    const homeStyles = await readSource("src/assets/css/cj/home.less");

    assert.match(counter, /class="u-counter-main"[\s\S]*?<LegacyIcon[\s\S]*?waitingGuide/);
    assert.match(commonStyles, /\.u-counter-link\s*\{[\s\S]*?flex-flow:\s*row nowrap[\s\S]*?white-space:\s*nowrap/);
    assert.match(commonStyles, /\.u-counter-main\s*\{[\s\S]*?display:\s*inline-flex[\s\S]*?align-items:\s*center/);
    assert.match(commonStyles, /\.u-waiting\s*\{[\s\S]*?flex:\s*none[\s\S]*?white-space:\s*nowrap/);
    assert.match(homeStyles, /\.u-qlink \.u-counter-link\s*\{[\s\S]*?flex-direction:\s*column[\s\S]*?flex-wrap:\s*nowrap/);
    assert.match(homeStyles, /\.u-waiting\s*\{[\s\S]*?font-size:\s*12px/);
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
