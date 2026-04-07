<template>
    <div class="v-knowledge-single" v-loading="loading">
        <div v-if="!isRobot" class="u-detail-title">
            <span>{{ title }}</span>
            <el-tag v-if="categoryLabel" class="u-detail-category" size="small" effect="light">{{ categoryLabel }}</el-tag>
        </div>
        <div v-else class="m-robot-header">
            <div class="m-robot-header__left">
                <div class="u-title">{{ title }}</div>
                <div class="u-desc">剑网3魔盒通识百科 - 剑三世界概念全知道！</div>
            </div>
            <img class="u-robot-header__right" src="@/assets/img/knowledge/knowledge_robot.svg" />
        </div>
        <notice v-if="!isRobot"></notice>
        <div class="m-wiki m-wiki-post-panel" :class="{ 'is-robot': isRobot }" v-if="data && data.post">
            <WikiRobotTip v-if="!isRobot" type-name="通识" :reply="title"></WikiRobotTip>
            <WikiPanel class="m-knowledge-panel" :wiki-post="data" ref="wikiPanel">
                <template #head-title>
                    <img class="u-icon" svg-inline src="../../assets/img/knowledge/knowledge.svg" />
                    <span class="u-txt">通识攻略</span>
                </template>
                <template v-if="!isRobot" #head-actions>
                    <a class="u-btn--link el-button el-button--primary" :href="publishLink(`knowledge/${id}`)">
                        <LegacyIcon class="el-icon-edit" />
                        <span>完善通识</span>
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
                            <span class="u-txt">参与打赏</span>
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
                        <span class="u-txt">讨论</span>
                    </template>
                    <template #body>
                        <SingleComment :id="id" category="knowledge" />
                    </template>
                </WikiPanel>
            </template>
        </div>

        <div v-else class="m-wiki-null" :class="isRobot ? 'is-robot-empty' : ''">
            <template v-if="!isRobot">
                <LegacyIcon class="el-icon-s-opportunity" />
                <span>暂无内容，我要</span>
                <a class="s-link" :href="publishLink(`knowledge/${id}`)">完善通识</a>
            </template>
            <span v-else>暂无相关攻略，欢迎热心侠士前往补充！</span>
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

            imageCount: 0,
            loadedImageCount: 0,
            images: [],
            imagesLoaded: false,
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
    },
    methods: {
        onSearchKey(val) {
            this.$router.push({ path: "/", query: { search: val } });
        },
        initImageLoader() {
            // 在DOM更新后获取所有图片
            this.$nextTick(() => {
                const container = document.getElementById("wikiArticle");
                if (!container) {
                    this.setGlobalReady();
                    return;
                }

                const images = container.querySelectorAll("img");
                this.images = images;
                this.imageCount = images.length;

                if (this.imageCount === 0) {
                    this.setGlobalReady();
                    return;
                }

                // 手动预加载所有图片
                this.preloadAllImages(images);
            });
        },

        // 手动预加载所有图片
        preloadAllImages(images) {
            let loadedInThisBatch = 0;
            let totalProcessed = 0;
            Array.from(images).forEach((img, index) => {
                // 记录原始src
                const originalSrc = img.src;

                // 如果图片未加载
                if (!img.complete) {
                    // 创建一个Image对象来预加载
                    const tempImg = new Image();

                    tempImg.onload = () => {
                        loadedInThisBatch++;

                        // 在临时图片加载完成后，设置原始图片的src
                        img.src = originalSrc;

                        // 检查是否所有图片都已处理
                        this.checkImageLoadCompletion(images, loadedInThisBatch);
                    };

                    tempImg.onerror = () => {
                        console.error(`图片加载失败: ${originalSrc}`);
                        totalProcessed++;

                        // 即使加载失败，也要设置原始图片的src
                        img.src = originalSrc;

                        // 标记原始图片为已加载（错误情况）
                        this.handleImageLoad();
                    };

                    // 开始预加载
                    tempImg.src = originalSrc;
                } else {
                    // 图片已经加载完成
                    this.handleImageLoad();
                    totalProcessed++;
                }
            });
        },

        // 检查图片加载状态
        checkImageLoadCompletion(images, loadedCount) {
            if (images.length === this.loadedImageCount) {
                this.setGlobalReady();
                return;
            }

            // 设置超时检查，防止意外情况
            setTimeout(() => {
                const allLoaded = Array.from(images).every((img) => img.complete);

                if (allLoaded) {
                    this.setGlobalReady();
                } else if (this.loadedImageCount === images.length) {
                    this.setGlobalReady();
                }
            }, 3000);
        },

        // 判断是否全部完成
        handleImageLoad() {
            this.loadedImageCount++;
            if (this.loadedImageCount === this.imageCount) {
                this.setGlobalReady();
            }
        },

        // 设置全局就绪状态
        setGlobalReady() {
            if (this.imagesLoaded) return; // 避免重复设置

            this.imagesLoaded = true;
            window.__READY__ = true;
            console.log("全局状态设置成功: __READY__ = ", window.__READY__);
        },
        async getData() {
            this.loading = true;
            return await wiki
                .get({ type: "knowledge", id: this.id })
                .then((res) => {
                    this.data = res.data.data;

                    User.isLogin() &&
                        postHistory({
                            source_type: "knowledge",
                            source_id: ~~this.id,
                            link: location.href,
                            title: this.title,
                        });

                    document.title = this.title + this.$t("pages.common.appendTitle");
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
                });

            // 请注意，为防止QQBOT无法抓取完全，请不要删除
            if (this.isRobot) {
                // 数据加载后启动奇遇流程中的图片检测
                this.initImageLoader();
            }
        },
        getPostData() {
            this.loading = true;
            return wiki
                .getById(this.$route.params.post_id)
                .then((res) => {
                    const data = res.data.data;
                    this.data = {
                        ...this.data,
                        post: data.post || null,
                    };
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
                });
        },
        async syncWikiData() {
            await this.getData();
            if (this.$route.params.post_id) {
                await this.getPostData();
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
            try {
                const res = await getKnowledgeMenus();
                const list = res?.data?.data || [];
                this.knowledgeTypeMap = list.reduce((acc, item) => {
                    if (!item?.name) return acc;
                    acc[item.name] = item.label || item.name;
                    return acc;
                }, {});
            } catch (e) {
                this.knowledgeTypeMap = {};
            }
        },
        publishLink,
    },
    beforeUnmount() {
        window.removeEventListener("load", this.initImageLoader);
    },
    mounted() {
        this.loadKnowledgeTypes();
        bus.on("openWikiPush", (param) => {
            console.log(this.wiki_post);
            if (!this.data?.source?.post?.id) {
                return this.$message.warning("该通识没有攻略");
            }
            this.$refs.wikiPanel?.onPush();
        });
    },
    watch: {
        "$route.params.post_id": {
            immediate: true,
            async handler() {
                if (this.$route.params.post_id) {
                    await this.getPostData();
                } else if (this.id) {
                    await this.getData();
                }
            },
        },
        id: {
            immediate: true,
            async handler() {
                if (this.id) {
                    await this.syncWikiData();
                }
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/knowledge/single.less";
</style>
