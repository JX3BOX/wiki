import assert from "node:assert/strict";
import test from "node:test";
import { createMemoryHistory, createRouter } from "vue-router";

import { ITEM_NORMAL_PATH } from "../src/router/contracts.js";

const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ name: "normal", path: ITEM_NORMAL_PATH, component: {} }],
});

function resolveWithoutWarning(path) {
    const originalWarn = console.warn;
    console.warn = () => {};
    try {
        return router.resolve(path);
    } finally {
        console.warn = originalWarn;
    }
}

test("物品分类路由接受 empty 和数字分类", () => {
    assert.equal(resolveWithoutWarning("/empty/1").name, "normal");
    assert.equal(resolveWithoutWarning("/123/456").name, "normal");
});

test("物品分类路由拒绝字符类误匹配", () => {
    for (const path of ["/e/1", "/m/1", "/|/1", "/emptyx/1"]) {
        assert.equal(resolveWithoutWarning(path).name, undefined, `${path} 不应命中 normal 路由`);
    }
});
