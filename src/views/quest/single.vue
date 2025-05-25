<template>
    <div class="m-quest-view" :class="isRobot ? 'm-quest-view__robot' : ''">
        <div v-if="!isRobot" class="w-quest">
            <div class="u-actions" @click.stop>
                <el-tooltip content="在左侧选择角色后可以标记任务完成情况" placement="top" v-if="!role">
                    <i class="el-icon-info"></i>
                </el-tooltip>
                <el-button
                    size="small"
                    plain
                    v-if="!isCompleted"
                    @click.stop="onQuestComplete"
                    :loading="loading"
                    :disabled="!role"
                    icon="el-icon-check"
                >
                    标记为已完成
                </el-button>
                <el-button
                    size="small"
                    plain
                    type="info"
                    v-if="isCompleted"
                    @click.stop="onQuestCancel"
                    :loading="loading"
                    :disabled="!role"
                    icon="el-icon-close"
                >
                    标记为未完成
                </el-button>
            </div>

            <p class="u-title__warpper">
                <span class="u-title">
                    <span class="u-title-name" :style="questNameColor">{{ quest.name }}</span>
                    <img class="u-title-school" v-if="quest.schoolName" :src="schoolIcon(quest.schoolName)" alt="" />
                    <span class="u-title-difficulty" v-if="quest.difficulty">【{{ quest.difficulty }}】</span>
                </span>
                <span class="u-title-id"> (ID:{{ quest.id }})</span>
            </p>
            <div class="u-tag-list">
                <el-tag v-show="quest.canShare"><img src="@/assets/img/quest/player-63.png" alt="" />可分享任务</el-tag>
                <el-tag v-show="quest.canAssist"
                    ><img src="@/assets/img/quest/player-62.png" alt="" />可协助任务</el-tag
                >
            </div>
            <div class="u-endpoint__wrapper">
                <p class="u-endpoint" v-show="quest.start">
                    <span class="u-endpoint-label"><i class="el-icon-video-play"></i> 任务起点: </span>
                    <span>{{ quest.start.mapName }}</span>
                    <span class="u-endpoint-separate"> - </span>
                    <item-icon
                        class="u-endpoint-item"
                        v-if="quest.start.type == 'item'"
                        :item_id="quest.start.id"
                        :size="28"
                    ></item-icon>
                    <span v-else>{{ quest.start.name || "未知" }}</span>
                    <span class="u-endpoint-id"
                        >({{ quest.start.type | pointType }}ID: {{ quest.start.id | idFilter }})</span
                    >
                    <point-filter
                        v-if="showPointFilter('Start')"
                        :default="true"
                        :pointType="'Start'"
                        @onPointFilterChange="changePointFilter"
                    ></point-filter>
                </p>
                <p class="u-endpoint">
                    <span class="u-endpoint-label"><i class="el-icon-remove-outline"></i> 任务终点: </span>
                    <span>{{ quest.end.mapName }}</span>
                    <span class="u-endpoint-separate"> - </span>
                    <item-icon
                        class="u-endpoint-item"
                        v-if="quest.end.type == 'item'"
                        :item_id="quest.end.id"
                        :size="28"
                    ></item-icon>
                    <span v-else>{{ quest.end.name || "未知" }}</span>
                    <span class="u-endpoint-id"
                        >({{ quest.end.type | pointType }}ID: {{ quest.end.id | idFilter }})</span
                    >
                    <point-filter
                        v-if="showPointFilter('End')"
                        :default="true"
                        :pointType="'End'"
                        @onPointFilterChange="changePointFilter"
                    ></point-filter>
                </p>
            </div>
            <div class="u-target" v-show="targetDesc">
                <p class="u-subtitle">▶ 任务目标</p>
                <p v-html="targetDesc"></p>
                <template v-if="quest.killNpcs && quest.killNpcs.length > 0">
                    <div class="u-target-sub" v-for="(killNpc, i) in quest.killNpcs" :key="i">
                        <span>击杀</span>
                        <span>{{ killNpc.name }}</span>
                        <el-tooltip v-if="killNpc.share" content="该目标可共享击杀" placement="top">
                            <img src="@/assets/img/quest/target-15.png" alt="" />
                        </el-tooltip>
                        <span> x {{ killNpc.amount }}</span>
                        <point-filter
                            v-if="showPointFilter('KillNpc' + (i + 1))"
                            :default="true"
                            :pointType="`KillNpc${i + 1}`"
                            @onPointFilterChange="changePointFilter"
                        ></point-filter>
                    </div>
                </template>
                <template v-if="quest.needItems && quest.needItems.length > 0">
                    <div class="u-target-sub" v-for="(needItem, i) in quest.needItems" :key="i">
                        <span>收集</span>
                        <item-icon :item_id="needItem.id" :has_title="true" :size="28"></item-icon>
                        <span>x {{ needItem.amount }}</span>
                        <point-filter
                            v-if="showPointFilter('NeedItem' + (i + 1))"
                            :default="true"
                            :pointType="`NeedItem${i + 1}`"
                            @onPointFilterChange="changePointFilter"
                        ></point-filter>
                    </div>
                </template>
                <div class="u-target-sub" v-for="(questValue, i) in quest.questValues" :key="questValue + i">
                    <span>{{ questValue.str }} x {{ questValue.value }}</span>
                    <point-filter
                        v-if="showPointFilter('State' + (i + 1))"
                        :default="true"
                        :pointType="`State${i + 1}`"
                        @onPointFilterChange="changePointFilter"
                    ></point-filter>
                </div>
            </div>
            <div class="u-desc" v-show="questDesc">
                <p class="u-subtitle">▶ 任务描述</p>
                <p v-html="questDesc"></p>
            </div>
            <div class="u-offer" v-if="quest.offerItems">
                <p class="u-subtitle">▶ 提供物品</p>
                <div class="u-offer-list">
                    <item-icon
                        v-for="item in quest.offerItems"
                        :key="item.id"
                        :item_id="item.id"
                        :size="36"
                    ></item-icon>
                </div>
            </div>
            <div class="u-reward" v-show="showReward">
                <p class="u-subtitle">▶ 任务奖励</p>
                <div class="u-reward-list">
                    <reward-item v-for="(reward, i) in quest.rewards" :key="i" :reward="reward"></reward-item>
                </div>
            </div>
            <quest-chain :current="id" :data="quest.chain"></quest-chain>
        </div>
        <div v-else class="m-quest-top">
            <div class="m-quest-header">
                <div class="m-quest-title">
                    <div class="m-title">
                        <div class="u-title">
                            <img class="u-title-img" src="@/assets/img/quest_title_robot.svg" />
                            {{ quest.name }}
                        </div>
                        <span class="u-title-id"> (ID:{{ quest.id }})</span>
                    </div>

                    <div class="u-endpoint__wrapper">
                        <p class="u-endpoint" v-show="quest.start">
                            <span class="u-endpoint-label">任务起点: </span>
                            <span class="u-endpoint-name">{{ quest.start.mapName }}</span>
                            <span class="u-endpoint-separate"> - </span>
                            <item-icon
                                class="u-endpoint-item"
                                v-if="quest.start.type == 'item'"
                                :item_id="quest.start.id"
                                :size="14"
                            ></item-icon>
                            <span class="u-endpoint-name" v-else>{{ quest.start.name || "未知" }}</span>
                            <span class="u-endpoint-id"
                                >({{ quest.start.type | pointType }}ID: {{ quest.start.id | idFilter }})</span
                            >
                        </p>
                        <img class="u-quest-to" src="@/assets/img/quest-to.svg" />
                        <p class="u-endpoint">
                            <span class="u-endpoint-label">任务终点: </span>
                            <span class="u-endpoint-name">{{ quest.end.mapName }}</span>
                            <span class="u-endpoint-separate"> - </span>
                            <item-icon
                                class="u-endpoint-item"
                                v-if="quest.end.type == 'item'"
                                :item_id="quest.end.id"
                                :size="28"
                            ></item-icon>
                            <span v-else class="u-endpoint-name">{{ quest.end.name || "未知" }}</span>
                            <span class="u-endpoint-id"
                                >({{ quest.end.type | pointType }}ID: {{ quest.end.id | idFilter }})</span
                            >
                        </p>
                    </div>
                </div>
            </div>
            <div class="m-quest-desc">
                <div class="u-desc-title">
                    <img src="@/assets/img/quest_desc_robot.svg" class="u-title-img" />
                    <div class="u-title">任务描述</div>
                </div>
                <div class="u-desc" v-html="questDesc"></div>
            </div>
            <div class="m-quest-target__reward">
                <div class="m-quest-target">
                    <div class="u-title">任务目标</div>
                    <template v-if="quest.killNpcs && quest.killNpcs.length > 0">
                        <div class="u-target-sub" v-for="(killNpc, i) in quest.killNpcs" :key="i">
                            <span>击杀</span>
                            <span>{{ killNpc.name }}</span>
                            <el-tooltip v-if="killNpc.share" content="该目标可共享击杀" placement="top">
                                <img src="@/assets/img/quest/target-15.png" style="width: 14px; height: 14px" alt="" />
                            </el-tooltip>
                            <span> x {{ killNpc.amount }}</span>
                        </div>
                    </template>
                    <template v-if="quest.needItems && quest.needItems.length > 0">
                        <div class="u-target-sub" v-for="(needItem, i) in quest.needItems" :key="i">
                            <span>收集</span>
                            <item-icon :item_id="needItem.id" :has_title="true" :size="14"></item-icon>
                            <span>x {{ needItem.amount }}</span>
                        </div>
                    </template>
                    <div class="u-target-sub" v-for="(questValue, i) in quest.questValues" :key="questValue + i">
                        <span>{{ questValue.str }} x {{ questValue.value }}</span>
                    </div>
                    <p class="u-content" v-html="targetDesc"></p>
                </div>
                <div class="m-quest-reward">
                    <div class="u-title">任务奖励</div>
                    <div class="u-reward-list">
                        <reward-item v-for="(reward, i) in quest.rewards" :key="i" :reward="reward"></reward-item>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isRobot">
            <Notice></Notice>
            <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                <el-tab-pane label="任务文案" v-if="showDialog" name="dialog">
                    <div class="u-quest-dialog">
                        <quest-dialog :desc="quest.desc"></quest-dialog>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="任务地图" v-if="showMap" name="map">
                    <div class="u-quest-map">
                        <quest-map ref="map" :points="points" :filter="point_filter" :questType="quest.questType">
                        </quest-map>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="m-wiki-post-panel" :class="{ 'is-robot': isRobot }" v-if="wiki_post && wiki_post.post">
            <WikiPanel :wiki-post="wiki_post" ref="wikiPanel">
                <template slot="head-title">
                    <img class="u-icon" svg-inline :src="icon" />
                    <span class="u-txt">任务攻略</span>
                </template>
                <template v-if="!isRobot" slot="head-actions">
                    <a class="el-button el-button--primary" :href="publish_url(`quest/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善任务攻略</span>
                    </a>
                </template>
                <template slot="body">
                    <div class="m-wiki-compatible" v-if="compatible">
                        <i class="el-icon-warning-outline"></i> 暂无缘起攻略，以下为重制攻略，仅作参考，<a
                            class="s-link"
                            :href="publish_url(`quest/${id}`)"
                            >参与修订</a
                        >。
                    </div>
                    <Article :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <i class="el-icon-edit"></i>
                        本次修订由 <b>{{ user_name }}</b> 提交于{{ updated_at }}
                    </div>
                </template>
            </WikiPanel>
            <template v-if="!isRobot">
                <!-- 历史版本 -->
                <WikiRevisions type="quest" :source-id="String(id)" />

                <!-- 打赏 -->
                <div class="m-wiki-thx-panel">
                    <WikiPanel>
                        <template slot="head-title">
                            <i class="el-icon-coin"></i>
                            <span>参与打赏</span>
                        </template>
                        <template slot="body">
                            <Thx
                                class="m-thx"
                                :postId="id"
                                postType="quest"
                                :postTitle="wiki_post.source.QuestName"
                                :userId="author_id"
                                :adminBoxcoinEnable="true"
                                :userBoxcoinEnable="true"
                                :authors="authors"
                                mode="wiki"
                                :key="'quest-thx-' + id"
                                :client="client"
                                showRss
                            />
                        </template>
                    </WikiPanel>
                </div>

                <!-- 百科评论 -->
                <WikiComments type="quest" :source-id="id_str" />
            </template>
        </div>
        <div class="m-wiki-post-empty" :class="isRobot ? 'is-robot-empty' : ''" v-else>
            <template v-if="!isRobot">
                <i class="el-icon-s-opportunity"></i>
                <span>暂无攻略，我要</span>
                <a class="s-link" :href="publish_url(`quest/${id}`)">完善攻略</a>
            </template>
            <span v-else>暂无相关攻略，欢迎热心侠士前往补充！</span>
        </div>
        <wiki-robot-bottom v-if="isRobot" type="quest" :id="id"></wiki-robot-bottom>
    </div>
