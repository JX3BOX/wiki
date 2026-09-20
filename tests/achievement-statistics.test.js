import assert from "node:assert/strict";
import test from "node:test";

import {
    collectMenuAchievementSeries,
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

test("分类按当前可见档位合并系列，保留零资历并跨层级去重", () => {
    const metadata = normalizeCountableAchievementMetadata({
        1: [10, 1, 1], 2: [20, 1, 1], 3: [0, 1, 1],
        4: [10, 1, 0], 5: [30, 2, 1], 6: [10, 0, 1],
    });
    const menus = [{ achievements: [[1, [2]], 3, 4, 5, 6, 999], children: [
        { achievements: [[1, 2]] },
    ] }];
    const groups = collectMenuAchievementSeries(menus, metadata, 1);
    assert.deepEqual(groups, [["1", "2"], ["3"]]);
    assert.deepEqual(collectMenuAchievementSeries(menus, metadata, 2), [["5"]]);
    assert.deepEqual(collectMenuAchievementSeries(menus, {}, 1), []);
    const completed = new Set(["1", "3"]);
    assert.equal(groups.filter((ids) => ids.every((id) => completed.has(id))).length, 1);
});
