const achievementMeta = {
    title: "成就百科",
    keywords: "劍網3成就,劍三成就,成就百科,成就攻略,奇遇成就,五甲成就,JX3BOX",
    description: "劍網3 成就百科，收錄最新、完整的成就資料、攻略與查詢功能。",
};

const itemMeta = {
    title: "物品百科",
    keywords: "劍網3物品,劍三物品,物品百科,物品資料,物品價格,物品清單,JX3BOX",
    description: "劍網3 物品百科，收錄物品資料、取得方式、價格與相關攻略。",
};

const knowledgeMeta = {
    title: "通識百科",
    keywords: "劍網3通識,劍三通識,通識百科,遊戲術語,世界觀,玩法指南,JX3BOX",
    description: "劍網3 通識百科，整理世界觀、術語、玩法與相關攻略。",
};

const questMeta = {
    title: "任務百科",
    keywords: "劍網3任務,劍三任務,任務百科,任務流程,任務獎勵,任務攻略,JX3BOX",
    description: "劍網3 任務百科，收錄任務流程、目標、獎勵與相關攻略。",
};

const gameMeta = {
    title: "成就百科",
    keywords: "劍網3百科,劍三百科,成就百科,無界成就,成就攻略,JX3BOX",
    description: "劍網3 百科，收錄旗艦版與無界版的成就資料及相關攻略。",
};

export default {
    cj: {
        home: { ...achievementMeta },
        normal: { ...achievementMeta },
        top_five: { ...achievementMeta },
        view: { ...achievementMeta },
        search: { ...achievementMeta },
        newest: { ...achievementMeta },
        waiting: { ...achievementMeta },
        adventure: { ...achievementMeta },
        rare: { ...achievementMeta },
    },
    item: {
        home: { ...itemMeta },
        normal: { ...itemMeta },
        search: { ...itemMeta },
        view: { ...itemMeta },
        plan_view: { ...itemMeta },
        plan_edit: { ...itemMeta },
        plan_list: { ...itemMeta },
        waiting: { ...itemMeta },
    },
    knowledge: {
        index: { ...knowledgeMeta },
        normal: { ...knowledgeMeta },
        view: { ...knowledgeMeta },
        search: { ...knowledgeMeta },
    },
    quest: {
        home: { ...questMeta },
        result: { ...questMeta },
        view: { ...questMeta },
        waiting: { ...questMeta },
        newest: { ...questMeta },
    },
    game: {
        home: { ...gameMeta },
        wiki: { ...gameMeta },
        wujie_cj_detail: { ...gameMeta },
    },
    common: {
        appendTitle: "｜劍網3魔盒（JX3BOX）",
        fallbackTitle: "劍網3百科",
        fallbackKeywords: "劍網3百科,劍三百科,成就百科,物品百科,任務百科,通識百科,JX3BOX",
        fallbackDescription: "劍網3百科，收錄成就、物品、任務與通識等完整遊戲資料。",
    },
};
