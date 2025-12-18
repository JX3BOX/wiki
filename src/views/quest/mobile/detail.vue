<template>
    <div class="c-var p-mobile-quest-detail">
        <div class="m-page-container">
            <fold-card class="m-quest-info" :title="sourceName" :fixed="true">
                <div class="u-target">
                    <p v-html="targetDesc"></p>
                    <template v-if="source?.killNpcs?.length > 0">
                        <div class="u-target-sub" v-for="(killNpc, i) in source?.killNpcs" :key="`kn` + i">
                            <span>击杀</span>
                            <span>{{ killNpc.name }}</span>
                            <el-tooltip v-if="killNpc.share" content="该目标可共享击杀" placement="top">
                                <img src="@/assets/img/quest/target-15.png" alt="" />
                            </el-tooltip>
                            <span> x {{ killNpc.amount }}</span>
                        </div>
                    </template>
                    <template v-if="source?.needItems?.length > 0">
                        <div class="u-target-sub" v-for="(needItem, i) in source.needItems" :key="`ni` + i">
                            <span>收集</span>
                            <item-icon :item_id="needItem.id" :has_title="true" :size="18"></item-icon>
                            <span>x {{ needItem.amount }}</span>
                        </div>
                    </template>
                    <div
                        class="u-target-sub"
                        v-for="(questValue, i) in source?.questValues || []"
                        :key="questValue + i"
                    >
                        <span>{{ questValue.str }} x {{ questValue.value }}</span>
                    </div>
                </div>
                <div class="u-pos">
                    <div class="u-pos-item">
                        <span class="u-label">任务起点：</span>
                        <template v-if="source?.start?.type === 'npc'">
                            <span class="u-map"> {{ source?.start?.mapName || "未知地图" }} </span> -
                            <span class="u-npc">
                                {{ source?.start?.name || "未知NPC" }}
                            </span>
                            <span class="u-id">(ID: {{ source?.start?.id }})</span>
                        </template>
                        <template v-if="source?.start?.type === 'item'">
                            <item-icon class="u-item" :size="18" :item_id="source?.start?.id" has_title></item-icon>
                            <span class="u-id">(ID: {{ source?.start?.id }})</span>
                        </template>
                    </div>
                    <div class="u-pos-item">
                        <span class="u-label">任务终点：</span>
                        <template v-if="source?.start?.type === 'npc'">
                            <span class="u-map"> {{ source?.start?.mapName || "未知地图" }} </span> -
                            <span class="u-npc">
                                {{ source?.start?.name || "未知NPC" }}
                            </span>
                            <span class="u-id">(ID: {{ source?.start?.id }})</span>
                        </template>
                        <template v-if="source?.start?.type === 'item'">
                            <item-icon class="u-item" :size="18" :item_id="source?.start?.id" has_title></item-icon>
                            <span class="u-id">(ID: {{ source?.start?.id }})</span>
                        </template>
                    </div>
                </div>
            </fold-card>
            <button class="m-confirm" :class="{ complete: isCompleted }" @click="toggleConfirmShow">
                {{ isCompleted ? "设为未完成" : "设为已完成" }}
            </button>

            <fold-card class="m-quest-info" title="任务描述">
                <p class="u-desc" v-html="questDesc"></p>
            </fold-card>
            <fold-card title="任务文案">
                <div class="m-quest-dialog">
                    <div class="u-dialog" v-if="source?.desc?.AcceptRpgID?.dialogues?.length">
                        <p class="u-subtitle2"><span>接任务对话</span></p>
                        <p
                            class="u-dialog-content"
                            v-for="(dialog, index) in source.desc.AcceptRpgID.dialogues"
                            :key="index"
                            v-html="questDescFormat(dialog[0])"
                        ></p>
                    </div>
                    <div class="u-dialog" v-if="source?.desc?.FinishRpgID?.dialogues?.length">
                        <p class="u-subtitle2"><span>任务完成对话</span></p>
                        <p
                            class="u-dialog-content"
                            v-for="(dialog, index) in source.desc.FinishRpgID.dialogues"
                            :key="index"
                            v-html="questDescFormat(dialog[0])"
                        ></p>
                    </div>
                    <div class="u-dialog" v-if="source?.desc?.DunningDialogue">
                        <p class="u-subtitle2"><span>任务进行中</span></p>
                        <p class="u-dialog-content" v-html="questDescFormat(source.desc.DunningDialogue)"></p>
                    </div>
                    <div class="u-dialog" v-if="source?.desc?.FinishedDialogue">
                        <p class="u-subtitle2"><span>任务完成</span></p>
                        <p class="u-dialog-content" v-html="questDescFormat(source.desc.FinishedDialogue)"></p>
                    </div>
                </div>
            </fold-card>

            <fold-card title="任务攻略" v-if="post_id">
                <div class="m-wiki">
                    <div class="m-wiki-header">
                        <div class="u-avatar-list">
                            <div v-for="item in authors" :key="item.user_id" class="u-avatar">
                                <img :src="showAvatar(item.user_avatar)" />
                            </div>
                        </div>
                        <div class="u-time">
                            {{ updated_at }}
                        </div>
                    </div>
                    <div class="m-content-box">
                        <Article id="wikiArticle" :content="clearContent(wiki_post?.post?.content)" />
                    </div>
                </div>
            </fold-card>

            <fold-card title="任务链" v-if="source?.chain">
                <quest-chain :data="source?.chain" :current="id" />
            </fold-card>

            <!-- 评论区 -->
            <div class="m-comments">
                <miniprogram-comment-list :source-id="id" type="quest" />
            </div>
        </div>
        <suspend-common
            v-if="!isFromTarget"
            class="u-suspend-common"
            :btn-options="{
                showHome: true,
                showIcon: false,

                showMore: true,
            }"
            :drawer-options="drawerOptions"
            style="width: 100%"
            @search="onSearch"
            ref="suspendCommon"
        >
            <template #default>
                <div class="m-more-action">
                    <div class="u-action" @click="() => (userSelectShow = true)">
                        <img src="@/assets/img/cj/mobile/user.svg" svg-inline />
                    </div>
                    <div
                        class="u-action"
                        @click="() => $refs.suspendCommon.clickDrawer({ type: 'collect', text: '收藏' }, 1)"
                    >
                        <img
                            v-if="$refs.suspendCommon?.isCollect"
                            src="@/assets/img/cj/mobile/collect_un.svg"
                            svg-inline
                        />
                        <img v-else src="@/assets/img/cj/mobile/collect.svg" svg-inline />
                    </div>
                    <div
                        class="u-action"
                        @click="() => $refs.suspendCommon.clickDrawer({ type: 'pin', text: '固定按钮' }, 1)"
                    >
                        <img v-if="$refs.suspendCommon?.fixIsActive" src="@/assets/img/cj/mobile/pin.svg" svg-inline />
                        <img v-else src="@/assets/img/cj/mobile/pin_un.svg" svg-inline />
                    </div>
                </div>
            </template>
        </suspend-common>

        <user-select-drawer :visible.sync="userSelectShow" :current-role="currentRole" @change="setRole" />

        <confirm-ok-drawer :visible.sync="conformShow" :current="isCompleted" @confirm="toggleCompleted" />
    </div>
