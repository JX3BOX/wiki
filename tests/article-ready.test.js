import assert from "node:assert/strict";
import test from "node:test";

import { createArticleReadyTracker, waitForImages } from "../src/utils/article-ready.js";

function createContainer(images) {
    return {
        querySelectorAll(selector) {
            assert.equal(selector, "img");
            return images;
        },
    };
}

test("文章图片全部完成后返回 loaded", async () => {
    const image = new EventTarget();
    image.complete = false;
    const waiting = waitForImages(createContainer([image]), { timeout: 100 });

    image.dispatchEvent(new Event("load"));

    assert.equal(await waiting, "loaded");
});

test("文章图片等待可超时退出", async () => {
    const image = new EventTarget();
    image.complete = false;

    assert.equal(await waitForImages(createContainer([image]), { timeout: 0 }), "timeout");
});

test("新的就绪检测会取消上一轮且只提交最新结果", async () => {
    const firstImage = new EventTarget();
    firstImage.complete = false;
    const readyStatuses = [];
    const tracker = createArticleReadyTracker({
        timeout: 100,
        onReady(status) {
            readyStatuses.push(status);
        },
    });

    const first = tracker.wait(createContainer([firstImage]));
    const second = tracker.wait(createContainer([]));

    assert.equal(await first, false);
    assert.equal(await second, true);
    assert.deepEqual(readyStatuses, ["loaded"]);
});
