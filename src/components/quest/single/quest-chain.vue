<template>
    <div class="u-chain">
        <div class="list" v-if="showCurrent">
            <el-divider><LegacyIcon class="el-icon-connection" /> {{ $t("ui.quest.chain") }}</el-divider>
            <div class="u-chain-list">
                <span class="u-chain-name" v-for="(item, i) in display_data.current" :key="item.id">
                    <template v-if="item.logic !== undefined">
                        <span :class="{ all: item.logic, one: !item.logic }" v-for="b in item.quests" :key="b.id">
                            <router-link
                                class="u-chain-link"
                                :class="{ current: current == b.id }"
                                :to="{ name: 'view', params: { quest_id: b.id } }"
                            >
                                [{{ b.name }}]
                            </router-link>
                        </span>
                    </template>
                    <template v-else>
                        <router-link
                            class="u-chain-link"
                            :class="{ current: current == item.id }"
                            :to="{ name: 'view', params: { quest_id: item.id } }"
                        >
                            [{{ item.name }}]
                        </router-link>
                    </template>
                    <span v-if="i !== display_data.current.length - 1" class="u-chain-separator">》</span>
                </span>
            </div>
        </div>
        <div class="branch" v-if="showBranch">
            <el-divider><LegacyIcon class="el-icon-rank" /> {{ $t("ui.quest.branch") }}</el-divider>
            <div class="u-chain-list">
                <span class="u-chain-name" v-for="(item, index) in display_data.branch" :key="item.id">
                    <router-link class="u-chain-link" :to="{ name: 'view', params: { quest_id: item.id } }">
                        [{{ item.name }}]
                    </router-link>
                    <span v-if="index !== display_data.branch.length - 1" class="u-chain-separator">|</span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuestChain",
    props: {
        data: {
            type: Object,
        },
        current: {
            type: Number,
        },
    },
    computed: {
        display_data() {
            let current = Array.isArray(this.data?.current) ? [...this.data.current] : [];

            current = current
                .map((item) => {
                    if (!Object.prototype.hasOwnProperty.call(item || {}, "logic")) return item;

                    const quests = Array.isArray(item.quests) ? item.quests.filter((quest) => quest.visible) : [];

                    if (!quests.length) return null;
                    if (quests.length === 1) return quests[0];

                    return {
                        ...item,
                        quests,
                    };
                })
                .filter(Boolean);

            current = current.filter((item) => item && (Object.prototype.hasOwnProperty.call(item, "logic") || item.visible));

            let branch = Array.isArray(this.data?.branch) ? this.data.branch.filter((item) => item.visible) : [];

            if (branch.length === 1) {
                current = [...current, ...branch];
                branch = [];
            }

            return {
                current,
                branch,
            };
        },
        showBranch() {
            return this.display_data.branch.length > 0;
        },
        showCurrent() {
            return this.display_data.current.length > 1;
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/single/quest-chain.less";
</style>
