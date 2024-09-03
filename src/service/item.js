import { $next, $node, $cms, axios } from "@jx3box/jx3box-common/js/https";
const $ = $node({ mute: true });
// const $ = axios.create({ baseURL: 'http://localhost:7002' });

export function getMyFav(params) {
    return $next().get(`api/article/favorites/my`, {
        params,
    });
}

export function delMyFav(id) {
    return $next().delete(`api/article/favorites/my/${id}`);
}

export function addMyFav(id, type = "item") {
    return $next().post(`api/article/favorites/add/${id}/${type}`);
}

export function getMenus() {
    return $.get(`api/node/item/menus`);
}

export function get_items_count() {
    return $.get(`api/node/item/count`);
}

export function get_item_enums() {
    return $.get(`/item/enums`);
}

// 获取物品
export function get_item(item_id) {
    if (!item_id) return;
    return $.get(`api/node/item/${item_id}`);
}

// 判断是否显示价格
export function show_item_prices(item_id, params) {
    if (!item_id) return;
    return $next().get(`api/item-price/${item_id}/detail`, {
        params,
    });
}

// // 物品价格日志
// export function get_item_price_logs(item_id, params) {
//     if (!item_id) return;
//     return $next().get(`api/item-price/${item_id}/logs`, {
//         params,
//     });
// }

// // 物品区服价格日志
// export function get_item_servers_price_logs(item_id, params) {
//     if (!item_id) return;
//     return $next().get(`api/item-price/${item_id}/logs`, {
//         params,
//     });
// }

// 物品价格
export function get_item_prices(data) {
    if (!data.item_id) return;
    return $next().post(`api/auction/`, data);
}

// 通过node的接口获取物品
export function get_items_by_node(params) {
    let ids = params.ids instanceof Array ? params.ids.join(",") : params.ids;
    return $.get(`/item_merged/id/${ids}`, {
        params: {
            client: params.client ?? "std",
            per: params.per ?? 20,
        },
    });
}

export function getItemsByName(name, params) {
    return $.get(`/item_merged/name/${name}`, {
        params,
    });
}

export function get_newest_items(params) {
    return $.get(`/item/newest`, {
        params: {
            client: params.client ?? "std",
        },
    });
}

export function get_items(params) {
    return $.get(`api/node/item/list`, {
        params,
    });
}

export function get_items_search(params) {
    return $.get(`api/node/item/search`, {
        params,
    });
}

export function get_menu_items(params) {
    return $.get(`api/node/item/menu_list`, {
        params,
    });
}

export function get_waiting(params) {
    return $cms().get(`/api/cms/wiki/post/waiting`, { params });
}

// 获取生活技艺产品原料
export function getManufactureDetail(params) {
    return $.get(`/manufactures`, {
        params,
    });
}

// 获取物品详情
export function getItemDetail(params) {
    return $.get(`/other`, {
        params,
    });
}
