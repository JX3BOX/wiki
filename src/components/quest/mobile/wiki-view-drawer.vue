<template>
    <div>
        <el-drawer
            :visible.sync="visible"
            direction="btt"
            :show-close="false"
            :with-header="false"
            append-to-body
            custom-class="quest-view-drawer"
            size="400"
            @close="onClose"
            style="width: 100%"
        >
            <template #default>
                <div v-loading="loading" class="c-var m-quest-view-drawer">
                    <div class="m-quest-info">
                        <!-- 任务名称 -->
                        <!-- 任务开始结束点位 -->
                        <div class="m-quest-section">
                            <div class="u-name">
                                {{ source?.desc?.QuestName || source?.name }}
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
                                        <item-icon
                                            class="u-item"
                                            :size="18"
                                            :item_id="source?.start?.id"
                                            has_title
                                        ></item-icon>
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
                                        <item-icon
                                            class="u-item"
                                            :size="18"
                                            :item_id="source?.start?.id"
                                            has_title
                                        ></item-icon>
                                        <span class="u-id">(ID: {{ source?.start?.id }})</span>
                                    </template>
                                </div>
                            </div>
                        </div>
                        <!-- 任务目标 -->
                        <div class="m-quest-section">
                            <p class="u-title">任务目标</p>
                            <div class="u-target">
                                <p v-html="targetDesc"></p>
                                <template v-if="source?.killNpcs?.length > 0">
                                    <div class="u-target-sub" v-for="(killNpc, i) in source?.killNpcs" :key="i">
                                        <span>击杀</span>
                                        <span>{{ killNpc.name }}</span>
                                        <el-tooltip v-if="killNpc.share" content="该目标可共享击杀" placement="top">
                                            <img src="@/assets/img/quest/target-15.png" alt="" />
                                        </el-tooltip>
                                        <span> x {{ killNpc.amount }}</span>
                                    </div>
                                </template>
                                <template v-if="source?.needItems?.length > 0">
                                    <div class="u-target-sub" v-for="(needItem, i) in source.needItems" :key="i">
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
                        </div>
                        <div class="m-quest-section">
                            <p class="u-title">任务描述</p>
                            <p class="u-desc" v-html="questDesc"></p>
                        </div>
                    </div>
                    <div class="m-op">
                        <button
                            class="u-reset"
                            :class="{ active: !isComplete }"
                            @click="toggleConfirm"
                            v-loading="confirmLoading"
                        >
                            {{ isComplete ? "设为待完成" : "设为已完成" }}
                        </button>
                        <button class="u-confirm" @click="toDetail">查看页面</button>
                    </div>
                </div>
            </template>
        </el-drawer>

        <confirm-ok-drawer :visible.sync="confirmShow" :current="isComplete" @confirm="confirmOk" />
    </div>
</template>

<script>
import { pick } from "lodash";
import { mapState } from "vuex";
import ConfirmOkDrawer from "@/components/cj/mobile/confirm-ok-drawer.vue";
import { getQuest, completeUserQuest, cancelUserQuest } from "@/service/quest";
import ItemIcon from "@/components/common/item-icon.vue";
import { buildPoints, schoolIcon, questDescFormat, questTargetDescFormat } from "@/utils/quest.js";
import { wxNewPage } from "@/utils/minprogram";

