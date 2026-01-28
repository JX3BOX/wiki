<template>
    <div class="p-knowledge-mobile-detail c-var" v-loading="loading">
        <div class="m-page-container">
            <!-- Main Title -->
            <div class="u-main-title" v-if="title">{{ title }}</div>

            <!-- Content Card -->
            <fold-card title="通识攻略" fixed v-if="post">
                <div class="m-wiki-header">
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
                            <Article id="wikiArticle" :content="clearContent(content)" />
                        </div>
                    </div>
                </div>
            </fold-card>

            <!-- Empty State -->
            <div class="m-empty" v-if="!loading && !post">
                <i class="el-icon-warning-outline"></i>
                <span>暂无相关内容</span>
            </div>

            <!-- Comments -->
            <div class="m-comments" v-if="id">
                <miniprogram-comment-list :id="id" category="knowledge" />
            </div>
        </div>

        <!-- Bottom Action Bar -->
        <suspend-common
            class="u-suspend-common"
            :btn-options="{
                showHome: true,
                showIcon: false,
                showMore: true,
            }"
            :drawer-options="drawerOptions"
            style="width: 100%"
            @search="onSearch"
        >
            <template #default>
                <div class="m-more-action">
                    <span type="text" v-loading="favLoading" class="u-action" @click="toggleFav">
                        <i :class="isFav ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                        {{ isFav ? "取消收藏" : "收藏页面" }}
                    </span>
                </div>
            </template>
        </suspend-common>
    </div>
</template>

<script>
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import MiniprogramCommentList from "@/components/knowledge/mobile/comment-list.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import { showAvatar, ts2str } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getMyFav, delMyFav } from "@/service/item.js"; // Reuse item service or common service
import { addFav } from "@jx3box/jx3box-common-ui/service/fav";
import { isInMiniprogramWebview } from "@/utils/minprogram";
import FoldCard from "@/components/quest/mobile/fold-card.vue";

export default {
    name: "MobileKnowledgeDetail",
    components: {
        FoldCard,
        SuspendCommon,
        MiniprogramCommentList,
        Article,
    },
    data() {
        return {
            loading: false,
            data: "",
            favItemList: [],
            favLoading: false,
        };
    },
    computed: {
        id() {
            return this.$route.params.source_id;
        },
        title() {
            return this.data?.source?.name;
        },
        post() {
            return this.data?.post;
        },
        content() {
            return this.post?.content;
        },
        updated_at() {
            // Format to YYYY-MM-DD
            return this.post?.updated ? ts2str(this.post.updated).split(" ")[0] : "";
        },
        authors() {
            return (
                this.data?.users
                    ?.filter((user) => user.id)
                    ?.map((user) => ({
                        user_id: user.id,
                        user_avatar: user.avatar,
                        display_name: user.nickname,
                    })) || []
            );
        },
        isFav() {
            return this.favItemList.some((item) => item.post_id == this.id);
        },
        drawerOptions() {
            return {
                hideType: ["report"],
                direction: "btt",
                drawerTitle: this.title,
                author: {
                    name: this.authors[0]?.display_name || "",
                    avatar: this.authors[0]?.user_avatar || "",
                    author_id: this.authors[0]?.user_id || 0,
                },
                subscribeType: "wiki",
                postType: "knowledge",
                id: this.post?.id,
                title: this.title || document.title,
                url: window.location.href,
            };
        },
    },
    methods: {
        showAvatar,
        loadData() {
            if (!this.id) return;
            this.loading = true;
            wiki.get({ type: "knowledge", id: this.id })
                .then((res) => {
                    this.data = res.data.data;
                    if (this.data.source && this.data.post) {
                        this.data.source.post = this.data.post;
                    }
                    if (User.isLogin()) {
                        postHistory({
                            source_type: "knowledge",
                            source_id: ~~this.id,
                            link: location.href,
                            title: this.title,
                        });
                    }
                    postStat("knowledge", this.id);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        clearContent(content) {
            return (content || "")
                .replace(/ style="[^"]*"/g, "")
                .replace(/<i?frame.*?src="(.*?)".*?>/g, (match, src) => `<a href="${src}" target="_blank">${src}</a>`)
                .replace(
                    /<i?frame.*?src="(.*?)".*?>.*?<\/i?frame>/g,
                    (match, src) => `<a href="${src}" target="_blank">${src}</a>`
                );
        },
        toggleFav() {
            if (this.favLoading || !this.id) return;
            this.favLoading = true;
            if (this.isFav) {
                const favItem = this.favItemList.find((item) => item.post_id == this.id);
                delMyFav(favItem.id)
                    .then(() => {
                        this.favItemList = this.favItemList.filter((item) => item.post_id != this.id);
                    })
                    .finally(() => {
                        this.favLoading = false;
                    });
            } else {
                addFav("knowledge", this.id, this.title)
                    .then((res) => {
                        this.favItemList.push({
                            id: res.id,
                            post_id: this.id,
                            post_type: "knowledge",
                        });
                    })
                    .finally(() => {
                        this.favLoading = false;
                    });
            }
        },
        loadFavItems() {
            if (!User.isLogin()) return;
            getMyFav({ post_type: "knowledge", pageSize: 50 }).then((res) => {
                const list = res.data.data.list;
                if (list) this.favItemList = list;
            });
        },
        onSearch() {
            if (isInMiniprogramWebview()) {
                wx.miniProgram.navigateTo({
                    url: `/pages/search/search-detail/search-detail?app=wiki&filter_category=通识`,
                });
            } else {
                this.$message.warning("非小程序环境，不支持跳转搜索页");
            }
        },
    },
    created() {
        this.loadData();
        this.loadFavItems();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.p-knowledge-mobile-detail {
    min-height: 100vh;
    background: #fafafa;
    display: flex;
    flex-direction: column;

    @media (prefers-color-scheme: dark) {
        background: #000;
    }

    .m-comments,
    .m-comment-list {
        margin-top: 0;
    }

    .m-page-container {
        flex: 1;
        padding-bottom: 80px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .u-main-title {
        color: var(--black-100, #1c1c1c);
        font-family: "Microsoft YaHei UI";
        font-size: 24px;
        font-weight: 700;
        line-height: 30px;
        padding: 20px 20px 0;
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

    .m-empty {
        text-align: center;
        padding: 40px;
        color: var(--black-40);
        font-size: 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        i {
            font-size: 24px;
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
                    gap: 10px;
                    height: 24px;
                    justify-content: center;
                    align-items: center;
                    flex: 1 0 0;

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
}
</style>
