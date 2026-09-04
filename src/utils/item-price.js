export const DEFAULT_ITEM_PRICE_UNITS = Object.freeze({
    brick: "砖",
    gold: "金",
    silver: "银",
    copper: "铜",
});

export function splitItemPrice(price) {
    const brick = parseInt(price / 100 / 100 / 10000);
    const gold = parseInt((price / 100 / 100) % 10000);
    const silver = parseInt((price / 100) % 100);
    const copper = parseInt(price % 100);

    return { brick, gold, silver, copper };
}

export function formatItemPrice(price, units = DEFAULT_ITEM_PRICE_UNITS, locale = "zh-CN") {
    const amounts = splitItemPrice(price);
    const resolvedUnits = { ...DEFAULT_ITEM_PRICE_UNITS, ...units };
    const separator = /^zh(?:-|$)/i.test(String(locale)) ? "" : " ";
    const parts = [];
    const formatPart = (amount, unit) => `${amount}${separator}${unit}`;

    if (amounts.brick) parts.push(formatPart(amounts.brick, resolvedUnits.brick));
    if (amounts.gold) parts.push(formatPart(amounts.gold, resolvedUnits.gold));
    if (amounts.silver) parts.push(formatPart(amounts.silver, resolvedUnits.silver));
    parts.push(formatPart(amounts.copper, resolvedUnits.copper));

    return parts.join(separator);
}

export default formatItemPrice;