export default {
    name: "WikiViewDrawer",
    components: { ConfirmOkDrawer, ItemIcon },
    emits: ["update:visible", "update:current"],
    props: {},
    data() {
        return {
            visible: false,

            loading: false,
            id: null,
            source: null,

            confirmLoading: false,
            confirmShow: false,

            isAtBottom: false,
        };
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.loadData();
            },
        },
        visible: {
            handler(val) {
                if (val) {
                    this.$nextTick(() => {
                        const scrollContainer = this.$refs.content;
                        if (scrollContainer) {
                            scrollContainer.addEventListener("scroll", this.handleScroll);
                            this.handleScroll({ target: scrollContainer });
                        }
                    });
                } else {
                    const scrollContainer = this.$refs.content;
                    if (scrollContainer) {
                        scrollContainer.removeEventListener("scroll", this.handleScroll);
                    }
                }
            },
            immediate: true,
        },
    },
    computed: {
        ...mapState({
            onlyNotCompleted: (state) => state.onlyNotCompleted,
            completedQuests: (state) => state.completedQuests,
            currentRole: (state) => state.currentRole,
            client: (state) => state.client,
        }),
        isComplete() {
            return this.completedQuests.includes(Number(this.id));
        },
        targetDesc() {
            return questTargetDescFormat(this.source?.desc?.Objective).replaceAll("&emsp;", "");
        },
        questDesc() {
            return questDescFormat(this.source?.desc?.Description, true).replace(/^&emsp;&emsp;\n/, "");
        },
    },
    methods: {
        loadData() {
            if (!this.id) return;
            this.loading = true;
            getQuest({
                id: this.id,
                client: this.client,
            })
                .then((res) => {
                    this.source = res.data;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        open(id) {
            this.id = id;
            this.visible = true;
        },
        onClose() {
            this.visible = false;
        },
        toggleConfirm() {
            this.confirmShow = !this.confirmShow;
        },
        confirmOk() {
            this.confirmLoading = true;
            const role_id = this.currentRole?.ID;
            const fn = this.isComplete ? cancelUserQuest(role_id, this.id) : completeUserQuest(role_id, this.id);
            fn.then(() => {
                this.$store.commit(this.isComplete ? "REMOVE_COMPLETED_QUEST" : "ADD_COMPLETED_QUEST", this.id);
            }).finally(() => {
                this.confirmLoading = false;
            });
        },
        toDetail() {
            const url = this.$router.resolve({
                name: "view",
                params: {
                    quest_id: this.id,
                },
            });
            wxNewPage(url.href);
        },
    },
};
</script>

<style lang="less">
.quest-view-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
}

.m-quest-view-drawer {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    padding: 20px;
    min-height: 500px;
    position: relative;

    .m-quest-info {
        max-height: 400px;
        overflow: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .m-quest-section {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .u-target {
            p {
                margin: 0;
            }

            color: rgba(255, 255, 255, 0.8);

            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            display: flex;
            flex-direction: column;
            gap: 4px;

            padding-left: 2em;
        }
        .u-target-sub {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        & > .u-name {
            color: #fedaa3;

            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
        }

        .u-pos {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .u-pos-item {
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, 0.8);

            font-size: 12px;
            font-weight: 400;
            line-height: 18px; /* 150% */

            .u-id {
                display: flex;
                justify-content: flex-end;
                flex-grow: 1;

                color: rgba(255, 255, 255, 0.4);

                /* 12 Regular */
                font-size: 12px;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }

        .u-title {
            color: #fedaa3;

            font-size: 14px;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
            margin: 0;
        }

        .u-desc {
            margin: 0;

            color: rgba(255, 255, 255, 0.8);

            /* 14 Regular */
            font-size: 14px;
            font-weight: 400;
            line-height: 20px; /* 142.857% */

            white-space: pre-line;
        }
    }

    .m-op {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        padding: 20px 12px 30px;
        gap: 20px;
        background-color: #24292e;

        button {
            color: rgba(28, 28, 28, 0.4);

            /* 16 Bold */
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */

            border-radius: var(--12, 12px);
            padding: var(--12, 12px) var(--16, 16px);
            border: none;

            &.u-reset {
                display: flex;
                justify-content: center;
                align-items: center;
                color: rgba(255, 255, 255, 0.4);
                background: rgba(255, 255, 255, 0.05);

                //&.active {
                //    color: #000;
                //    background: #fedaa3;
                //}
            }

            &.u-confirm {
                color: rgba(255, 255, 255, 0.4);

                /* 16 Bold */
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
                flex: 1;

                border-radius: var(--12, 12px);
                background: rgba(255, 255, 255, 0.05);

                &.active {
                    color: #000;
                    background: #fedaa3;
                }
            }
        }
    }
}
</style>
