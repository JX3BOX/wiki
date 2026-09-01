import assert from "node:assert/strict";
import test from "node:test";

import { createLatestRequestGuard } from "../src/utils/latest-request.js";

test("仅最新一次请求可以提交结果", () => {
    const guard = createLatestRequestGuard();
    const first = guard.begin();
    const second = guard.begin();

    assert.equal(guard.isCurrent(first), false);
    assert.equal(guard.isCurrent(second), true);
});

test("组件卸载后所有未完成请求都会失效", () => {
    const guard = createLatestRequestGuard();
    const token = guard.begin();

    guard.invalidate();

    assert.equal(guard.isCurrent(token), false);
});
