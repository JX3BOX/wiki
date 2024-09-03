<template>
    <div class="m-item-price-logs">
        <!--近30日价格-->
        <el-row class="m-today" v-if="currentPrice">
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-right u-avg"></i> 近30日均价</div>
                <div class="u-value u-avg">
                    <GamePrice :price="currentPrice.avg" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-bottom u-min"></i> 近30日最低价</div>
                <div class="u-value u-min">
                    <GamePrice :price="currentPrice.lower" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><i class="el-icon-top u-max"></i> 近30日最高价</div>
                <div class="u-value u-max">
                    <GamePrice :price="currentPrice.higher" />
                </div>
            </el-col>
        </el-row>

        <div v-show="!hidden" id="m-item-price-chart" />
        <div v-show="!logs.length" style="text-align: center">🐖 暂无记录</div>
    </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { get_item_prices } from "@/service/item";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import dayjs from "dayjs";
export default {
    name: "ItemPriceChart",
    props: ["item_id", "server"],
    data() {
        return {
            logs: [],
            chart: null,
            hidden: false,
            currentPrice: {},
        };
    },
    methods: {
        get_data() {
            if (this.item_id) {
                get_item_prices({
                    item_id: this.item_id,
                    server: this.server,
                    aggregate_type: "daily",
                }).then((res) => {
                    const data = res.data || [];
                    this.logs = data.map((item) => {
                        return {
                            type: "价格",
                            date: dayjs(item.timestamp * 1000).format("YYYY-MM-DD"),
                            price: item.price,
                        };
                    });
                    console.log(this.logs);
                    const prices = this.logs.map((item) => item.price);
                    const len = prices.length;
                    this.currentPrice = {
                        avg:
                            prices.reduce((acc, cur) => {
                                return acc + cur;
                            }, 0) / len,
                        lower: Math.min(...prices),
                        higher: Math.max(...prices),
                    };
                    this.hidden = !len;
                });
            }
        },
        render() {
            if (!this.chart) {
                this.chart = new Chart({
                    container: "m-item-price-chart",
                    autoFit: true,
                    width: "100%",
                    height: 300,
                });
            } else {
                this.chart.clear();
            }

            this.chart.scale({
                date: {
                    range: [0, 1],
                },
                price: {
                    nice: true,
                },
            });

            this.chart.axis("price", {
                label: {
                    formatter: (val) => {
                        return this.$options.filters.item_price(val);
                    },
                },
            });

            this.chart.tooltip({
                showCrosshairs: true,
                shared: true,
                customItems: (items) => {
                    for (let index = 0; index < items.length; index++) {
                        items[index].value = this.$options.filters.item_price(items[index].value);
                    }
                    return items;
                },
            });

            this.chart
                .line()
                .position("date*price")
                .color(this.server ? "type" : "server")
                .shape("smooth");

            this.chart
                .point()
                .position("date*price")
                .color(this.server ? "type" : "server")
                .shape("circle");

            this.chart.data(this.logs);
            this.chart.render();
        },
    },
    watch: {
        item_id() {
            this.get_data();
        },
        server: {
            immediate: true,
            handler() {
                this.get_data();
            },
        },
        logs() {
            this.render();
        },
    },
    components: {
        GamePrice,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/item-price-logs.less";
</style>
