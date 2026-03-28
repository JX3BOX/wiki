<template>
    <DefaultLayout
        name="任务百科"
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
            <Search :placeholder="placeholder" @search="search">
                <div>
                    <el-tooltip content="查看任务链需要键入完整任务名或任务ID哦" placement="top">
                        <el-checkbox v-model="chain">查看任务链</el-checkbox>
                    </el-tooltip>
                    <el-tooltip class="u-tips" effect="dark" placement="bottom">
                        <template #content>
                            <div>
                            <span>※ 支持任务名称精确或模糊搜索</span> <br />
                            <span>※ 支持任务相关物品名称精确搜索</span> <br />
                            <span>※ 支持成就名称精确搜索</span> <br />
                            </div>
                        </template>
                        <el-button link icon="el-icon-question"></el-button>
                    </el-tooltip>
                </div>
            </Search>
            <el-popover popper-class="u-player-setting-popover" placement="top" width="160" v-model="settingVisible">
                <el-input v-model="playerName" placeholder="称呼" @input="handlePlayerInfoChange" size="small"
                    ><template #prepend>称呼</template></el-input
                >
                <el-input v-model="playerBody" placeholder="体型" @input="handlePlayerInfoChange" size="small"
                    ><template #prepend>体型</template></el-input
                >
                <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="small" @click="settingVisible = false">确定</el-button>
                </div>
                <template #reference>
                    <div class="u-player">
                        <span class="u-player-name">{{ playerName }}</span
                        >|
                        <span class="u-player-body">{{ playerBody }}</span>
                        <el-button link icon="el-icon-setting"></el-button>
                    </div>
                </template>
            </el-popover>
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
            placeholder: "输入任务关键字（可包括中括号），「回车」进行搜索",
            chain: false,
            settingVisible: false,
            playerName: "侠士",
            playerBody: "少侠",
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
        const { playerName, playerBody } = getPlayerName();
        this.playerName = playerName;
        this.playerBody = playerBody;
    },
};
</script>
<style lang="less">
@import "~@/assets/css/app.less";
.m-search-wrap {
    .flex;
    width: 100%;
    align-items: center;

    @media screen and (min-width: 768px) {
        .el-input-group__append {
            .u-input-button__small {
                .none;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .el-input-group__append {
            .u-input-button__normal {
                .none;
            }
        }
    }

    & > span:last-of-type {
        flex-shrink: 0;
    }
    .u-player {
        .flex;
        padding: 0 12px 10px 12px;
        align-items: center;
        .fz(14px, 1.5);
        .el-button {
            .ml(2px);
        }
    }

    .u-tips {
        margin: 0 0 0 8px !important;
    }
}

.u-player-setting-popover {
    .el-input {
        margin-bottom: 6px;
    }
}
@media screen and (max-width: @phone) {
    .m-search-wrap .u-player {
        .none;
    }
}
</style>
