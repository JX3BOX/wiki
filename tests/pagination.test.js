import assert from "node:assert/strict";
import test from "node:test";

import { canGoNextCursorPage } from "../src/utils/pagination.js";

test("游标分页在总数仍有剩余时允许进入下一页", () => {
    assert.equal(
        canGoNextCursorPage({ loading: false, nextCursor: "cursor-15", total: 31, page: 1, pageSize: 15 }),
        true
    );
    assert.equal(
        canGoNextCursorPage({ loading: false, nextCursor: "cursor-30", total: 31, page: 2, pageSize: 15 }),
        true
    );
});

test("游标分页在最后一页禁用下一页", () => {
    assert.equal(
        canGoNextCursorPage({ loading: false, nextCursor: "cursor-31", total: 31, page: 3, pageSize: 15 }),
        false
    );
    assert.equal(
        canGoNextCursorPage({ loading: false, nextCursor: "cursor-30", total: 30, page: 2, pageSize: 15 }),
        false
    );
});

test("游标分页在加载中或缺少游标时禁用下一页", () => {
    assert.equal(
        canGoNextCursorPage({ loading: true, nextCursor: "cursor-15", total: 31, page: 1, pageSize: 15 }),
        false
    );
    assert.equal(canGoNextCursorPage({ loading: false, total: 31, page: 1, pageSize: 15 }), false);
});
