import { $cms } from "@jx3box/jx3box-common/js/https";
// 贡献排行榜
export function getWikiRanking(params) {
    return $cms().get(`/api/cms/wiki/post/rank`, {
        params,
    });
}

//当前待审核的版本
export function getWiki(post_id, params) {
    return $cms().get(`/api/cms/wiki/post/id/${post_id}`, { params });
}

export function getUserInfo(uid) {
    return $cms({ mute: true }).get(`/api/cms/user/${uid}/info`);
}
