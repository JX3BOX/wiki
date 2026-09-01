<template>
    <div class="m-item-price-logs is-echarts" v-loading="priceLoading">
        <el-row class="m-today" v-if="currentPrice">
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-right u-avg" /> {{ $t("ui.item.average30") }}</div>
                <div class="u-value u-avg">
                    <GamePrice :price="currentPrice.avg" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-bottom u-min" /> {{ $t("ui.item.lowest30") }}</div>
                <div class="u-value u-min">
                    <GamePrice :price="currentPrice.lower" />
                </div>
            </el-col>
            <el-col :span="8">
                <div class="u-label"><LegacyIcon class="el-icon-top u-max" /> {{ $t("ui.item.highest30") }}</div>
                <div class="u-value u-max">
                    <GamePrice :price="currentPrice.higher" />
                </div>
            </el-col>
        </el-row>

        <div v-show="!hidden" id="m-item-price-chart" ref="chartContainer" style="width: 100%; height: 300px" />
        <div v-show="!hidden && logs.length" class="u-chart-legend">
            <i class="u-dot" />
            <span>{{ $t("ui.item.price") }}</span>
        </div>
        <AsyncState :loading="priceLoading" :error="loadError" :empty="!logs.length" @retry="get_data">
            <template #empty>{{ $t("ui.item.noPriceRecords") }}</template>
        </AsyncState>
    </div>
</template>

<script>
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
    GridComponent,
    GridSimpleComponent,
    TooltipComponent,
    LegendComponent,
    AxisPointerComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { get_item_prices } from "@/service/item";
import GamePrice from "@jx3box/jx3box-ui/src/wiki/GamePrice.vue";
import { item_price } from "@/filters";
import dayjs from "dayjs";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";

echarts.use([
    LineChart,
    GridComponent,
    GridSimpleComponent,
    TooltipComponent,
    LegendComponent,
    AxisPointerComponent,
    CanvasRenderer,
]);

export default {
    name: "ItemPriceChart",
    props: ["item_id", "server"],
    data() {
        return {
            logs: [],
            hidden: false,
            currentPrice: null,
            priceLoading: false,
            loadError: false,
            requestGuard: createLatestRequestGuard(),
        };
    },
    created() {
        this._chart = null;
        this._resizeTimer = null;
    },
    methods: {
        destroyChart() {
            if (this._chart) {
                this._chart.dispose();
            }
            this._chart = null;
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
            if (!this.item_id) {
                this.logs = [];
                this.currentPrice = null;
                return;
            }
            const token = this.requestGuard.begin();
            this.priceLoading = true;
            this.loadError = false;
            get_item_prices({
                item_id: this.item_id,
                server: this.server,
                aggregate_type: "daily",
            })
                .then((res) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    const data = Array.isArray(res?.data) ? res.data : [];
                    this.logs = data
                        .map((item) => {
                            const timestamp = this.extractTimestamp(item);
                            return {
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
                    this.$nextTick(() => {
                        this.render();
                    });
                })
                .catch(() => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.logs = [];
                    this.currentPrice = null;
                    this.hidden = true;
                    this.loadError = true;
                    this.destroyChart();
                })
                .finally(() => {
                    if (this.requestGuard.isCurrent(token)) this.priceLoading = false;
                });
        },
        render() {
            if (!this.logs.length || !this.$refs.chartContainer) {
                this.destroyChart();
                return;
            }

            if (!this._chart) {
                const existed = echarts.getInstanceByDom(this.$refs.chartContainer);
                if (existed) existed.dispose();
                this._chart = echarts.init(this.$refs.chartContainer);
            }
            const stride = Math.max(1, Math.ceil(this.logs.length / 7));

            const option = {
                    animation: false,
                    legend: {
                        show: false,
                    },
                    grid: {
                        left: 56,
                        right: 18,
                        top: 20,
                        bottom: 36,
                    },
                    tooltip: {
                        show: true,
                        trigger: "axis",
                        valueFormatter: (value) => item_price(Number(value) || 0),
                    },
                    xAxis: {
                        type: "category",
                        data: this.logs.map((item) => item.date),
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 0,
                            interval: (index) => {
                                return index % stride === 0 || index === this.logs.length - 1;
                            },
                        },
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                    yAxis: {
                        type: "value",
                        axisLabel: {
                            formatter: (val) => item_price(val),
                        },
                    },
                    series: [
                        {
                            type: "line",
                            name: this.$t("ui.item.price"),
                            coordinateSystem: "cartesian2d",
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            smooth: true,
                            symbol: "circle",
                            symbolSize: 8,
                            showSymbol: true,
                            data: this.logs.map((item) => item.price),
                            emphasis: {
                                focus: "series",
                            },
                            itemStyle: {
                                color: "#4e7cff",
                            },
                            lineStyle: {
                                width: 2,
                                color: "#4e7cff",
                                opacity: 1,
                            },
                        },
                    ],
                };
            this._chart.clear();
            this._chart.setOption(option, { notMerge: true, lazyUpdate: false });
            this._chart.resize();
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => {
                if (this._chart) this._chart.resize();
            }, 0);
        },
    },
    computed: {
        requestKey() {
            return `${this.item_id || ""}:${this.server || ""}`;
        },
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
        GamePrice,
        AsyncState,
    },
    beforeUnmount() {
        this.requestGuard.invalidate();
        clearTimeout(this._resizeTimer);
        this.destroyChart();
    },
    deactivated() {
        this.destroyChart();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/item-price-logs.less";
</style>
