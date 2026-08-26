function appendAchievementIds(value, target) {
    if (Array.isArray(value)) {
        value.forEach((item) => appendAchievementIds(item, target));
        return;
    }

    if (value === null || value === undefined || value === "") return;
    target.add(String(value));
}

function walkMenuNode(node, target) {
    if (!node || typeof node !== "object") return;
    appendAchievementIds(node.achievements || [], target);
    (node.children || []).forEach((child) => walkMenuNode(child, target));
}

export function collectMenuAchievementIds(menu) {
    const ids = new Set();
    const roots = Array.isArray(menu) ? menu : [menu];
    roots.forEach((root) => walkMenuNode(root, ids));
    return [...ids];
}

export function normalizeCountableAchievementMetadata(points) {
    return Object.entries(points || {}).reduce((metadata, [id, tuple]) => {
        if (!Array.isArray(tuple) || tuple.length < 3) return metadata;

        const point = Number(tuple[0]);
        const general = Number(tuple[1]);
        const visible = Number(tuple[2]);
        if (!Number.isFinite(point) || point <= 0 || ![0, 1, 2, 3].includes(general) || ![0, 1].includes(visible)) {
            return metadata;
        }

        metadata[String(id)] = {
            point,
            general,
            visible: visible === 1,
        };
        return metadata;
    }, {});
}

export function summarizeVisibleAchievements(metadata) {
    const count = {
        general: 0,
        general_point: 0,
        armor: 0,
        armor_point: 0,
    };

    Object.values(metadata || {}).forEach((item) => {
        if (!item.visible) return;
        if (item.general === 1) {
            count.general += 1;
            count.general_point += item.point;
        }
        if (item.general === 2) {
            count.armor += 1;
            count.armor_point += item.point;
        }
    });

    return count;
}
