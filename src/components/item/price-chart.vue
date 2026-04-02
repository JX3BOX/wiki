<template>
    <div class="m-item-price-logs">
        <!--近30日价格-->
        <el-row class="m-today" v-if="currentPrice">
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-right u-avg" /> 近30日均价</div>
                <div class="u-value u-avg">
                    <GamePrice :price="currentPrice.avg" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-bottom u-min" /> 近30日最低价</div>
                <div class="u-value u-min">
                    <GamePrice :price="currentPrice.lower" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-top u-max" /> 近30日最高价</div>
                <div class="u-value u-max">
                    <GamePrice :price="currentPrice.higher" />
                </div>
            </el-col>
        </el-row>

        <!-- 昨日价格 -->
        <el-row class="m-today" v-if="!today && yesterday">
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-right u-avg" /> 今日均价</div>
                <div class="u-value u-avg">
                    <GamePrice :price="yesterday.price" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-bottom u-min" /> 今日最低价</div>
                <div class="u-value u-min">
                    <GamePrice :price="yesterday.min_price" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-top u-max" /> 今日最高价</div>
                <div class="u-value u-max">
                    <GamePrice :price="yesterday.max_price" />
                </div>
            </el-col>
        </el-row>

        <div v-show="!hidden" id="m-item-price-chart" ref="chartContainer" />
        <div v-show="!logs.length" style="text-align: center">🐖 暂无记录</div>
    </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { get_item_prices } from "@/service/item";
import GamePrice from "@/components/game-price.vue";
import item_price from "@/utils/item-price.js";
import dayjs from "dayjs";

export default {
    name: "ItemPriceChart",
    props: ["item_id", "server"],
    data() {
        return {
            logs: [],
            chart: null,
            hidden: false,
            currentPrice: null,
            fetchToken: 0,
        };
    },
    methods: {
        getYAxisDomain() {
            const prices = this.logs.map((item) => Number(item.price) || 0);
            if (!prices.length) return { min: 0, max: 1 };
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            if (min === max) {
                return { min: min - 2, max: max + 2 };
            }
            // 对齐历史版：下方略多留白、上方少量留白
            return { min: Math.floor(min) - 3, max: Math.ceil(max) + 1 };
        },
        destroyChart() {
            if (this.chart && typeof this.chart.destroy === "function") {
                this.chart.destroy();
            }
            this.chart = null;
        },
        extractPrice(item) {
            const value = item?.price ?? item?.avg_price ?? item?.unit_price ?? item?.n_money ?? 0;
            return Number(value) || 0;
        },
        extractTimestamp(item) {
            const ts = item?.timestamp ?? item?.created ?? item?.date_ts ?? null;
            if (ts) return Number(ts);
            if (item?.date) return dayjs(item.date).unix();
            return 0;
        },
        get_data() {
            if (!this.item_id) return;
            const token = ++this.fetchToken;
            get_item_prices({
                item_id: this.item_id,
                server: this.server,
                aggregate_type: "daily",
            })
                .then((res) => {
                    if (token !== this.fetchToken) return;
                    const data = Array.isArray(res?.data) ? res.data : [];
                    this.logs = data
                        .map((item) => {
                            const timestamp = this.extractTimestamp(item);
                            return {
                                type: "价格",
                                date: dayjs(timestamp * 1000).format("YYYY-MM-DD"),
                                price: this.extractPrice(item),
                            };
                        })
                        .filter((item) => item.date !== "Invalid Date");

                    const prices = this.logs.map((item) => item.price);
                    const len = prices.length;
                    this.currentPrice = len
                        ? {
                              avg: prices.reduce((acc, cur) => acc + cur, 0) / len,
                              lower: Math.min(...prices),
                              higher: Math.max(...prices),
                          }
                        : null;
                    this.hidden = !len;
                    this.render();
                })
                .catch(() => {
                    if (token !== this.fetchToken) return;
                    this.logs = [];
                    this.currentPrice = null;
                    this.hidden = true;
                    this.destroyChart();
                });
        },
        render() {
            if (!this.logs.length) {
                this.destroyChart();
                return;
            }

            this.destroyChart();
            this.chart = new Chart({
                container: this.$refs.chartContainer || "m-item-price-chart",
                autoFit: true,
                height: 200,
            });
            const { min, max } = this.getYAxisDomain();
            const stride = Math.max(1, Math.ceil(this.logs.length / 7));
            const visibleDates = new Set(
                this.logs
                    .map((item, index) => ({ date: item.date, index }))
                    .filter(({ index }) => index % stride === 0 || index === this.logs.length - 1)
                    .map(({ date }) => date)
            );

            this.chart.options({
                type: "view",
                data: this.logs,
                scale: {
                    x: { range: [0, 1] },
                    y: { min, max, nice: false },
                },
                axis: {
                    x: {
                        title: false,
                        tickCount: 7,
                        labelAutoRotate: false,
                        labelAutoHide: false,
                        labelFormatter: (val) => (visibleDates.has(val) ? val : ""),
                    },
                    y: {
                        title: false,
                        tickCount: 5,
                        labelFormatter: (val) => item_price(val),
                    },
                },
                legend: {
                    color: {
                        position: "bottom",
                    },
                },
                tooltip: {
                    items: [
                        {
                            channel: "y",
                            valueFormatter: (val) => item_price(val),
                        },
                    ],
                },
                children: [
                    {
                        type: "line",
                        encode: {
                            x: "date",
                            y: "price",
                            color: this.server ? "type" : "server",
                        },
                        style: { shape: "smooth", lineWidth: 2 },
                    },
                    {
                        type: "point",
                        encode: {
                            x: "date",
                            y: "price",
                            color: this.server ? "type" : "server",
                        },
                        style: { shape: "circle", r: 3 },
                    },
                ],
            });
            this.chart.render();
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
            immediate: true,
            handler() {
                this.get_data();
            },
        },
    },
    components: {
        GamePrice,
    },
    beforeUnmount() {
        this.destroyChart();
    },
    deactivated() {
        this.destroyChart();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/price-logs.less";
</style>
