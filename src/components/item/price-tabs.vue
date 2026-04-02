<template>
    <div class="m-item-price-tabs">
        <div class="m-price-server">
            <LegacyIcon class="el-icon-s-shop" />
            <span class="u-label">全服价格</span>
            <el-select class="u-server" v-model="server" placeholder="请选择服务器" size="small">
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
        </div>

        <el-tabs v-model="activeTab" type="border-card" @tab-click="active_tab_handle">
            <el-tab-pane label="📈 价格波动" name="item-price-chart">
                <item-price-chart ref="item_price_chart" :item_id="sourceId" :server="server" />
            </el-tab-pane>
            <el-tab-pane label="💰 近期价格" name="item-prices">
                <item-prices :item_id="sourceId" :server="server" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ItemPrices from "@/components/item/item-prices.vue";
import ItemPriceChart from "@/components/item/item-price-chart.vue";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";

export default {
    name: "PriceTabs",
    props: ["sourceId"],
    inject: ["client"],
    data() {
        return {
            server: "",
            activeTab: "item-price-chart",
        };
    },
    computed: {
        isOrigin() {
            return this.client == "origin";
        },
        routeServer() {
            return this.$route?.query?.server || "";
        },
        servers() {
            return this.isOrigin ? servers_origin : servers_std;
        },
    },
    methods: {
        active_tab_handle(tab) {
            if (tab.name === "item-price-chart") {
                this.$nextTick(() => {
                    this.$refs.item_price_chart?.render();
                });
            }
        },
    },
    mounted() {
        this.server = this.routeServer || this.servers[0] || "";
    },
    watch: {
        routeServer: {
            immediate: true,
            handler() {
                this.server = this.routeServer || this.servers[0] || "";
            },
        },
        client() {
            this.server = this.routeServer || this.servers[0] || "";
        },
    },
    components: {
        "item-prices": ItemPrices,
        "item-price-chart": ItemPriceChart,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/price-tabs.less";
</style>
