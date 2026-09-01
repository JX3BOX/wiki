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
        };
    },
    computed: {
        countDict() {
            return {
                general: this.$t("ui.achievement.stats.general"),
                general_point: this.$t("ui.achievement.stats.generalPoints"),
                armor: this.$t("ui.achievement.stats.armor"),
                armor_point: this.$t("ui.achievement.stats.armorPoints"),
            };
        },
    },
    created() {
        // 统一从 v2 点数元数据派生成就数与资历数。
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
