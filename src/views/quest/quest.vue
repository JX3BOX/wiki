<template>
    <DefaultLayout
        :name="$t('ui.apps.quest')"
        slug="quest"
        root="/quest"
        without-right
        :publishEnable="true"
        :feedbackEnable="true"
        :crumbEnable="false"
    >
        <template #left>
            <CommonNav>
                <QuestNav> </QuestNav>
            </CommonNav>
        </template>
        <div class="m-search-wrap">
            <Search class="m-quest-search" :placeholder="$t('ui.quest.searchPlaceholder')" :hide-append-search="true" @search="search">
                <div>
                    <el-tooltip :content="$t('ui.quest.chainTip')" placement="top">
                        <el-checkbox v-model="chain">{{ $t("ui.quest.viewChain") }}</el-checkbox>
                    </el-tooltip>
                    <el-tooltip class="u-tips" effect="dark" placement="bottom">
                        <template #content>
                            <div>
                                <span>{{ $t("ui.quest.searchTips.name") }}</span> <br />
                                <span>{{ $t("ui.quest.searchTips.item") }}</span> <br />
                                <span>{{ $t("ui.quest.searchTips.achievement") }}</span> <br />
                            </div>
                        </template>
                        <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                </div>
                <template #append>
                    <el-popover
                        popper-class="u-player-setting-popover"
                        placement="top"
                        width="160"
                        v-model:visible="settingVisible"
                    >
                        <el-input v-model="playerName" :placeholder="$t('ui.quest.playerName')" @input="handlePlayerInfoChange" size="small"
                            ><template #prepend>{{ $t("ui.quest.playerName") }}</template></el-input
                        >
                        <el-input v-model="playerBody" :placeholder="$t('ui.quest.bodyType')" @input="handlePlayerInfoChange" size="small"
                            ><template #prepend>{{ $t("ui.quest.bodyType") }}</template></el-input
                        >
                        <div style="text-align: right; margin: 0">
                            <el-button type="primary" size="small" @click="settingVisible = false">{{ $t("ui.common.actions.confirm") }}</el-button>
                        </div>
                        <template #reference>
                            <div class="u-player">
                                <span class="u-player-name">{{ playerName }}</span
                                >|
                                <span class="u-player-body">{{ playerBody }}</span>
                                <el-icon><Setting></Setting></el-icon>
                            </div>
                        </template>
                    </el-popover>
                </template>
            </Search>
        </div>
        <router-view></router-view>
    </DefaultLayout>
</template>

<script>
import Search from "@/components/common/search.vue";
import CommonNav from "@/components/common/nav.vue";
import QuestNav from "@/components/quest/nav.vue";
import DefaultLayout from "@/layout/default-layout.vue";

import { getPlayerName } from "@/utils/quest";
export default {
    name: "Quest",
    components: { QuestNav, CommonNav, DefaultLayout, Search },
    data() {
        return {
            chain: false,
            settingVisible: false,
            playerName: this.$t("ui.quest.defaultPlayerName"),
            playerBody: this.$t("ui.quest.defaultPlayerBody"),
        };
    },
    methods: {
        search(keyword) {
            this.$router.push({
                name: "result",
                query: { keyword: keyword, chain: this.chain },
            });
        },
        handlePlayerInfoChange() {
            localStorage.setItem("QuestWiki:playerName", this.playerName);
            localStorage.setItem("QuestWiki:playerBody", this.playerBody);
        },
    },
    mounted() {
        const { playerName, playerBody } = getPlayerName({
            playerName: this.$t("ui.quest.defaultPlayerName"),
            playerBody: this.$t("ui.quest.defaultPlayerBody"),
        });
        this.playerName = playerName;
        this.playerBody = playerBody;
    },
};
</script>
<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/quest/index.less";
</style>
