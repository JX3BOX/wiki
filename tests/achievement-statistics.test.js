import assert from "node:assert/strict";
import test from "node:test";

import {
    normalizeCountableAchievementMetadata,
    summarizeVisibleAchievements,
} from "../src/utils/achievement-statistics.js";

test("零资历的可见成就仍计入成就数量", () => {
    const metadata = normalizeCountableAchievementMetadata({
        1001: [0, 1, 1],
        1002: [10, 1, 1],
        1003: [0, 2, 1],
    });

    assert.deepEqual(Object.keys(metadata), ["1001", "1002", "1003"]);
    assert.deepEqual(summarizeVisibleAchievements(metadata), {
        general: 2,
        general_point: 10,
        armor: 1,
        armor_point: 0,
    });
});

test("负数与非法 Point 不进入成就统计", () => {
    const metadata = normalizeCountableAchievementMetadata({
        1001: [-1, 1, 1],
        1002: ["invalid", 1, 1],
        1003: [0, 1, 1],
    });

    assert.deepEqual(Object.keys(metadata), ["1003"]);
});
