<template>
    <div class="m-quest-view" :class="isRobot ? 'm-quest-view__robot' : ''" v-loading="pageLoading">
        <AsyncState :loading="pageLoading" :error="loadError" @retry="syncQuestData" />
        <div v-if="!isRobot && !loadError" class="w-quest">
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

            <p class="u-title__warpper">
                <span class="u-title">
                    <span class="u-title-name" :class="questNameClass">{{ quest.name }}</span>
                    <img class="u-title-school" v-if="quest.schoolName" :src="schoolIcon(quest.schoolName)" alt="" />
                    <span class="u-title-difficulty" v-if="quest.difficulty">【{{ quest.difficulty }}】</span>
                </span>
                <span class="u-title-id"> (ID:{{ quest.id }})</span>
            </p>
            <div class="u-tag-list">
                <el-tag v-show="quest.canShare"><img src="@/assets/img/quest/player-63.png" alt="" />{{ $t("ui.quest.shareable") }}</el-tag>
                <el-tag v-show="quest.canAssist"
                    ><img src="@/assets/img/quest/player-62.png" alt="" />{{ $t("ui.quest.assistable") }}</el-tag
                >
            </div>
            <div class="u-endpoint__wrapper">
                <p class="u-endpoint" v-show="quest.start">
                    <span class="u-endpoint-label"><LegacyIcon class="el-icon-video-play" /> {{ $t("ui.quest.start") }} </span>
                    <span>{{ quest.start.mapName }}</span>
                    <span class="u-endpoint-separate"> - </span>
                    <item-icon
                        class="u-endpoint-item"
                        v-if="quest.start.type == 'item'"
                        :item_id="quest.start.id"
                        :size="28"
                    ></item-icon>
                    <span v-else>{{ quest.start.name || $t("ui.common.labels.unknown") }}</span>
                    <span class="u-endpoint-id"
                        >({{ pointType(quest.start.type) }}ID: {{ idFilter(quest.start.id) }})</span
                    >
                    <point-filter
                        v-if="showPointFilter('Start')"
                        :default="true"
                        :pointType="'Start'"
                        @onPointFilterChange="changePointFilter"
                    ></point-filter>
                </p>
                <p class="u-endpoint">
                    <span class="u-endpoint-label"><LegacyIcon class="el-icon-remove-outline" /> {{ $t("ui.quest.end") }} </span>
                    <span>{{ quest.end.mapName }}</span>
                    <span class="u-endpoint-separate"> - </span>
                    <item-icon
                        class="u-endpoint-item"
                        v-if="quest.end.type == 'item'"
                        :item_id="quest.end.id"
                        :size="28"
                    ></item-icon>
                    <span v-else>{{ quest.end.name || $t("ui.common.labels.unknown") }}</span>
                    <span class="u-endpoint-id">({{ pointType(quest.end.type) }}ID: {{ idFilter(quest.end.id) }})</span>
                    <point-filter
                        v-if="showPointFilter('End')"
                        :default="true"
                        :pointType="'End'"
                        @onPointFilterChange="changePointFilter"
                    ></point-filter>
                </p>
            </div>
            <div class="u-target" v-show="targetDesc">
                <p class="u-subtitle"><el-icon><CaretRight /></el-icon>{{ $t("ui.quest.target") }}</p>
                <p v-html="targetDesc"></p>
                <template v-if="quest.killNpcs && quest.killNpcs.length > 0">
                    <div class="u-target-sub" v-for="(killNpc, i) in quest.killNpcs" :key="i">
                        <span>{{ $t("ui.quest.kill") }}</span>
                        <span>{{ killNpc.name }}</span>
                        <el-tooltip v-if="killNpc.share" :content="$t('ui.quest.sharedKill')" placement="top">
                            <img src="@/assets/img/quest/target-15.png" alt="" />
                        </el-tooltip>
                        <span> × {{ killNpc.amount }}</span>
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
                        <span>{{ $t("ui.quest.collect") }}</span>
                        <item-icon :item_id="needItem.id" :has_title="true" :size="28"></item-icon>
                        <span>× {{ needItem.amount }}</span>
                        <point-filter
                            v-if="showPointFilter('NeedItem' + (i + 1))"
                            :default="true"
                            :pointType="`NeedItem${i + 1}`"
                            @onPointFilterChange="changePointFilter"
                        ></point-filter>
                    </div>
                </template>
                <div class="u-target-sub" v-for="(questValue, i) in quest.questValues" :key="questValue + i">
                    <span>{{ questValue.str }} × {{ questValue.value }}</span>
                    <point-filter
                        v-if="showPointFilter('State' + (i + 1))"
                        :default="true"
                        :pointType="`State${i + 1}`"
                        @onPointFilterChange="changePointFilter"
                    ></point-filter>
                </div>
            </div>
            <div class="u-desc" v-show="questDesc">
                <p class="u-subtitle"><el-icon><CaretRight /></el-icon>{{ $t("ui.quest.description") }}</p>
                <p v-html="questDesc"></p>
            </div>
            <div class="u-offer" v-if="quest.offerItems">
                <p class="u-subtitle"><el-icon><CaretRight /></el-icon>{{ $t("ui.quest.providedItems") }}</p>
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
                <p class="u-subtitle"><el-icon><CaretRight /></el-icon>{{ $t("ui.quest.reward") }}</p>
                <div class="u-reward-list">
                    <reward-item v-for="(reward, i) in quest.rewards" :key="i" :reward="reward"></reward-item>
                </div>
            </div>
            <quest-chain :current="id" :data="quest.chain"></quest-chain>
        </div>
        <div v-else-if="!loadError" class="m-quest-top">
            <div class="m-quest-header">
                <div class="m-quest-title">
                    <div class="m-title">
                        <div class="u-title">
                            <img class="u-title-img" src="@/assets/img/quest/quest_title_robot.svg" />
                            {{ quest.name }}
                        </div>
                        <span class="u-title-id"> (ID:{{ quest.id }})</span>
                    </div>

                    <div class="u-endpoint__wrapper">
                        <p class="u-endpoint" v-show="quest.start">
                            <span class="u-endpoint-label">{{ $t("ui.quest.start") }} </span>
                            <span class="u-endpoint-name">{{ quest.start.mapName }}</span>
                            <span class="u-endpoint-separate"> - </span>
                            <item-icon
                                class="u-endpoint-item"
                                v-if="quest.start.type == 'item'"
                                :item_id="quest.start.id"
                                :size="14"
                            ></item-icon>
                            <span class="u-endpoint-name" v-else>{{ quest.start.name || $t("ui.common.labels.unknown") }}</span>
                            <span class="u-endpoint-id"
                                >({{ pointType(quest.start.type) }}ID: {{ idFilter(quest.start.id) }})</span
                            >
                        </p>
                        <!-- <img class="u-quest-to" src="@/assets/img/quest/quest-to.svg" /> -->
                        <p class="u-endpoint">
                            <span class="u-endpoint-label">{{ $t("ui.quest.end") }} </span>
                            <span class="u-endpoint-name">{{ quest.end.mapName }}</span>
                            <span class="u-endpoint-separate"> - </span>
                            <item-icon
                                class="u-endpoint-item"
                                v-if="quest.end.type == 'item'"
                                :item_id="quest.end.id"
                                :size="28"
                            ></item-icon>
                            <span v-else class="u-endpoint-name">{{ quest.end.name || $t("ui.common.labels.unknown") }}</span>
                            <span class="u-endpoint-id"
                                >({{ pointType(quest.end.type) }}ID: {{ idFilter(quest.end.id) }})</span
                            >
                        </p>
                    </div>
                </div>
                <img src="@/assets/img/quest/quest_robot.svg" class="u-item-img__right" />
            </div>
            <div class="m-quest-desc">
                <div class="u-desc-title">
                    <img src="@/assets/img/quest/quest_desc_robot.svg" class="u-title-img" />
                    <div class="u-title">{{ $t("ui.quest.description") }}</div>
                </div>
                <div class="u-desc u-quest-desc" v-html="questDesc.replaceAll('&emsp;', '')"></div>
            </div>
            <div class="m-quest-target__reward">
                <div class="m-quest-target">
                    <div class="u-title">{{ $t("ui.quest.target") }}</div>
                    <template v-if="quest.killNpcs && quest.killNpcs.length > 0">
                        <div class="u-target-sub" v-for="(killNpc, i) in quest.killNpcs" :key="i">
                            <span>{{ $t("ui.quest.kill") }}</span>
                            <span>{{ killNpc.name }}</span>
                            <el-tooltip v-if="killNpc.share" :content="$t('ui.quest.sharedKill')" placement="top">
                                <img src="@/assets/img/quest/target-15.png" style="width: 14px; height: 14px" alt="" />
                            </el-tooltip>
                            <span> × {{ killNpc.amount }}</span>
                        </div>
                    </template>
                    <template v-if="quest.needItems && quest.needItems.length > 0">
                        <div class="u-target-sub" v-for="(needItem, i) in quest.needItems" :key="i">
                            <span>{{ $t("ui.quest.collect") }}</span>
                            <item-icon :item_id="needItem.id" :has_title="true" :size="14"></item-icon>
                            <span>× {{ needItem.amount }}</span>
                        </div>
                    </template>
                    <div class="u-target-sub" v-for="(questValue, i) in quest.questValues" :key="questValue + i">
                        <span>{{ questValue.str }} × {{ questValue.value }}</span>
                    </div>
                    <p class="u-content" v-html="targetDesc.replaceAll('&emsp;', '')"></p>
                </div>
                <div class="m-quest-reward">
                    <div class="u-title">{{ $t("ui.quest.reward") }}</div>
                    <div class="u-reward-list" v-if="quest.rewards?.length">
                        <reward-item v-for="(reward, i) in quest.rewards" :key="i" :reward="reward"></reward-item>
                    </div>
                    <div class="u-reward-list no-data" v-else>{{ $t("ui.quest.noReward") }}</div>
                </div>
            </div>
        </div>
        <div v-if="!isRobot && !loadError">
            <Notice></Notice>
            <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                <el-tab-pane :label="$t('ui.quest.textTab')" v-if="showDialog" name="dialog">
                    <div class="u-quest-dialog">
                        <quest-dialog :desc="quest.desc"></quest-dialog>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('ui.quest.mapTab')" v-if="showMap" name="map">
                    <div class="u-quest-map">
                        <quest-map ref="map" :points="points" :filter="point_filter" :questType="quest.questType">
                        </quest-map>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="m-wiki-post-panel" :class="{ 'is-robot': isRobot }" v-if="wiki_post && wiki_post.post">
            <wikiRobotTip v-if="!isRobot" :type-name="$t('ui.types.quest')" :reply="quest.name"></wikiRobotTip>
            <WikiPanel :wiki-post="wiki_post" ref="wikiPanel">
                <template #head-title>
                    <img class="u-icon" svg-inline src="@/assets/img/quest/quest.svg" />
                    <span class="u-txt">{{ $t("ui.common.wiki.guideTitle", { type: $t("ui.types.quest") }) }}</span>
                </template>
                <template v-if="!isRobot" #head-actions>
                    <a
                        class="u-btn--link el-button el-button--primary u-wiki-action"
                        :href="publish_url(`quest/${id}`)"
                        :aria-label="$t('ui.common.actions.improve')"
                        :title="$t('ui.common.actions.improve')"
                    >
                        <LegacyIcon class="el-icon-edit" aria-hidden="true" />
                        <span class="u-wiki-action-label">{{ $t("ui.common.actions.improve") }}</span>
                    </a>
                </template>
                <template #body>
                    <div class="m-wiki-compatible" v-if="compatible">
                        <LegacyIcon class="el-icon-warning-outline" /> {{ $t("ui.common.wiki.originFallback") }}<a
                            class="s-link"
                            :href="publish_url(`quest/${id}`)"
                            >{{ $t("ui.common.wiki.joinRevision") }}</a
                        >。
                    </div>
                    <Article id="wikiArticle" :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <LegacyIcon class="el-icon-edit" />
                        {{ $t("ui.common.wiki.revisionBy") }} <b>{{ user_name }}</b> {{ $t("ui.common.wiki.submittedAt") }}{{ updated_at }}
                    </div>
                </template>
            </WikiPanel>
            <template v-if="!isRobot">
                <!-- 历史版本 -->
                <WikiRevisions type="quest" :source-id="String(id)" />

                <!-- 打赏 -->
                <div class="m-wiki-thx-panel">
                    <WikiPanel>
                        <template #head-title>
                            <i class="u-icon el-icon-coin"></i>
                            <span class="u-txt">{{ $t("ui.common.wiki.reward") }}</span>
                        </template>
                        <template #body>
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
                                category="quest"
                            />
                        </template>
                    </WikiPanel>
                </div>

                <!-- 百科评论 -->
                <WikiComments type="quest" :source-id="id_str" />
            </template>
        </div>
        <div
            class="m-wiki-post-empty"
            :class="isRobot ? 'is-robot-quest-empty' : ''"
            v-else-if="!pageLoading && !loadError"
        >
            <template v-if="!isRobot">
                <LegacyIcon class="el-icon-s-opportunity" />
                <span>{{ $t("ui.common.wiki.noGuidePrefix") }}</span>
                <a class="s-link" :href="publish_url(`quest/${id}`)">{{ $t("ui.common.actions.improve") }}</a>
            </template>
            <span v-else>{{ $t("ui.common.wiki.noRelatedGuide") }}</span>
        </div>
        <wiki-robot-bottom v-if="isRobot" type="quest" :id="id"></wiki-robot-bottom>
    </div>
