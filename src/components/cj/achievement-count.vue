<template>
    <div class="m-achievement-count">
        <div class="u-stat">
            <span v-for="(text, key) in countDict" :key="key">
                <em>{{ text }}</em>
                <b>{{ count[key] }}</b>
            </span>
        </div>
    </div>
</template>
<script>
import { getAchievementPointsV2 } from "@/service/achievement";
import {
    normalizeCountableAchievementMetadata,
    summarizeVisibleAchievements,
} from "@/utils/achievement-statistics";

export default {
    name: "AchievementCount",
    data() {
        return {
            count: {},
            countDict: {
                general: "常规成就数",
                general_point: "常规资历数",
                armor: "五甲成就数",
                armor_point: "五甲资历数",
                // post_count: "收录攻略数",
            },
        };
    },
    created() {
        // 统一从 v2 点数元数据派生数量，零资历成就不进入统计。
        getAchievementPointsV2().then((response) => {
            const metadata = normalizeCountableAchievementMetadata(response.data?.data?.points || {});
            this.count = summarizeVisibleAchievements(metadata);
            this.$store.commit("SET_STATE", { key: "achievementMetadata", value: metadata });
            this.$store.commit("SET_STATE", { key: "generalTotal", value: ~~this.count["general"] });
            this.$store.commit("SET_STATE", { key: "armorTotal", value: ~~this.count["armor"] });
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/achievement-count.less";
</style>
