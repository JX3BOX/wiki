<template>
    <div class="m-quest-card" @click="go(quest.id)">
        <div class="u-map">{{ quest.map }}</div>
        <div class="u-name">
            <span class="u-name-title">
                <el-tooltip v-if="quest.questType == 'act'" :content="$t('ui.quest.activityTip')" placement="top">
                    <img class="u-name-type" src="@/assets/img/quest/quest_logo_purple.png" />
                </el-tooltip>
                <el-tooltip v-else-if="quest.questType == 'repeat'" :content="$t('ui.quest.repeatTip')" placement="top">
                    <img class="u-name-type" src="@/assets/img/quest/quest_logo_blue.png" />
                </el-tooltip>
                <span class="u-name-text" :class="questNameClass">{{ quest.name }}</span>
                <el-tooltip
                    v-if="quest.schoolName"
                    :content="$t('ui.quest.schoolTip', { school: quest.schoolName })"
                    placement="top"
                >
                    <img class="u-name-school" :src="schoolIcon(quest.schoolName)" alt="" />
                </el-tooltip>
            </span>
            <span class="u-name-id">（ID：{{ quest.id }}）</span>
        </div>
        <div class="u-level">{{ quest.level }}</div>
        <div class="u-target">{{ quest.target }}</div>
        <div class="u-reward">
            <div class="u-reward-text__container">
                <span class="u-reward-text" v-for="reward in textReward" :key="reward.label + reward.data">
                    <span class="u-reward-label">{{ reward.label }}：</span>
                    <span class="u-reward-data">{{ reward.data }}</span>
                </span>
            </div>
            <div class="u-reward-item">
                <item-icon
                    v-for="(item, index) in items"
                    :key="index"
                    :item_id="item.id"
                    :amount="item.amount"
                    :size="28"
                ></item-icon>
            </div>
        </div>

        <div class="u-actions" @click.stop>
            <el-tooltip :content="$t('ui.quest.roleTip')" placement="top" v-if="!role">
                <LegacyIcon class="el-icon-info" />
            </el-tooltip>
            <el-button
                size="small"
                plain
                v-if="!isCompleted"
                @click.stop="onQuestComplete"
                :loading="loading"
                :disabled="!role"
                icon="Check"
            >
                {{ $t("ui.quest.markComplete") }}
            </el-button>
            <el-button
                size="small"
                plain
                type="info"
                v-if="isCompleted"
                @click.stop="onQuestCancel"
                :loading="loading"
                :disabled="!role"
                icon="Close"
            >
                {{ $t("ui.quest.markIncomplete") }}
            </el-button>
        </div>
    </div>
</template>

<script>
import { completeUserQuest, cancelUserQuest } from "@/service/quest";
import { schoolIcon, questTargetDescFormat } from "@/utils/quest";
import ItemIcon from "@/components/common/item-icon.vue";
import { mapState } from "vuex";

export default {
    name: "QuestCard",
    components: {
        ItemIcon,
    },
    props: {
        quest: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        loading: false,
    }),
    methods: {
        go(id) {
            this.$router.push({ name: "view", params: { quest_id: id } });
        },
        schoolIcon,
        moneyFormat(price) {
            let z = "";
            let result = {
                zhuan: Math.floor(price * 0.01 * 0.01 * 0.0001) || 0,
                jin: Math.floor((price * 0.01 * 0.01) % 10000) || 0,
                yin: Math.floor((price * 0.01) % 100) || 0,
                tong: Math.floor(price % 100) || 0,
            };
            if (result["zhuan"]) z += `${result["zhuan"]}${this.$t("ui.quest.currency.brick")}`;
            if (result["jin"]) z += `${result["jin"]}${this.$t("ui.quest.currency.gold")}`;
            if (result["yin"]) z += `${result["yin"]}${this.$t("ui.quest.currency.silver")}`;
            if (result["tong"]) z += `${result["tong"]}${this.$t("ui.quest.currency.copper")}`;
            return `${z}`;
        },
        onQuestCancel() {
            const role_id = this.role.ID;
            const quest_id = this.quest.id;
            this.loading = true;
            cancelUserQuest(role_id, quest_id)
                .then(() => {
                    this.$message.success(this.$t("ui.common.status.operationComplete"));
                    this.$store.commit("REMOVE_COMPLETED_QUEST", quest_id);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onQuestComplete() {
            const role_id = this.role.ID;
            const quest_id = this.quest.id;
            this.loading = true;
            completeUserQuest(role_id, quest_id)
                .then(() => {
                    this.$message.success(this.$t("ui.common.status.operationComplete"));
                    this.$store.commit("ADD_COMPLETED_QUEST", quest_id);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    computed: {
        ...mapState({
            role: (state) => state.currentRole,
            completed: (state) => state.completedQuests,
        }),
        isCompleted() {
            return this.completed.includes(this.quest.id);
        },
        targetFormatted() {
            return questTargetDescFormat(this.quest.desc?.Objective, this.$t("ui.quest.defaultPlayerName"));
        },
        items() {
            if (!this.quest.reward || this.quest.reward.length == 0) {
                return [];
            }
            const rewards = this.quest.reward.filter((i) => i.type == "item_group");
            let items = [];
            for (const reward of rewards) {
                if (Array.isArray(reward.items)) items.push(...reward.items);
            }
            return items.slice(0, 7);
        },
        questNameClass() {
            return {
                "is-repeat": this.quest.questType === "repeat",
                "is-act": this.quest.questType === "act",
            };
        },
        textReward() {
            const rewardList = Array.isArray(this.quest.reward) ? this.quest.reward : [];
            const rewards = rewardList.filter((i) => i.type != "item_group");
            let textRewards = [];
            const rewardName = {
                money: this.$t("ui.quest.rewardTypes.money"),
                exp: this.$t("ui.quest.rewardTypes.exp"),
                justice: this.$t("ui.quest.rewardTypes.justice"),
                prestige: this.$t("ui.quest.rewardTypes.prestige"),
                tongFund: this.$t("ui.quest.rewardTypes.guildFunds"),
                vigor: this.$t("ui.quest.rewardTypes.vigor"),
                tongResource: this.$t("ui.quest.rewardTypes.vehicleResource"),
                affect: this.$t("ui.quest.rewardTypes.reputation"),
                achievement: this.$t("ui.quest.rewardTypes.achievement"),
                train: this.$t("ui.quest.rewardTypes.cultivation"),
            };
            for (let r of rewards) {
                let data = r.count;
                if (r.type == "money") {
                    data = this.moneyFormat(data);
                } else if (r.type == "affect") {
                    data = `${r.force}${r.count > 0 ? "+" : ""}${r.count}`;
                }
                textRewards.push({
                    label: rewardName[r.type],
                    data,
                });
            }
            return textRewards;
        },
    },
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/quest/result/quest-card.less";
</style>