</template>

<script>
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import QuestChain from "@/components/quest/single/quest-chain.vue";
import QuestMap from "@/components/quest/single/quest-map.vue";
import RewardItem from "@/components/quest/single/reward-item.vue";
import PointFilter from "@/components/quest/single/point-filter.vue";
import ItemIcon from "@/components/common/item-icon.vue";
import QuestDialog from "@/components/quest/single/quest-dialog.vue";
import Notice from "@/components/quest/single/notice.vue";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";
import { createArticleReadyTracker } from "@/utils/article-ready";

import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat.js";
import { wiki } from "@jx3box/jx3box-common/js/wiki.js";
import User from "@jx3box/jx3box-common/js/user";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";

import { publishLink, ts2str } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@/components/common/wiki-panel.vue";
import WikiRevisions from "@/components/common/wiki-revisions.vue";
import WikiComments from "@jx3box/jx3box-ui/src/wiki/WikiComments.vue";
import Thx from "@jx3box/jx3box-ui/src/single/Thx.vue";
import wikiRobotBottom from "@/components/common/wiki-robot-bottom.vue";
import wikiRobotTip from "@/components/common/wiki-robot-tip.vue";

import { getQuest, completeUserQuest, cancelUserQuest } from "@/service/quest";
import { buildPoints, schoolIcon, questDescFormat, questTargetDescFormat } from "@/utils/quest.js";
import isArray from "lodash/isArray";
import { mapState } from "vuex";
import bus from "@/store/bus";

