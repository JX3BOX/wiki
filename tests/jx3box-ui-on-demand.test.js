import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(relativePath) {
    return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

function assertLocalComponent(source, name, importPath) {
    assert.match(source, new RegExp(`import ${name} from ["']${importPath.replaceAll("/", "\\/")}["']`));
    assert.match(source, new RegExp(`components:\\s*\\{[\\s\\S]*?\\b${name},`), `${name} 必须局部注册`);
}

function assertImportOrder(source, names, relativePath) {
    const positions = names.map((name) => source.indexOf(`import ${name} `));
    positions.forEach((position, index) => {
        assert.notEqual(position, -1, `${relativePath} 缺少 ${names[index]} import`);
    });
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b), `${relativePath} 的共享样式导入顺序不一致`);
}

test("JX3BOX UI 仅直引 i18n 能力并保留翻译 mixin", async () => {
    const source = await readSource("src/utils/bootstrap.js");

    assert.match(
        source,
        /import\s*\{\s*createJx3boxUiI18n,\s*getJx3boxUiAvailableLocales\s*\}\s*from\s*["']@jx3box\/jx3box-ui\/i18n["']/
    );
    assert.match(source, /import i18nMixin from ["']@jx3box\/jx3box-ui\/i18n\/mixin["']/);
    assert.match(source, /app\.mixin\(i18nMixin\)/);
    assert.doesNotMatch(source, /from\s*["']@jx3box\/jx3box-ui["']/);
    assert.doesNotMatch(source, /\bJX3BOX_UI\b|app\.use\([^)]*jx3box/i);
});

test("原先依赖全局 install 的 JX3BOX UI 组件全部局部注册", async () => {
    const layout = await readSource("src/layout/default-layout.vue");
    for (const name of ["Breadcrumb", "Footer", "LeftSidebar", "Main", "RightSidebar"]) {
        assertLocalComponent(layout, name, `@jx3box/jx3box-ui/src/${name}.vue`);
    }

    const sideMsg = await readSource("src/components/common/side-msg.vue");
    assertLocalComponent(sideMsg, "RightSideMsg", "@jx3box/jx3box-ui/src/RightSideMsg.vue");

    const detailPages = [
        "src/views/cj/detail.vue",
        "src/views/item/detail.vue",
        "src/views/quest/single.vue",
        "src/views/knowledge/knowledge-single.vue",
    ];
    for (const relativePath of detailPages) {
        const source = await readSource(relativePath);
        assert.match(source, /<Thx\b/);
        assertLocalComponent(source, "Thx", "@jx3box/jx3box-ui/src/single/Thx.vue");
    }
});

test("多页面共享组件保持一致导入顺序以避免 CSS 拆包冲突", async () => {
    const shellPages = [
        "src/views/cj/index.vue",
        "src/views/item/index.vue",
        "src/views/quest/quest.vue",
        "src/views/knowledge/knowledge.vue",
    ];
    for (const relativePath of shellPages) {
        assertImportOrder(await readSource(relativePath), ["DefaultLayout", "CommonNav", "Search"], relativePath);
    }

    const detailPages = [
        "src/views/cj/detail.vue",
        "src/views/item/detail.vue",
        "src/views/quest/single.vue",
        "src/views/knowledge/knowledge-single.vue",
    ];
    for (const relativePath of detailPages) {
        assertImportOrder(await readSource(relativePath), ["Article", "WikiPanel", "WikiRevisions"], relativePath);
    }
});
