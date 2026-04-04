<template>
    <div v-if="display" class="reward-item" :class="classes">
        <template v-if="reward.type == 'money'"> 获得金钱：<game-price :price="reward.count"></game-price> </template>
        <template v-else-if="reward.type == 'exp'"> 获得阅历：{{ reward.count }} </template>
        <template v-else-if="reward.type == 'affect'">
            获得声望：{{ reward.force }}（{{ affectNumber(reward.count) }}）
        </template>
        <point-reward v-else-if="reward.type == 'titlePoint'" :type="'titlePoint'" :value="`× ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'prestige'" :type="'prestige'" :value="`× ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'tongFund'" :type="'tongFund'" :value="`× ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'tongResource'" :type="'tongResource'" :value="`× ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'justice'" :type="'justice'" :value="`× ${reward.count}`">
        </point-reward>
        <point-reward v-else-if="reward.type == 'train'" :type="'train'" :value="`× ${reward.count}`"></point-reward>
        <point-reward v-else-if="reward.type == 'vigor'" :type="'vigor'" :value="`× ${reward.count}`"></point-reward>
        <point-reward
            v-else-if="reward.type == 'achievement'"
            :type="'achievement'"
            :value="reward.name"
            :icon="reward.icon"
            :id="reward.id"
        >
        </point-reward>
        <point-reward
            v-else-if="reward.type == 'skill'"
            :type="'skill'"
            :value="reward.name"
            :icon="reward.icon"
            :id="reward.id"
        >
        </point-reward>
        <template v-else-if="reward.type == 'item_group'">
            <p class="group-type">{{ itemGroupTips(reward) }}</p>
            <div class="item-list">
                <item-icon
                    v-for="(item, index) in reward.items"
                    :key="index"
                    :item_id="item.id"
                    :amount="item.amount"
                    :size="36"
                    :has_title="true"
                ></item-icon>
            </div>
        </template>
    </div>
</template>

<script>
import GamePrice from "@jx3box/jx3box-ui/src/wiki/GamePrice.vue";
import ItemIcon from "@/components/common/item-icon.vue";
import PointReward from "./point-reward.vue";

export default {
    name: "RewardItem",
    props: {
        reward: {
            type: Object,
        },
    },
    components: {
        GamePrice,
        ItemIcon,
        PointReward,
    },
    data() {
        return {
            display: true,
        };
    },
    computed: {
        classes() {
            return {
                "item-group": this.reward.type == "item_group",
                "gold-reward": this.reward.type == "money",
                "exp-reward": this.reward.type == "exp",
                "affect-reward": this.reward.type == "affect",
            };
        },
    },
    methods: {
        affectNumber(count) {
            return count > 0 ? `+${count}` : count;
        },
        itemGroupTips(award) {
            if (award.all) {
                return award.bySchool ? "你将获得以下全部道具（根据门派）：" : "你将获得以下全部道具：";
            }
            return "你可以在以下道具中选择一种：";
        },
    },
};
</script>

<style lang="less">
@import "@/assets/css/quest/single/reward-item.less";
@import "@jx3box/jx3box-editor/src/assets/css/module/item.less";
</style>