function createEmptyQuest() {
    return {
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
        questValues: [],
    };
}

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
        Thx,
        Notice,
        wikiRobotBottom,
        wikiRobotTip,
        AsyncState,
    },
    data() {
        return {
            loading: false,
            pageLoading: false,
            loadError: false,
            requestGuard: createLatestRequestGuard(),
            articleReadyTracker: createArticleReadyTracker(),

            wiki_post: {
                source: {},
                post: null,
            },
            compatible: false,
            is_empty: true,

            activeTab: "dialog",

            quest: createEmptyQuest(),
            point_filter: {
                Start: true,
                End: true,
            },
            icon: getAppIcon("quest"),
            mapResizeTimer: null,
        };
    },
    beforeUnmount() {
        bus.off("openWikiPush", this.handleWikiPush);
        this.requestGuard.invalidate();
        this.articleReadyTracker.cancel();
        clearTimeout(this.mapResizeTimer);
    },
    methods: {
        handleWikiPush() {
            if (!this.wiki_post?.post?.id) {
                return this.$message.warning(this.$t("ui.quest.noGuideWarning"));
            }
            this.$refs.wikiPanel?.onPush();
        },
        onQuestCancel() {
            if (this.loading || !this.role) return;
            const role_id = this.role.ID;
            const quest_id = this.quest.id;
            this.loading = true;
            cancelUserQuest(role_id, quest_id)
                .then(() => {
                    this.$message.success(this.$t("ui.common.status.operationComplete"));
                    this.$store.commit("REMOVE_COMPLETED_QUEST", quest_id);
                })
                .catch(() => {
                    this.$message.error(this.$t("ui.common.status.networkError"));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onQuestComplete() {
            if (this.loading || !this.role) return;
            const role_id = this.role.ID;
            const quest_id = this.quest.id;
            this.loading = true;
            completeUserQuest(role_id, quest_id)
                .then(() => {
                    this.$message.success(this.$t("ui.common.status.operationComplete"));
                    this.$store.commit("ADD_COMPLETED_QUEST", quest_id);
                })
                .catch(() => {
                    this.$message.error(this.$t("ui.common.status.networkError"));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        handleTabClick(tab) {
            if (tab.paneName === "map") {
                clearTimeout(this.mapResizeTimer);
                this.mapResizeTimer = setTimeout(() => {
                    this.$refs.map && this.$refs.map.updateSize();
                }, 100);
            }
        },
        buildPoints,
        schoolIcon,
        changePointFilter(type, enable) {
            this.point_filter[type] = enable;
        },
        showPointFilter(type) {
            return Object.values(this.points).some((points) => {
                return points.some((point) => {
                    return point.Types === type;
                });
            });
        },

        async prepareArticleReady() {
            if (!this.isRobot) return;
            await this.$nextTick();
            await this.articleReadyTracker.wait(this.$el?.querySelector("#wikiArticle"));
        },
        // 百科与任务主体共享同一轮请求，路由快速切换时只采纳最后一轮结果。
        syncQuestData: async function () {
            if (!this.id) return;
            const token = this.requestGuard.begin();
            this.pageLoading = true;
            this.loadError = false;
            this.quest = createEmptyQuest();
            this.wiki_post = { source: {}, post: null };
            this.compatible = false;
            this.is_empty = false;
            if (this.isRobot) {
                this.articleReadyTracker.cancel();
                window.__READY__ = false;
            }

            try {
                const [questResponse, wikiResponse, revisionResponse] = await Promise.all([
                    getQuest({ id: this.id, client: this.client }),
                    wiki.mix({ type: "quest", id: this.id, client: this.client }),
                    this.post_id
                        ? wiki.getById(this.post_id, { type: "quest" })
                        : Promise.resolve(null),
                ]);
                if (!this.requestGuard.isCurrent(token)) return;

                this.quest = questResponse?.data || createEmptyQuest();
                const { post, source, compatible, isEmpty, users } = wikiResponse;
                this.wiki_post = {
                    post: revisionResponse?.data?.data?.post || post,
                    source,
                    users,
                };
                this.is_empty = isEmpty;
                this.compatible = compatible;
                document.title = this.quest?.name + this.$t("pages.common.appendTitle");

                User.isLogin() &&
                    postHistory({
                        source_type: this.client == "origin" ? "origin_quest" : "quest",
                        source_id: ~~this.id,
                        link: location.href,
                        title: this.quest.name,
                    });

                this.triggerStat();
            } catch (e) {
                if (!this.requestGuard.isCurrent(token)) return;
                this.loadError = true;
            } finally {
                if (this.requestGuard.isCurrent(token)) {
                    this.pageLoading = false;
                    this.prepareArticleReady();
                }
            }
        },
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_quest", this.id);
            } else {
                postStat("quest", this.id);
            }
        },
        pointType(value) {
            if (value === "npc") return "NPC";
            if (value === "doodad") return this.$t("ui.quest.interactiveItem");
            if (value === "item") return this.$t("ui.types.item");
            return "";
        },
        idFilter(id) {
            if (isArray(id)) {
                return `${id[0]}_${id[1]}`;
            }
            return id;
        },
    },
    mounted() {
        bus.on("openWikiPush", this.handleWikiPush);
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
            return questDescFormat(this.quest.desc?.Description, false, {
                playerName: this.$t("ui.quest.defaultPlayerName"),
                playerBody: this.$t("ui.quest.defaultPlayerBody"),
            });
        },
        targetDesc: function () {
            return questTargetDescFormat(this.quest.desc?.Objective, this.$t("ui.quest.defaultPlayerName"));
        },
        showReward: function () {
            return this.quest.rewards && this.quest.rewards.length > 0;
        },
        questNameClass() {
            return {
                "is-repeat": this.quest.questType === "repeat",
                "is-act": this.quest.questType === "act",
            };
        },
        client() {
            return this.$store.state.client;
        },
        points() {
            return this.buildPoints(this.quest);
        },
        routeDataKey() {
            return `${this.id || ""}:${this.post_id || ""}:${this.client || ""}`;
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
        routeDataKey: {
            immediate: true,
            handler() {
                this.syncQuestData();
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/single.less";
</style>
