import { $helper, $next } from "@jx3box/jx3box-common/js/api";

function get_item_groups_with_price(params) {
    return $next().get(`api/item-groups/with-prices`, {
        params,
    });
}

export { get_item_groups_with_price };
