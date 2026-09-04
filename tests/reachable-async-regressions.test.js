import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(relativePath) {
    return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("关联成就加载失败时按产品要求保持静默", async () => {
    const source = await readSource("src/components/cj/relations.vue");

    assert.match(source, /v-if="\(relations && relations\.length\) \|\| npc"/);
    assert.doesNotMatch(source, /relations === false \|\|/);
    assert.doesNotMatch(source, /ui\.common\.status\.loadFailed/);
    assert.match(source, /\.catch\(\(\) => \{\s*this\.relations = false;\s*\}\)/);
});
