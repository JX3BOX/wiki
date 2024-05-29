import { $cms } from "@jx3box/jx3box-common/js/https";

function getKnowledgeList(params) {
    return $cms()
        .get(`api/cms/helper/knowledge`, { params })
}

// 获取玩法指南
function getMenuGroups(params) {
    return $cms()
        .get(`/api/cms/menu-group`, { params })
        .then((res) => {
            return res.data.data;
        });
}

// 获取通识子类
function getKnowledgeMenus() {
	return $cms().get(`/api/cms/helper/knowledge/types`);
}

// 获取通识count
function getKnowledgeCount(params) {
    return $cms().get(`/api/cms/helper/knowledge/count`, { params });
}

export { getKnowledgeList, getMenuGroups, getKnowledgeMenus, getKnowledgeCount };
