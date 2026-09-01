<template>
    <div class="m-detail-view" v-loading="loading">
        <AsyncState :loading="loading" :error="loadError" @retry="syncWikiData" />
        <AchievementSingle v-if="source && !loadError" :isRobot="isRobot" :achievement="source" show-favorite="true" />

        <Notice v-if="!isRobot"></Notice>
        <div class="m-wiki-post-panel" :class="{ 'is-robot': isRobot }" v-if="wiki_post && wiki_post.post">
            <WikiRobotTip v-if="!isRobot" :type-name="$t('ui.types.achievement')" :reply="source?.Name"></WikiRobotTip>
            <WikiPanel :wiki-post="wiki_post" ref="wikiPanel">
                <template #head-title>
                    <img class="u-icon" svg-inline src="@/assets/img/cj/achievement.svg" />
                    <span class="u-txt">{{ $t("ui.common.wiki.guideTitle", { type: $t("ui.types.achievement") }) }}</span>
                    <!-- 带post_id时对应的是具体的某个版本 -->
                    <span v-if="post_id" class="u-version">
                        {{ $t("ui.common.wiki.historicalVersion") }}<a :href="`/cj/view/${id}`">
                            {{ $t("ui.common.actions.view") }} </a
                        >{{ $t("ui.common.wiki.latestGuide") }}
                    </span>
                </template>
                <template v-if="!isRobot" #head-actions>
                    <a class="u-btn--link el-button el-button--primary" :href="publish_url(`achievement/${id}`)">
                        <LegacyIcon class="el-icon-edit" />
                        <span>{{ $t("ui.common.actions.improve") }}</span>
                    </a>
                </template>
                <template #body>
                    <div class="m-wiki-compatible" v-if="compatible">
                        <LegacyIcon class="el-icon-warning-outline" /> {{ $t("ui.common.wiki.originFallback") }}<a
                            class="s-link"
                            :href="publish_url(`achievement/${id}`)"
                            >{{ $t("ui.common.wiki.joinRevision") }}</a
                        >
                    </div>
                    <Article id="wikiArticle" :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <LegacyIcon class="el-icon-edit" />
                        {{ $t("ui.common.wiki.revisionBy") }} <b>{{ user_name }}</b>
                        {{ $t("ui.common.wiki.submittedAt") }} {{ updated_at }}
                    </div>
                </template>
            </WikiPanel>

            <template v-if="!isRobot">
                <Relations :source-id="id" />

                <!-- 历史版本 -->
                <WikiRevisions type="achievement" :source-id="id" />

                <!-- 打赏 -->
                <div class="m-wiki-thx-panel">
                    <WikiPanel>
                        <template #head-title>
                            <LegacyIcon class="u-icon el-icon-coin" />
                            <span class="u-txt">{{ $t("ui.common.wiki.reward") }}</span>
                        </template>
                        <template #body>
                            <Thx
                                class="m-thx"
                                :postId="~~id"
                                postType="achievement"
                                :postTitle="favTitle"
                                :userId="author_id"
                                :adminBoxcoinEnable="true"
                                :userBoxcoinEnable="true"
                                mode="wiki"
                                :authors="authors"
                                :key="'achievement-thx-' + id"
                                :client="client"
                                showRss
                                category="cj"
                            />
                        </template>
                    </WikiPanel>
                </div>

                <!-- 百科评论 -->
                <WikiComments type="achievement" :source-id="id" />
            </template>
        </div>
        <div
            class="m-wiki-post-empty"
            :class="isRobot ? 'is-robot-empty' : ''"
            v-if="is_empty && !loading && !loadError"
        >
            <template v-if="!isRobot">
                <LegacyIcon class="el-icon-s-opportunity" />
                <span>{{ $t("ui.common.wiki.noGuidePrefix") }}</span>
                <a class="s-link" :href="publish_url(`achievement/${id}`)">{{
                    $t("ui.common.actions.improve")
                }}</a>
            </template>
            <span v-else>{{ $t("ui.common.wiki.noRelatedGuide") }}</span>
        </div>
        <wiki-robot-bottom v-if="isRobot" type="cj" :id="id"></wiki-robot-bottom>
    </div>
</template>

<script>
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import WikiPanel from "@/components/common/wiki-panel.vue";
import WikiRevisions from "@/components/common/wiki-revisions.vue";
import WikiComments from "@jx3box/jx3box-ui/src/wiki/WikiComments.vue";
import AchievementSingle from "@/components/cj/achievement-single.vue";
import Relations from "@/components/cj/relations.vue";
import Notice from "@/components/cj/notice.vue";
import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { ts2str } from "@jx3box/jx3box-common/js/utils.js";
import { getConfig } from "@jx3box/jx3box-common/js/system";
import { report } from "@/service/user";
import User from "@jx3box/jx3box-common/js/user";
import bus from "@/store/bus.js";

