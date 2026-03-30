<template>
    <div class="m-item-prices">
        <table v-if="prices.length" v-loading="priceLoading">
            <thead>
                <tr>
                    <th>物品</th>
                    <th>等级</th>
                    <th>上传时间</th>
                    <th>服务器</th>
                    <th style="text-align: right">一口价 (总价)</th>
                    <th style="text-align: right">一口价 (单价)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(price, key) in prices" :key="key">
                    <td>
                        <div class="m-item-icon">
                            <img class="u-icon" :src="icon_url(item.IconID)" />
                            <span class="u-count" v-if="price.n_count > 1" v-text="price.n_count"></span>
                        </div>
                        <span
                            class="u-name"
                            v-text="item.Name"
                            :class="{ white: item.Quality == 1 }"
                            :style="{ color: item_color(item.Quality) }"
                        ></span>
                    </td>
                    <td v-text="item && item.RequireLevel ? item.RequireLevel : 1"></td>
                    <td v-text="date_format(price.created)"></td>
                    <td v-text="price.server"></td>
                    <td style="text-align: right" v-text="item_price(price.n_money)"></td>
                    <td style="text-align: right" v-text="item_price(price.unit_price)"></td>
                </tr>
            </tbody>
        </table>
        <div v-else style="text-align: center">🐖 暂无记录</div>
    </div>
</template>

<script>
import { get_item_prices, get_item } from "@/service/item";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import item_color from "@jx3box/jx3box-editor/src/assets/js/item/color.js";
import item_price from "@/utils/item-price.js";
import date_format from "@/utils/date-format.js";

export default {
    name: "ItemPrices",
    props: ["item_id", "server"],
    data() {
        return {
            item: null,
            prices: [],
            priceLoading: false,
        };
    },
    methods: {
        item_color,
        item_price,
        date_format,
        icon_url: iconLink,
        get_data() {
            if (this.item_id) {
                this.priceLoading = true;
                get_item_prices(this.item_id, {
                    server: this.server,
                    limit: 15,
                }).then((data) => {
                    this.priceLoading = false;
                    data = data.data;
                    this.prices = data.data.prices || [];
                });
                // 获取物品信息
                get_item(...this.params).then((data) => {
                    data = data.data;
                    this.item = data.data.item;
                });
            }
        },
    },
    computed: {
        params() {
            return [this.item_id, this.server];
        },
    },
    watch: {
        params: {
            deep: true,
            handler() {
                this.get_data();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/prices.less";
</style>