</template>

<script>
import QuestChain from "@/components/quest/single/quest-chain.vue";
import QuestMap from "@/components/quest/single/quest-map.vue";
import RewardItem from "@/components/quest/single/reward-item.vue";
import PointFilter from "@/components/quest/single/point-filter.vue";
import ItemIcon from "@/components/common/item-icon.vue";
import QuestDialog from "@/components/quest/single/quest-dialog.vue";
import Notice from "@/components/quest/single/notice.vue";
import wikiRobotBottom from "@/components/common/wiki-robot-bottom.vue";

import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat.js";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2.js";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";

import { publishLink, ts2str } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@/components/wiki-panel.vue";
import WikiRevisions from "@/components/wiki-revisions.vue";
import WikiComments from "@/components/wiki-comments.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";

import { getQuest, completeUserQuest, cancelUserQuest } from "@/service/quest";
import { buildPoints, schoolIcon, questDescFormat, questTargetDescFormat } from "@/utils/quest.js";
import isArray from "lodash/isArray";
import { mapState } from "vuex";
import bus from "@/store/bus";

export default {
    name: "QuestSingle",
    props: {
        sourceId: {
            type: [String, Number],
            default: "",
        },
        isRobot: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        ItemIcon,
        QuestMap,
        RewardItem,
        QuestChain,
        PointFilter,
        QuestDialog,
        Article,
        WikiPanel,
        WikiRevisions,
        WikiComments,
        Notice,
        wikiRobotBottom,
    },
    data() {
        return {
            loading: false,

            wiki_post: {
                source: {},
                post: null,
            },
            compatible: false,
            is_empty: true,

            activeTab: "dialog",

            quest: {
                id: -1,
                name: "",
                start: {
                    type: "npc",
                    id: -1,
                    map: "扬州",
                    guides: [],
                },
                end: {
                    type: "npc",
                    id: -1,
                    map: "扬州",
                    guides: [],
                },
                canAssist: 0,
                canShare: 0,
                rewards: [],
                chain: {
                    current: [],
                    branch: [],
                },
                killNpcs: [],
                needItems: [],
            },
            point_filter: {
                Start: true,
                End: true,
            },
            icon: getAppIcon("quest"),
        };
    },
    methods: {
        onQuestCancel() {
            const role_id = this.role.ID;
            const quest_id = this.quest.id;
            this.loading = true;
            cancelUserQuest(role_id, quest_id)
                .then(() => {
                    this.$message.success("操作完成");
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
                    this.$message.success("操作完成");
                    this.$store.commit("ADD_COMPLETED_QUEST", quest_id);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getData() {
            getQuest({
                id: this.id,
                client: this.client,
            }).then((res) => {
                this.quest = res.data;
            });
        },
        handleTabClick(tab, event) {
            if (tab.name == "map") {
                setTimeout(() => {
                    this.$refs.map && this.$refs.map.updateSize();
                }, 100);
            }
        },
        buildPoints,
        schoolIcon,
        changePointFilter(type, enable) {
            this.$set(this.point_filter, type, enable);
        },
        showPointFilter(type) {
            return Object.values(this.points).some((points) => {
                return points.some((point) => {
                    return point.Types === type;
                });
            });
        },
        //百科相关
        loadData: function () {
            // 获取最新攻略
            if (this.id) {
                wiki.mix({ type: "quest", id: this.id, client: this.client }).then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;

                    User.isLogin() &&
                        postHistory({
                            source_type: this.client == "origin" ? "origin_quest" : "quest",
                            source_id: ~~this.id,
                            link: location.href,
                            title: this.quest.name,
                        });

                    // TEST:请注意，为防止QQBOT无法抓取完全，请不要删除本行
                    window.__READY__ = true;
                });
            }
            this.triggerStat();
        },
        loadRevision: function () {
            // 获取指定攻略
            wiki.getById(this.post_id, { type: "quest" }).then((res) => {
                this.wiki_post = res.data.data;
            });
            this.triggerStat();
        },
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_quest", this.id);
            } else {
                postStat("quest", this.id);
            }
        },
    },
    mounted() {
        this.getData();
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }
        bus.on("openWikiPush", (param) => {
            if (!this.wiki_post?.post?.id) {
                return this.$message.warning("该任务没有攻略");
            }
            this.$refs.wikiPanel?.onPush();
        });
    },
    computed: {
        ...mapState({
            role: (state) => state.currentRole,
            completed: (state) => state.completedQuests,
        }),
        isCompleted() {
            return this.completed?.includes(this.quest.id);
        },
        id_str: function () {
            return String(this.id);
        },
        id: function () {
            return parseInt(this.$route.params.quest_id) || parseInt(this.sourceId);
        },
        showMap: function () {
            return this.points && Object.keys(this.points).length > 0;
        },
        showDialog: function () {
            return this.quest.desc;
        },
        questDesc: function () {
            return questDescFormat(this.quest.desc?.Description);
        },
        targetDesc: function () {
            return questTargetDescFormat(this.quest.desc?.Objective);
        },
        showReward: function () {
            return this.quest.rewards && this.quest.rewards.length > 0;
        },
        questNameColor() {
            let map = {
                common: "#0d0e0d",
                repeat: "#0366d6",
                act: "#7632ff",
            };
            return {
                color: map[this.quest.questType],
            };
        },
        client() {
            return this.$store.state.client;
        },
        points() {
            return this.buildPoints(this.quest);
        },

        //wiki相关
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post?.post?.user_id;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
        },
        fav_title: function () {
            return this.wiki_post?.source?.Name;
        },
        authors: function () {
            if (!this.isRevision) {
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
            }
            return [];
        },
    },
    watch: {
        id() {
            this.getData();
            this.loadData();
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
    },
    filters: {
        pointType: (value) => {
            if (value === "npc") return "NPC";
            else if (value === "doodad") return "交互物品";
            else if (value === "item") return "物品";
            else return "";
        },
        idFilter: (id) => {
            if (isArray(id)) {
                return `${id[0]}_${id[1]}`;
            } else return id;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/single.less";
</style>
