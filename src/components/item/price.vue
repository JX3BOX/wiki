<template>
    <div class="p-price-new">
        <div class="m-price-title">
            <div class="u-title">📈 价格波动</div>
            <div class="m-server">
                <LegacyIcon class="el-icon-s-shop" /> 服务器
                <el-select
                    class="u-server"
                    style="width: 120px"
                    v-model="server"
                    placeholder="请选择服务器"
                    size="small"
                >
                    <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
                </el-select>
            </div>
        </div>
        <div class="m-price-content">
            <item-price-chart ref="item_price_chart" :item_id="sourceId" :server="server" />
        </div>

        <div class="m-price-title">
            <div class="u-title">💰 近期价格</div>
        </div>
        <div class="m-price-content">
            <item-prices :item_id="sourceId" :server="server" />
        </div>
    </div>
</template>

<script>
import ItemPrices from "@/components/item/prices.vue";
import ItemPriceChart from "@/components/item/price-chart.vue";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
export default {
    name: "PriceNew",
    components: {
        "item-prices": ItemPrices,
        "item-price-chart": ItemPriceChart,
    },
    props: ["sourceId"],
    inject: ["client"],
    data() {
        return {
            server: "",
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
    mounted() {
        let params = new URLSearchParams(location.search);
        let server = params.get("server");
        this.server = server || (this.isOrigin ? "缘起稻香" : "梦江南");
        this.$nextTick(() => {
            this.$refs.item_price_chart.render();
        });
    },
    legacyMounted() {
        this.server = this.routeServer || this.servers[0] || "";
        this.$nextTick(() => {
            this.$refs.item_price_chart?.render();
        });
    },
    watch: {
        routeServer() {
            this.server = this.routeServer || this.servers[0] || "";
            this.$nextTick(() => {
                this.$refs.item_price_chart?.render();
            });
        },
        client() {
            this.server = this.routeServer || this.servers[0] || "";
            this.$nextTick(() => {
                this.$refs.item_price_chart?.render();
            });
        },
    },
};
</script>

<style lang="less">
.p-price-new {
    .m-price-title {
        .flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f5f7fa;
        padding: 10px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        font-size: 15px;
        font-weight: 300;
        .m-server {
            .flex;
            justify-content: flex-end;
            align-items: center;
            gap: 5px;
            .u-server {
                margin-left: 5px;
            }
        }
    }
    .m-price-content {
        padding: 20px;
        box-sizing: border-box;
        border: 1px solid #e4e7ed;
        margin-bottom: 30px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .m-item-prices{
        .fz(12px);
    }
}
</style>
