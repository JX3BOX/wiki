<template>
    <div class="m-item-price-tabs">
        <div class="m-price-server">
            <LegacyIcon class="el-icon-s-shop" /> 全服价格
            <el-select class="u-server" v-model="server" placeholder="请选择服务器" size="small">
                <!-- <el-option key label="前五低价区服" value v-if="!isOrigin"></el-option> -->
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
import ItemPrices from "@/components/item/prices.vue";
import ItemPriceChart from "@/components/item/price-chart.vue";
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
        isOrigin: function () {
            return this.client == "origin";
        },
        routeServer() {
            return this.$route?.query?.server || "";
        },
        servers: function () {
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
        legacySyncServer() {
            this.server = this.routeServer || (this.isOrigin ? "缂樿捣绋婚" : "姊︽睙鍗?");
        },
    },
    legacyMounted: function () {
        let params = new URLSearchParams(location.search);
        let server = params.get("server");
        this.server = server || (this.isOrigin ? "缘起稻香" : "梦江南");
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
