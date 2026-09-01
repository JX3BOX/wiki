<template>
    <div class="v-knowledge-single" v-loading="loading">
        <AsyncState :loading="loading" :error="loadError" @retry="syncWikiData" />
        <div v-if="!isRobot" class="u-detail-title">
            <span>{{ title }}</span>
            <el-tag v-if="categoryLabel" class="u-detail-category" size="small" effect="light">{{
                categoryLabel
            }}</el-tag>
        </div>
        <div v-else class="m-robot-header">
            <div class="m-robot-header__left">
                <div class="u-title">{{ title }}</div>
                <div class="u-desc">{{ $t("ui.knowledge.tagline") }}</div>
            </div>
            <img class="u-robot-header__right" src="@/assets/img/knowledge/knowledge_robot.svg" />
        </div>
        <notice v-if="!isRobot"></notice>
        <div class="m-wiki m-wiki-post-panel" :class="{ 'is-robot': isRobot }" v-if="data && data.post">
            <WikiRobotTip v-if="!isRobot" :type-name="$t('ui.types.knowledge')" :reply="title"></WikiRobotTip>
            <WikiPanel class="m-knowledge-panel" :wiki-post="data" ref="wikiPanel">
                <template #head-title>
                    <img class="u-icon" svg-inline src="../../assets/img/knowledge/knowledge.svg" />
                    <span class="u-txt">{{ $t("ui.common.wiki.guideTitle", { type: $t("ui.types.knowledge") }) }}</span>
                </template>
                <template v-if="!isRobot" #head-actions>
                    <a class="u-btn--link el-button el-button--primary" :href="publishLink(`knowledge/${id}`)">
                        <LegacyIcon class="el-icon-edit" />
                        <span>{{ $t("ui.knowledge.improve") }}</span>
                    </a>
                </template>
                <template #body>
                    <Article id="wikiArticle" :content="content" />
                </template>
            </WikiPanel>

            <template v-if="!isRobot">
                <WikiRevisions v-if="id" type="knowledge" :source-id="id" style="margin-bottom: 35px" />

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
                                postType="knowledge"
                                :postTitle="title"
                                :userId="author_id"
                                :adminBoxcoinEnable="true"
                                :userBoxcoinEnable="true"
                                mode="wiki"
                                :authors="authors"
                                :key="'item-thx-' + id"
                                showRss
                                category="knowledge"
                            />
                        </template>
                    </WikiPanel>
                </div>

                <WikiPanel v-if="id" class="m-knowledge-panel">
                    <template #head-title>
                        <LegacyIcon class="u-icon el-icon-chat-line-round" />
                        <span class="u-txt">{{ $t("ui.common.wiki.discussion") }}</span>
                    </template>
                    <template #body>
                        <SingleComment :id="id" category="knowledge" />
                    </template>
                </WikiPanel>
            </template>
        </div>

        <div v-else-if="!loading && !loadError" class="m-wiki-null" :class="isRobot ? 'is-robot-empty' : ''">
            <template v-if="!isRobot">
                <LegacyIcon class="el-icon-s-opportunity" />
                <span>{{ $t("ui.common.wiki.noContentPrefix") }}</span>
                <a class="s-link" :href="publishLink(`knowledge/${id}`)">{{ $t("ui.knowledge.improve") }}</a>
            </template>
            <span v-else>{{ $t("ui.common.wiki.noRelatedGuide") }}</span>
        </div>
        <wiki-robot-bottom v-if="isRobot" type="knowledge" :id="id"></wiki-robot-bottom>
    </div>
</template>

<script>
import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@/components/common/wiki-panel.vue";
import WikiRevisions from "@/components/common/wiki-revisions.vue";
import User from "@jx3box/jx3box-common/js/user";
import { wiki } from "@jx3box/jx3box-common/js/wiki";

import Article from "@jx3box/jx3box-editor/src/Article.vue";
import notice from "@/components/cj/notice.vue";
import wikiRobotBottom from "@/components/common/wiki-robot-bottom.vue";
import bus from "@/store/bus";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";
import SingleComment from "@jx3box/jx3box-ui/src/single/Comment.vue";
import { getKnowledgeMenus } from "@/service/knowledge.js";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";
import { createArticleReadyTracker } from "@/utils/article-ready";

