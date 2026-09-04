<template>
    <div class="m-item-prices is-scrollable" v-loading="priceLoading">
        <table v-if="prices.length && !loadError">
            <thead>
                <tr>
                <th>{{ $t("ui.common.labels.item") }}</th>
                <th>{{ $t("ui.common.labels.level") }}</th>
                <th>{{ $t("ui.common.labels.uploadTime") }}</th>
                <th>{{ $t("ui.common.labels.server") }}</th>
                <th style="text-align: right">{{ $t("ui.common.labels.buyoutPrice") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(price, key) in prices" :key="key">
                <td>
                    <div class="m-item-icon">
                        <img class="u-icon" :src="icon_url(displayItem.IconID)" />
                        <span class="u-count" v-if="price.n_count > 1" v-text="price.n_count"></span>
                    </div>
                    <span
                        class="u-name"
                        v-text="displayItem.Name || '-'"
                        :class="{ white: displayItem.Quality == 1 }"
                        :style="{
                            color: item_color(displayItem.Quality || 0),
                        }"
                    ></span>
                </td>
                <td v-text="displayItem.RequireLevel || 1"></td>
                <td v-text="date_format(price.timestamp)"></td>
                <td v-text="price.server"></td>
                <td style="text-align: right" v-text="item_price(price.price)"></td>
                </tr>
            </tbody>
        </table>

        <AsyncState :loading="priceLoading" :error="loadError" :empty="!prices.length" @retry="get_data">
            <template #empty>{{ $t("ui.item.noPriceRecords") }}</template>
        </AsyncState>
    </div>
</template>

<script>
import { get_item, get_item_prices } from "@/service/item";
import { item_price as formatItemPrice, item_color } from "@/filters";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";

export default {
    name: "ItemPrices",
    props: ["item_id", "server"],
    data() {
        return {
            item: null,
            prices: [],
            priceLoading: false,
            loadError: false,
            requestGuard: createLatestRequestGuard(),
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        displayItem() {
            return this.item || {};
        },
        requestKey() {
            return `${this.item_id || ""}:${this.server || ""}:${this.client || ""}`;
        },
        currentLocale() {
            const locale = this.$i18n?.locale;
            return (locale && typeof locale === "object" ? locale.value : locale) || "zh-CN";
        },
    },
    methods: {
        dayjs,
        extractTimestamp(item) {
            const ts = item?.timestamp ?? item?.created ?? item?.date_ts ?? null;
            if (ts) return Number(ts);
            if (item?.date) return dayjs(item.date).unix();
            return 0;
        },
        extractPrice(item) {
            const value = item?.price ?? item?.unit_price ?? item?.n_money ?? item?.avg_price ?? 0;
            return Number(value) || 0;
        },
        get_data() {
            if (!this.item_id) {
                this.prices = [];
                this.item = null;
                return;
            }
            const token = this.requestGuard.begin();
            this.priceLoading = true;
            this.loadError = false;
            Promise.all([
                get_item_prices({
                    item_id: this.item_id,
                    server: this.server,
                    aggregate_type: "hourly",
                }),
                get_item(this.item_id, this.client),
            ])
                .then(([pricesResponse, itemResponse]) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    const data = Array.isArray(pricesResponse?.data) ? pricesResponse.data : [];
                    this.prices = data
                        .map((item) => ({
                            ...item,
                            timestamp: this.extractTimestamp(item),
                            price: this.extractPrice(item),
                        }))
                        .filter((item) => item.timestamp)
                        .sort((a, b) => b.timestamp - a.timestamp);
                    this.item = itemResponse?.data?.data?.item || null;
                })
                .catch(() => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.prices = [];
                    this.item = null;
                    this.loadError = true;
                })
                .finally(() => {
                    if (this.requestGuard.isCurrent(token)) this.priceLoading = false;
                });
        },
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
        item_price(price) {
            return formatItemPrice(
                price,
                {
                    brick: this.$t("ui.item.currency.brick"),
                    gold: this.$t("ui.item.currency.gold"),
                    silver: this.$t("ui.item.currency.silver"),
                    copper: this.$t("ui.item.currency.copper"),
                },
                this.currentLocale
            );
        },
        date_format(timestamp) {
            return dayjs(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
        },
        item_color,
    },
    watch: {
        requestKey: {
            immediate: true,
            handler() {
                this.get_data();
            },
        },
    },
    components: {
        AsyncState,
    },
    beforeUnmount() {
        this.requestGuard.invalidate();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/item-prices.less";
</style>