</template>

<script>
import { mapState } from "vuex";

import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import UserSelectDrawer from "@/components/cj/mobile/user-select-drawer.vue";
import ConfirmOkDrawer from "@/components/cj/mobile/confirm-ok-drawer.vue";
import MiniprogramCommentList from "@/components/cj/mobile/comment-list.vue";
import ItemIcon from "@/components/common/item-icon.vue";
import FoldCard from "@/components/quest/mobile/fold-card.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import QuestChain from "@/components/quest/mobile/quest-chain.vue";

import { getQuest, completeUserQuest, cancelUserQuest, listUserQuest, getQuests } from "@/service/quest";
import { isInMiniprogramWebview } from "@/utils/minprogram";
import { publishLink, showAvatar, showSchoolIcon, ts2str } from "@jx3box/jx3box-common/js/utils";
import { questDescFormat, questTargetDescFormat } from "@/utils/quest.js";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { postHistory, postStat } from "@jx3box/jx3box-common/js/stat";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "MobileQuestDetail",
    components: {
        FoldCard,
        ItemIcon,
        SuspendCommon,
        UserSelectDrawer,
        ConfirmOkDrawer,
        MiniprogramCommentList,
        QuestChain,
        Article,
    },
    data() {
        return {
            loading: true,
            source: "",
            wiki_post: "",

            userSelectShow: false,

            conformShow: false,
            confirmLoading: false,
        };
    },
    computed: {
        ...mapState({
            onlyNotCompleted: (state) => state.onlyNotCompleted,
            completedQuests: (state) => state.completedQuests,
            currentRole: (state) => state.currentRole,
            client: (state) => state.client,
        }),
        isCompleted() {
            return this.completedQuests.includes(Number(this.id));
        },
        targetDesc() {
            return questTargetDescFormat(this.source?.desc?.Objective).replaceAll("&emsp;", "");
        },
        questDesc() {
            return questDescFormat(this.source?.desc?.Description, true).replace(/^&emsp;&emsp;\n/, "");
        },

        id() {
            return Number(this.$route.params.quest_id); 
        },
        post_id() {
            return this.wiki_post?.post?.id || undefined;
        },
        author_id() {
            return ~~this.wiki_post.post?.user_id;
        },
        user_name() {
            return this.wiki_post?.post?.user_nickname;
        },
        user_avatar() {
            return this.wiki_post?.post?.user_avatar;
        },
        updated_at() {
            return ts2str(this.wiki_post?.post?.updated);
        },
        authors: function () {
            return (
                this.wiki_post?.users
                    ?.filter((user) => user.id)
                    ?.map((user) => {
                        return {
                            user_id: user.id,
                            user_avatar: user.avatar,
                            display_name: user.nickname,
                        };
                    }) || []
            );
        },
        sourceName() {
            return this.source?.desc?.QuestName || this.source?.name;
        },
        isFromTarget() {
            return false;
        },
        drawerOptions() {
            return {
                hideType: ["report"], //需要隐藏的type,如['search','pin']
                direction: "btt", //弹出框方向，btt、ttb、rtl、ltr
                drawerTitle: this.sourceName, //弹出框标题
                author: {
                    name: this.user_name, //作者名称
                    avatar: this.user_avatar, //作者头像
                    author_id: this.author_id, //作者id
                },
                subscribeType: "wiki",
                postType: "quest",
                id: this.post_id,
                title: this.sourceName || document.title || "", //默认固定标题,默认取页面标题
                url: window.location.href, //默认取浏览器地址
                laterOn: {
                    author_id: this.author_id || 0, //作者id
                    content_meta_id: this.post_id,
                },
            };
        },
    },
    methods: {
        showAvatar,
        questDescFormat(desc) {
            return questDescFormat(desc, true);
        },
        questTargetDescFormat,
        ts2str,
        onSearch() {
            if (isInMiniprogramWebview()) {
                wx.miniProgram.navigateTo({
                    url: `/pages/search/search-detail/search-detail?app=wiki&filter_category=成就`,
                });
            } else {
                this.$message({
                    message: "非小程序环境，不支持跳转搜索页",
                    type: "warning",
                });
            }
        },
        toggleConfirmShow() {
            this.conformShow = true;
        },
        toggleCompleted() {
            this.confirmLoading = true;
            const role_id = this.currentRole?.ID;
            const quest_id = Number(this.id);
            const fn = this.isCompleted ? cancelUserQuest(role_id, quest_id) : completeUserQuest(role_id, quest_id);
            fn.then(() => {
                this.$store.commit(this.isCompleted ? "REMOVE_COMPLETED_QUEST" : "ADD_COMPLETED_QUEST", quest_id);
            }).finally(() => {
                this.confirmLoading = false;
            });
        },
        setRole(val) {
            this.$store.commit("SET_ROLE", val);
            this.userSelectShow = false;
        },
        clearContent(content) {
            return (content || "")
                .replace(/ style="[^"]*"/g, "")
                .replace(/<i?frame.*?src="(.*?)".*?>/g, (match, src) => {
                    return `<a href="${src}" target="_blank">${src}</a>`;
                })
                .replace(/<i?frame.*?src="(.*?)".*?>.*?<\/i?frame>/g, (match, src) => {
                    return `<a href="${src}" target="_blank">${src}</a>`;
                });
        },
        async loadInitData() {
            if (!this.id) return;
            this.loading = true;
            await getQuest({
                id: this.id,
                client: this.client,
            }).then((res) => {
                this.source = res.data;
            });
            await wiki
                .mix({
                    type: "quest",
                    id: this.id,
                    client: this.client,
                })
                .then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;
                    if (!post) return;
                    User.isLogin() &&
                        postHistory({
                            source_type: this.client == "origin" ? "origin_quest" : "quest",
                            source_id: ~~this.id,
                            link: location.href,
                            title: post.title,
                        });
                })
                .finally(() => {
                    this.loading = false;
                });

            this.triggerStat();
        },
        triggerStat: function () {
            postStat(this.client == "origin" ? "origin_quest" : "quest", this.id);
        },
    },
    watch: {
        currentRole: {
            deep: true,
            handler(val) {
                if (!val) return;
                listUserQuest(this.currentRole.ID).then((res) => {
                    const data = res.data?.data || [];
                    this.$store.commit("SET_COMPLETED_QUESTS", data);
                    localStorage.setItem("quests_last_sync", this.currentRole.jx3id);
                });
            },
        },
        id: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.loadInitData();
            },
        },
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.user-select-drawer.in-quest {
    .u-reset {
        color: #ffffff66 !important;
    }
    .m-user-item {
        color: #ffffffcc;

        .u-area {
            &::before {
                content: "<";
            }
            &::after {
                content: ">";
            }
        }
    }
}

