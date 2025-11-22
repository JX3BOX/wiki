import { $node, $cms } from "@jx3box/jx3box-common/js/https";
const $ = $node();

// import axios from "axios";
// const $ = axios.create({
//     baseURL: "http://localhost:7002/",
// });

export function getCategory(params) {
    return $.get(`/quest/category`, { params });
}

export function getQuest(params) {
    return $.get(`/quest/`, { params });
}

export function getQuests(params, body) {
    return $.post(`/quests`, body, { params });
}

export function getNewestQuests(params) {
    return $.get(`/quests/newest`, { params });
}

export function getWaiting(params) {
    params = Object.assign(params, {
        type: "quest",
    });
    return $cms().get(`/api/cms/wiki/post/waiting`, { params });
}

export function getQuestMaps(params) {
    return $.get(`/quest/maps`, { params });
}

// 获取任务公告
export function getBreadcrumb(key = "wiki_quest_ac") {
    return $cms()
        .get(`/api/cms/breadcrumb/${key}`)
        .then((res) => {
            return res.data.data.html || "";
        });
}

// 用户标记任务完成
export function completeUserQuest(role_id, quest_id) {
    return $cms().post(`/api/cms/wiki/user-quest/${role_id}/${quest_id}`);
}

// 用户取消标记任务完成
export function cancelUserQuest(role_id, quest_id) {
    return $cms().delete(`/api/cms/wiki/user-quest/${role_id}/${quest_id}`);
}

// 用户获取任务完成状态
export function listUserQuest(role_id) {
    return $cms().get(`/api/cms/wiki/user-quest/${role_id}`);
}