import { get_achievement } from "@/service/achievement";
import WikiRobotBottom from "@/components/common/wiki-robot-bottom.vue";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";
import { createArticleReadyTracker } from "@/utils/article-ready";
export default {
    name: "Detail",
    components: {
        AchievementSingle,
        WikiPanel,
        WikiRevisions,
        WikiComments,
        Relations,
        Article,
        Notice,
        WikiRobotBottom,
        WikiRobotTip,
        AsyncState,
    },
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
    data() {
        return {
            source: "",
            wiki_post: "",
            compatible: false,
            is_empty: true,
            loading: false,
            loadError: false,
            requestGuard: createLatestRequestGuard(),
            articleReadyTracker: createArticleReadyTracker(),
        };
    },
    computed: {
        id() {
            return this.$route.params.source_id || this.sourceId;
        },
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post?.post?.user_id;
        },
        client: function () {
            return this.$store.state.client;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
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
        favTitle: function () {
            return this.wiki_post?.source?.Name;
        },
        prefix() {
            return this.client === "std" ? "www" : "origin";
        },
        routeDataKey() {
            return `${this.id || ""}:${this.post_id || ""}:${this.client || ""}`;
        },
    },
    methods: {
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_cj", this.id);
            } else {
                postStat("cj", this.id);
            }
        },
        async prepareArticleReady() {
            if (!this.isRobot) return;
            await this.$nextTick();
            await this.articleReadyTracker.wait(this.$el?.querySelector("#wikiArticle"));
        },
        async syncWikiData() {
            if (!this.id) return;
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
            this.source = "";
            this.wiki_post = "";
            this.is_empty = false;
            if (this.isRobot) {
                this.articleReadyTracker.cancel();
                window.__READY__ = false;
            }
            try {
                const [achievementResponse, wikiResponse, revisionResponse] = await Promise.all([
                    get_achievement(this.id, { client: this.client }),
                    wiki.mix({ type: "achievement", id: this.id, client: this.client }),
                    this.post_id ? wiki.getById(this.post_id) : Promise.resolve(null),
                ]);
                if (!this.requestGuard.isCurrent(token)) return;

                this.source = achievementResponse?.data?.data?.achievement || "";
                const { post, source, compatible, isEmpty, users } = wikiResponse;
                this.wiki_post = {
                    post: revisionResponse?.data?.data?.post || post,
                    source,
                    users,
                };
                this.is_empty = isEmpty;
                this.compatible = compatible;
                document.title = this.wiki_post.source?.Name + this.$t("pages.common.appendTitle");

                User.isLogin() &&
                    postHistory({
                        source_type: this.client == "origin" ? "origin_cj" : "cj",
                        source_id: ~~this.id,
                        link: location.href,
                        title: this.wiki_post.post?.title,
                    });

                this.triggerStat();
            } catch (e) {
                if (!this.requestGuard.isCurrent(token)) return;
                this.loadError = true;
            } finally {
                if (this.requestGuard.isCurrent(token)) {
                    this.loading = false;
                    this.prepareArticleReady();
                }
            }
        },
        ts2str,
        loadConfig() {
            getConfig({ key: "test_user_ua" }).then((res) => {
                const isTest = ~~res.data.data.val;

                if (isTest) {
                    report();
                }
            });
        },
        handleWikiPush() {
            if (!this.wiki_post?.post?.id) {
                return this.$message.warning(this.$t("ui.achievement.noGuideWarning"));
            }
            this.$refs.wikiPanel?.onPush();
        },
    },
    watch: {
        routeDataKey: {
            immediate: true,
            handler() {
                this.syncWikiData();
            },
        },
    },
    mounted: function () {
        this.loadConfig();

        bus.on("openWikiPush", this.handleWikiPush);

        // const ua = navigator.userAgent;
        // // 当ua包含 Android 或 iPhone 或 Mobile 时
        // if (ua.indexOf("Android") > -1 || ua.indexOf("iPhone") > -1) {
        //     location.href = `/wujie/cj/view/${this.id}`;
        // }
    },
    beforeUnmount() {
        bus.off("openWikiPush", this.handleWikiPush);
        this.requestGuard.invalidate();
        this.articleReadyTracker.cancel();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/detail.less";
</style>
