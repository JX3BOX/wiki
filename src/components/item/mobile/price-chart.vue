<template>
    <v-chart class="m-mobile-price-chart" :option="option" autoresize />
</template>

<script>
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { TooltipComponent, GridComponent, DataZoomComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart, { THEME_KEY } from "vue-echarts";

use([TooltipComponent, GridComponent, DataZoomComponent, LineChart, CanvasRenderer]);

const formatGameCurrency = (value) => {
    if (value === 0) return "0铜";
    const units = [
        { name: "砖", value: 100000000 },
        { name: "金", value: 10000 },
        { name: "银", value: 100 },
        { name: "铜", value: 1 },
    ];

    let res = "";
    let count = 0;
    let tempValue = value;

    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (tempValue >= unit.value || (count > 0 && count < 2)) {
            const amount = Math.floor(tempValue / unit.value);
            if (amount > 0 || count > 0) {
                res += amount + unit.name;
                count++;
            }
            tempValue %= unit.value;
        }
        if (count === 2) break; // 只保留前两个量级
    }
    return res || "0铜";
};

export default {
    name: "MobilePriceChart",
    props: ["priceList"],
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: "dark",
    },
    computed: {
        option() {
            if (!this.priceList) return {};
            // 格式化日期 (YYYY-MM-DD)
            const dates = this.priceList.map((item) => {
                const date = new Date(item.timestamp * 1000);
                return `${date.getMonth() + 1}-${date.getDate()}`;
            });
            const prices = this.priceList.map((item) => item.price);

            return {
                backgroundColor: "transparent",
                tooltip: {
                    trigger: "axis",
                    formatter: function (params) {
                        let date = params[0].name;
                        let val = params[0].value;
                        return `${date}<br/>价格: ${formatGameCurrency(val)}`;
                    },
                },
                grid: {
                    top: 10,
                    left: 10,
                    right: 10,
                    bottom: 25,
                    containLabel: false, // 必须设为 false 才能真正意义上“零边距”
                },
                xAxis: {
                    type: "category",
                    data: dates,
                    show: true,
                    axisLine: { show: false }, // 隐藏轴线
                    axisTick: { show: false }, // 隐藏刻度
                    axisLabel: {
                        color: "#999", // 日期文字颜色
                        fontSize: 10,
                        interval: "auto", // 自动计算显示密度，防止手机端重叠
                    },
                    boundaryGap: false,
                },
                yAxis: {
                    type: "value",
                    show: false, // 不再显示Y轴
                    scale: true,
                    min: function (value) {
                        return value.min * 0.99;
                    },
                    max: function (value) {
                        return value.max * 1.01;
                    },
                    interval: function (value) {
                        return (value.max - value.min) / 5;
                    },
                    splitNumber: 5, // 加上底部的 0 位，通常会产生 6 条分割线
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#E0E0E0", // 灰色横线
                        },
                    },
                },
                dataZoom: [
                    {
                        type: "inside",
                        startValue: this.priceList.length - 7,
                        endValue: this.priceList.length - 1,
                    },
                ],
                series: [
                    {
                        name: "价格",
                        type: "line",
                        smooth: false, // 平滑曲线
                        data: prices,
                        symbol: "circle",
                        symbolSize: 6,
                        lineStyle: {
                            width: 2,
                            color: "#32ADE6",
                        },
                        areaStyle: {
                            color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    { offset: 0, color: "rgba(84,112,198,0.4)" },
                                    { offset: 1, color: "rgba(84,112,198,0)" },
                                ],
                            },
                        },
                    },
                ],
            };
        },
    },
};
</script>

<style less scoped>
.m-mobile-price-chart {
    height: 140px;
}
</style>