export default {
    name: "Detail",
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
    data: function () {
        return {
            loading: false,
            data: "",
            knowledgeTypeMap: {},
            loadError: false,
            requestGuard: createLatestRequestGuard(),
            typesRequestGuard: createLatestRequestGuard(),
            articleReadyTracker: createArticleReadyTracker(),
        };
    },
    components: {
        Article,
        WikiPanel,
        WikiRevisions,
        notice,
        wikiRobotBottom,
        WikiRobotTip,
        SingleComment,
        AsyncState,
    },
    computed: {
        id: function () {
            return this.$route.params.source_id || this.sourceId;
        },
        type: function () {
            return this.data?.source?.type;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.data?.post?.user_id;
        },
        title: function () {
            return this.data?.source?.name;
        },
        categoryLabel() {
            const source = this.data?.source || {};
            const directLabel = source.label;
            if (directLabel) return directLabel;
            const type = source.type;
            if (!type) return "";
            return this.knowledgeTypeMap[type] || type;
        },
        content: function () {
            return this.data?.post?.content;
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.data?.users
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
        isEditor: function () {
            return User.isEditor();
        },
        routeDataKey() {
            return `${this.id || ""}:${this.$route.params.post_id || ""}`;
        },
    },
    methods: {
        onSearchKey(val) {
            this.$router.push({ path: "/", query: { search: val } });
        },
        async prepareArticleReady() {
            if (!this.isRobot) return;
            await this.$nextTick();
            await this.articleReadyTracker.wait(this.$el?.querySelector("#wikiArticle"));
        },
        async syncWikiData() {
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
            if (this.isRobot) {
                this.articleReadyTracker.cancel();
                window.__READY__ = false;
            }
            try {
                const [sourceResponse, revisionResponse] = await Promise.all([
                    wiki.get({ type: "knowledge", id: this.id }),
                    this.$route.params.post_id
                        ? wiki.getById(this.$route.params.post_id)
                        : Promise.resolve(null),
                ]);
                if (!this.requestGuard.isCurrent(token)) return;

                const sourceData = sourceResponse.data.data;
                this.data = revisionResponse
                    ? {
                          ...sourceData,
                          post: revisionResponse.data.data?.post || null,
                      }
                    : sourceData;

                User.isLogin() &&
                    postHistory({
                        source_type: "knowledge",
                        source_id: ~~this.id,
                        link: location.href,
                        title: this.title,
                    });

                document.title = this.title + this.$t("pages.common.appendTitle");

            } catch (e) {
                if (!this.requestGuard.isCurrent(token)) return;
                this.data = "";
                this.loadError = true;
            } finally {
                if (this.requestGuard.isCurrent(token)) {
                    this.loading = false;
                    postStat(this.type, this.id);
                    this.prepareArticleReady();
                }
            }
        },
        goBack() {
            if (this.data?.source?.type) {
                this.$router.push({ name: "normal", params: { knowledge_type: this.data.source.type } });
            } else {
                this.$router.push({ name: "index" });
            }
        },
        async loadKnowledgeTypes() {
            const token = this.typesRequestGuard.begin();
            try {
                const res = await getKnowledgeMenus();
                if (!this.typesRequestGuard.isCurrent(token)) return;
                const list = res?.data?.data || [];
                this.knowledgeTypeMap = list.reduce((acc, item) => {
                    if (!item?.name) return acc;
                    acc[item.name] = item.label || item.name;
                    return acc;
                }, {});
            } catch (e) {
                if (!this.typesRequestGuard.isCurrent(token)) return;
                this.knowledgeTypeMap = {};
            }
        },
        handleWikiPush() {
            if (!this.data?.source?.id) {
                return this.$message.warning(this.$t("ui.knowledge.noGuideWarning"));
            }
            this.$refs.wikiPanel?.onPush();
        },
        publishLink,
    },
    beforeUnmount() {
        bus.off("openWikiPush", this.handleWikiPush);
        this.requestGuard.invalidate();
        this.typesRequestGuard.invalidate();
        this.articleReadyTracker.cancel();
    },
    mounted() {
        this.loadKnowledgeTypes();
        bus.on("openWikiPush", this.handleWikiPush);
    },
    watch: {
        routeDataKey: {
            immediate: true,
            handler() {
                if (this.id) {
                    this.syncWikiData();
                }
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/knowledge/single.less";
</style>
