<template>
    <router-link :to="{ name: 'waiting' }">
        <LegacyIcon class="el-icon-edit-outline" />
        <span>待攻略{{ name }}</span>
        <span v-if="showCounter" class="u-waiting" :style="waitingColorStyle()">（{{ solveRate.toFixed(2) }}%）</span>
    </router-link>
</template>

<script>
// 待攻略
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import { getWaitingRate } from "@/service/quest";
export default {
    name: "WikiCounter",
    props: {
        type: {
            type: String,
            default: "achievement",
        },
        showCounter: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            solveRate: 0,
        };
    },
    computed: {
        name() {
            let name = "成就";
            if (this.type === "item") {
                name = "物品";
            }
            if (this.type === "quest") {
                name = "任务";
            }
            return name;
        },
    },
    methods: {
        waitingColorStyle() {
            if (this.solveRate > 95) {
                return "color: #8dfa58";
            } else if (this.solveRate > 60) {
                return "color: #e2d849";
            } else {
                return "color: #ff3838";
            }
        },
    },
    mounted() {
        // 完成率
        wiki.counter({ type: this.type }).then((res) => {
            let { wiki_count: solve, source_count: all } = res.data.data ?? {};
            this.solveRate = (solve / all) * 100;
        });
    },
};
</script>

<style lang="less"></style>
