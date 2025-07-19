const matchList = [
    {
        pattern: (item) => item.IsQuest == 1,
        auc: [-1, 1],
    },
    {
        pattern: (item) =>
            (item.AucSubType == 1 && item.SubType == 15 && item.DetailType == 0) ||
            (item.AucSubType == 1 && item.SubType == 18 && item.DetailType == 4),
        auc: [5, 1],
    },
    {
        pattern: (item) => item.AucSubType == 2 && item.DetailType == 0,
        auc: [5, 2],
    },
    {
        pattern: (item) => item.AucSubType == 3 && item.DetailType == 3,
        auc: [5, 3],
    },
    {
        pattern: (item) => item.AucSubType == 4 && item.DetailType == 2,
        auc: [5, 4],
    },
    {
        pattern: (item) => item.AucSubType == 5 && item.DetailType == 1,
        auc: [5, 5],
    },
    {
        pattern: (item) => item.AucSubType == 6 && item.DetailType == 12,
        auc: [5, 6],
    },
    {
        pattern: (item) => item.SubType == 15 && item.DetailType != 0,
        auc: [5, -1],
    },
    {
        pattern: (item) => item.AucGenre == 15 && item.AucSubType >= 1 && item.AucSubType <= 5,
        auc: [15, 1],
    },
];

export function getItemAuc(item) {
    const match = matchList.find((match) => match.pattern(item));
    return match?.auc;
}