.p-mobile-quest-detail {
    background: #f1f1f1;
    @media (prefers-color-scheme: dark) {
        background: #000;
    }

    font-family: "Microsoft YaHei UI";
    font-style: normal;

    display: flex;
    flex-direction: column;
    .size(100vw, 100vh);

    #macro-comment {
        margin-top: 0;
    }

    .m-confirm {
        display: flex;
        height: 48px;
        margin: 0 20px;
        padding: 12px 16px;
        justify-content: center;
        align-items: center;
        gap: 8px;

        border-radius: var(--12, 12px);
        background: var(--primary-brand-2, #fedaa3);
        border: none;

        color: var(--primary-brand-3, #24292e);
        /* 16 Bold */
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */

        &.complete {
            opacity: 0.3;
        }

        &.disabled {
            opacity: 0.3;
        }
    }

    .m-page-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 0;
        gap: 20px;
        padding: 20px 0;
        margin-bottom: 76px;

        overflow-y: auto;
    }

    .m-wiki {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        width: 100%;
        border-radius: 12px;
        box-sizing: border-box;
        border: 1px solid rgba(40, 40, 40, 0.05);
        background: var(--primary-brand-4, #282828);
        .m-wiki-header {
            display: flex;
            flex-direction: column;
            gap: 4px;
            .u-title {
                color: var(--black-80, rgba(255, 255, 255, 0.8));

                /* 16 Bold */
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }

            .u-avatar-list {
                display: flex;
                align-items: center;

                .u-avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: -8px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }

            .u-time {
                color: var(--black-40, rgba(255, 255, 255, 0.4));

                /* 12 Regular */
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }

        .m-content-box {
            overflow: auto;
            box-sizing: border-box;
            #wikiArticle {
                color: rgba(255, 255, 255, 0.8) !important;

                /* 14 Regular */
                font-size: 14px !important;
                font-style: normal !important;
                font-weight: 400 !important;
                line-height: 20px; /* 142.857% */

                box-sizing: border-box;
                overflow-x: hidden;

                ul {
                    padding-left: 12px !important;
                }

                .e-summary,
                .e-jx3-resource {
                    @media (prefers-color-scheme: dark) {
                        color: var(--black-100);
                        background: var(--black-20);
                    }
                }
                ul:has(.e-jx3-resource) {
                    padding: 0 !important;
                }
                ul:has(.e-summary) {
                    padding: 0 !important;
                }
                img {
                    margin: 0 !important;
                }

                div {
                    color: var(--black-100);
                }
                h1 {
                    font-weight: 700 !important;
                    line-height: 30px !important;
                    font-size: 20px !important;
                    margin-bottom: 15px !important;
                    color: var(--black-100);
                }

                h2 {
                    font-weight: 700 !important;
                    line-height: 27px !important;
                    font-size: 18px !important;
                    margin-bottom: 14px !important;
                    color: var(--black-100);
                }

                h3 {
                    font-weight: 700 !important;
                    line-height: 24px !important;
                    font-size: 16px !important;
                    margin-bottom: 12px !important;
                    color: var(--black-100);
                }

                h4 {
                    font-weight: 700 !important;
                    line-height: 20px !important;
                    font-size: 14px !important;
                    margin-bottom: 11px !important;

                    @media (prefers-color-scheme: dark) {
                        color: var(--black-100);
                        background: var(--black-20);
                    }
                }

                blockquote {
                    @media (prefers-color-scheme: dark) {
                        background: var(--black-20);
                    }
                }

                h5,
                h6 {
                    font-weight: 700 !important;
                    line-height: 18px !important;
                    font-size: 12px !important;
                    margin-bottom: 9px !important;
                    color: var(--black-100) !important;
                    @media (prefers-color-scheme: dark) {
                        background: var(--black-20);
                    }
                }

                .e-jx3-resource {
                    overflow: hidden;
                }

                p {
                    font-weight: 400 !important;
                    line-height: 20px !important;
                    font-size: 14px !important;
                    margin-bottom: 11px !important;
                    color: var(--black-100);
                }

                .text {
                    display: inline-block !important;
                    font-weight: 400 !important;
                    line-height: 20px !important;
                    font-size: 14px !important;
                    margin-bottom: 11px !important;
                    color: var(--black-100);
                }

                hr {
                    margin-bottom: 11px !important;
                    margin-top: 8px !important;
                }
            }
        }

        .u-show-log {
            margin-top: 20px;
            text-align: center;
            width: 100%;
            color: var(--black-40, rgba(255, 255, 255, 0.4));

            /* 12 Regular */
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
        }
    }

    .m-quest-info {
        .u-target {
            p {
                margin: 0;
            }

            color: var(--black-80, rgba(28, 28, 28, 0.8));

            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .u-target-sub {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .u-pos {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .u-pos-item {
            display: flex;
            align-items: center;
            color: var(--black-80, rgba(28, 28, 28, 0.8));

            font-size: 12px;
            font-weight: 400;
            line-height: 18px; /* 150% */

            .u-id {
                display: flex;
                justify-content: flex-end;
                flex-grow: 1;

                color: var(--black-40, rgba(28, 28, 28, 0.8));

                /* 12 Regular */
                font-size: 12px;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }
        .u-desc {
            margin: 0;

            color: var(--black-80, rgba(28, 28, 28, 0.8));

            /* 14 Regular */
            font-size: 14px;
            font-weight: 400;
            line-height: 20px; /* 142.857% */

            white-space: pre-line;
        }
    }

    .m-quest-dialog {
        display: flex;
        flex-direction: column;

        .u-subtitle2 {
            color: var(--black-80, rgba(28, 28, 28, 0.8));

            /* 14 Bold */
            font-size: 14px;
            font-weight: 700;
            line-height: 20px; /* 142.857% */

            &::before {
                content: "•";
                margin-right: 8px;
            }
        }

        .u-dialog-content {
            color: var(--black-80, rgba(28, 28, 28, 0.8));

            /* 14 Regular */
            font-family: "Microsoft YaHei UI";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
        }
    }
}

.u-suspend-common {
    padding-bottom: 2rem;
    margin: 0;
    .m-base {
        width: 100%;
        .m-more-action {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;

            .u-action {
                display: flex;
                height: 24px;
                justify-content: center;
                align-items: center;
                flex: 1 0 0;
                svg {
                    height: 24px;
                    width: 24px;
                }
                &.disabled {
                    img {
                        opacity: 0.5;
                    }
                }
            }
        }
    }
    .m-more {
        .u-icon {
            display: none;
        }
    }
}
</style>
