import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import filterItemPrice from "../src/filters/item-price.js";
import { formatItemPrice, splitItemPrice } from "../src/utils/item-price.js";
import enUi from "../src/locale/en-US/ui.js";
import viUi from "../src/locale/vi/ui.js";
import zhCNUi from "../src/locale/zh-CN/ui.js";
import zhTWUi from "../src/locale/zh-TW/ui.js";

async function readSource(relativePath) {
    return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("物品价格纯函数按砖金银铜拆分，并由 filter 复用唯一实现", () => {
    assert.deepEqual(splitItemPrice(100020304), {
        brick: 1,
        gold: 2,
        silver: 3,
        copper: 4,
    });
    assert.equal(filterItemPrice, formatItemPrice);
});

test("物品价格单位覆盖现有四语且保留台湾繁体", () => {
    const cases = [
        ["zh-CN", zhCNUi.item.currency, "1砖2金3银4铜"],
        ["zh-TW", zhTWUi.item.currency, "1磚2金3銀4銅"],
        ["en-US", enUi.item.currency, "1 brick 2 gold 3 silver 4 copper"],
        ["vi", viUi.item.currency, "1 gạch 2 vàng 3 bạc 4 đồng"],
    ];

    for (const [locale, units, expected] of cases) {
        assert.equal(formatItemPrice(100020304, units, locale), expected, locale);
    }
});

test("活动 PC 价格表与图表注入 item 命名空间单位，图表随 locale 重绘", async () => {
    const table = await readSource("src/components/item/item-prices.vue");
    const chart = await readSource("src/components/item/item-price-chart.vue");

    for (const unit of ["brick", "gold", "silver", "copper"]) {
        assert.match(table, new RegExp(`this\\.\\$t\\(["']ui\\.item\\.currency\\.${unit}["']\\)`));
        assert.match(chart, new RegExp(`this\\.\\$t\\(["']ui\\.item\\.currency\\.${unit}["']\\)`));
    }
    assert.match(table, /item_price\(price\)\s*\{[\s\S]*?formatItemPrice\([\s\S]*?this\.currentLocale/);
    assert.match(chart, /valueFormatter:\s*\(value\)\s*=>\s*this\.formatPrice\(/);
    assert.match(chart, /formatter:\s*\(val\)\s*=>\s*this\.formatPrice\(val\)/);
    assert.match(chart, /watch:\s*\{[\s\S]*?currentLocale\(\)\s*\{[\s\S]*?this\.logs\.length[\s\S]*?this\.render\(\)/);
});
