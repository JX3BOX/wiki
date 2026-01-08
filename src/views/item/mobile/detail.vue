<template>
    <div class="c-var p-mobile-item-detail">
        <div class="m-page-container">
            <div class="m-item-info" v-if="source">
                <div class="m-head">
                    <div class="m-icon-section">
                        <div class="u-quality" :class="`quality-${source.Quality}`"></div>
                        <img class="u-icon" :src="iconLink" alt="" />
                    </div>
                    <div class="m-content-section">
                        {{ source.Name }}
                    </div>
                </div>
                <div class="m-meta">
                    <div class="u-meta-item">{{ item_bind(source.BindType) }}</div>
                    <div class="u-meta-item" v-if="source.MaxExistAmount">
                        <span class="u-meta-label">最大拥有数</span>
                        <span>{{ source.MaxExistAmount }}</span>
                    </div>
                    <div class="u-meta-item" v-if="source.Price">
                        <span class="u-meta-label">回收价格</span>
                        <GamePrice class="u-value" :price="source.Price" />
                    </div>
                    <div class="u-meta-item u-misc">
                        <div class="u-meta-misc">
                            <i class="el-icon-check" v-if="[1, 2].includes(source.BindType)"></i>
                            <i class="el-icon-close" v-else></i>
                            {{ [1, 2].includes(source.BindType) ? "可以" : "不可" }}交易
                        </div>
                        <div class="u-meta-misc">
                            <i class="el-icon-check" v-if="source.CanStack"></i>
                            <i class="el-icon-close" v-else></i>
                            {{ source.CanStack ? "可以" : "不可" }}堆叠
                        </div>
                        <div class="u-meta-misc">
                            <i class="el-icon-check" v-if="source.CanChangeMagic"></i>
                            <i class="el-icon-close" v-else></i>
                            {{ source.CanChangeMagic ? "可以" : "不可" }}附魔
                        </div>
                        <div class="u-meta-misc">
                            <i class="el-icon-check" v-if="source.CanExterior"></i>
                            <i class="el-icon-close" v-else></i>
                            {{ source.CanExterior ? "可以" : "不可" }}收集
                        </div>
                        <div class="u-meta-misc">
                            <i class="el-icon-check" v-if="source.CanSetColor"></i>
                            <i class="el-icon-close" v-else></i>
                            {{ source.CanSetColor ? "可以" : "不可" }}染色
                        </div>
                        <div class="u-meta-misc">
                            <i class="el-icon-check" v-if="source.CanApart"></i>
                            <i class="el-icon-close" v-else></i>
                            {{ source.CanApart ? "可以" : "不可" }}分解
                        </div>
                        <div class="u-meta-misc">
                            <i class="el-icon-check" v-if="source.CanDestroy || source.CanDestroy === null"></i>
                            <i class="el-icon-close" v-else></i>
                            {{ source.CanDestroy || source.CanDestroy === null ? "可以" : "不可" }}摧毁
                        </div>
                    </div>
                </div>
            </div>
            <Item v-if="showInfo" :item="source" :item_id="id" :client="client"></Item>
            <div class="u-show-info" @click="showInfo = !showInfo">
                <span>{{ showInfo ? "收起" : "查看" }}物品信息</span>
                <i class="el-icon-arrow-down" v-if="!showInfo"></i>
                <i class="el-icon-arrow-up" v-else></i>
            </div>

            <fold-card class="m-price" :fixed="true" v-loading="priceLoading">
                <template #title>
                    <div class="m-price-head">
                        <span>区服价格</span>
                        <span class="u-server-select" @click="onServerSelect">
                            {{ server }} <i class="el-icon-refresh"></i>
                        </span>
                    </div>
                </template>
                <template v-if="priceLoading || priceList.length">
                    <span class="m-price-30day">近30日</span>
                    <span class="m-price-list">
                        <span class="m-price-item">
                            <span>均价</span>
                            <GamePrice class="u-value" v-if="priceCounter.avg" :price="priceCounter.avg" />
                            <span v-else>-</span>
                        </span>
                        <span class="m-price-item">
                            <span>最高</span>
                            <GamePrice class="u-value" v-if="priceCounter.max" :price="priceCounter.max" />
                            <span v-else>-</span>
                        </span>
                        <span class="m-price-item">
                            <span>最低</span>
                            <GamePrice class="u-value" v-if="priceCounter.min" :price="priceCounter.min" />
                            <span v-else>-</span>
                        </span>
                    </span>
                    <PriceChart :priceList="priceList"></PriceChart>
                    <span class="u-swipe-tip">左右滑动以查看</span>
                    <span class="u-today-price">
                        <GamePrice class="u-price" :price="priceCounter.today"></GamePrice>
                        <span class="u-date">{{ dayjs().format("YYYY年MM月DD日") }}</span>
                    </span>
                </template>
                <div class="m-price-empty" v-else>暂无数据或该物品无法上架交易行</div>
            </fold-card>
            <fold-card title="物品攻略" v-if="post_id">
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

            <!-- 评论区 -->
            <div class="m-comments">
                <miniprogram-comment-list :source-id="id" type="item" />
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
                    <span type="text" class="u-action" @click="onAddItemPlan">加入清单</span>
                    <span type="text" v-loading="favLoading" class="u-action with-lb" @click="toggleFav">
                        {{ isFav ? "取消收藏" : "收藏物品" }}
                    </span>
                </div>
            </template>
        </suspend-common>
        <server-select-drawer ref="server-select-drawer"></server-select-drawer>
        <add-item-plan-drawer ref="add-item-plan-drawer"></add-item-plan-drawer>
    </div>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from "vuex";
import { item_bind } from "@/filters";
import { isInMiniprogramWebview } from "@/utils/minprogram";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { postHistory, postStat } from "@jx3box/jx3box-common/js/stat";
import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import MiniprogramCommentList from "@/components/cj/mobile/comment-list.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import { get_item } from "@/service/item";
import { publishLink, showAvatar, showSchoolIcon, ts2str } from "@jx3box/jx3box-common/js/utils";
import FoldCard from "@/components/quest/mobile/fold-card.vue";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import Item from "@jx3box/jx3box-editor/src/Item.vue";
import ServerSelectDrawer from "@/components/item/mobile/server-select-drawer.vue";
import User from "@jx3box/jx3box-common/js/user";
import { get_item_prices } from "@/service/item";
import { meanBy, maxBy, minBy } from "lodash";
import PriceChart from "@/components/item/mobile/price-chart.vue";
import { getMyFav, delMyFav } from "@/service/item.js";
import { addFav } from "@jx3box/jx3box-common-ui/service/fav";
import AddItemPlanDrawer from '@/components/item/mobile/add-item-plan-drawer.vue';

export default {
    name: "MobileItemDetail",
    components: {
        SuspendCommon,
        MiniprogramCommentList,
        Article,
        FoldCard,
        GamePrice,
        Item,
        ServerSelectDrawer,
        PriceChart,
        AddItemPlanDrawer
    },
    data() {
        return {
            loading: true,
            source: "",
            wiki_post: "",
            server: "梦江南",

            showInfo: false,

            userSelectShow: false,

            priceLoading: false,
            priceList: [],
            favItemList: [],
            favLoading: false,
        };
    },
    computed: {
        iconLink() {
            return iconLink(this.source?.IconID, this.client);
        },
        ...mapState({
            client: (state) => state.client,
        }),

        id() {
            return this.$route.params.item_id;
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
            return this.source?.Name;
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
                postType: "item",
                id: this.post_id,
                title: this.sourceName || document.title || "", //默认固定标题,默认取页面标题
                url: window.location.href, //默认取浏览器地址
                laterOn: {
                    author_id: this.author_id || 0, //作者id
                    content_meta_id: this.post_id,
                },
            };
        },
        priceCounter() {
            return {
                avg: meanBy(this.priceList, "price"),
                max: maxBy(this.priceList, "price")?.price || 0,
                min: minBy(this.priceList, "price")?.price || 0,
                today: this.priceList.at(-1)?.price || 0,
            };
        },
        isFav() {
            return this.favItemList.some((item) => item.post_id === this.id);
        },
    },
    methods: {
        toggleFav() {
            if (this.favLoading || !this.id) return;
            this.favLoading = true;
            if (this.isFav) {
                const favItem = this.favItemList.find((item) => item.post_id === this.id);
                delMyFav(favItem.id)
                    .then(() => {
                        this.favItemList = this.favItemList.filter((item) => item.post_id !== this.id);
                    })
                    .finally(() => {
                        this.favLoading = false;
                    });
            } else {
                addFav("item", this.id, this.sourceName)
                    .then((res) => {
                        this.favItemList = [
                            ...this.favItemList,
                            {
                                id: res.id,
                                post_id: this.id,
                                post_type: "item",
                            },
                        ];
                    })
                    .finally(() => {
                        this.favLoading = false;
                    });
            }
        },
        loadFavItems() {
            getMyFav({ post_type: "item", pageSize: 15 }).then((res) => {
                const list = res.data.data.list;
                if (!list?.length) {
                    return;
                }
                this.favItemList = [...list];
            });
        },
        dayjs,
        onServerSelect() {
            this.$refs["server-select-drawer"]
                .open(this.server)
                .then((res) => {
                    this.server = res;
                })
                .catch(() => {});
        },
        item_bind,
        showAvatar,
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
        onSearch() {
            if (isInMiniprogramWebview()) {
                wx.miniProgram.navigateTo({
                    url: `/pages/search/search-detail/search-detail?app=wiki&filter_category=物品`,
                });
            } else {
                this.$message({
                    message: "非小程序环境，不支持跳转搜索页",
                    type: "warning",
                });
            }
        },

        async loadInitData() {
            if (!this.id) return;
            this.loading = true;
            await get_item(this.id, this.client).then((res) => {
                this.source = res.data.data.item;
            });
            await wiki
                .mix({
                    type: "item",
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
                            source_type: this.client == "origin" ? "origin_item" : "item",
                            source_id: ~~this.id,
                            link: location.href,
                            title: post.title,
                        });
                })
                .finally(() => {
                    this.loading = false;
                });
            this.loadPriceData();
            this.triggerStat();
        },
        triggerStat: function () {
            postStat(this.client == "origin" ? "origin_item" : "item", this.id);
        },
        initServer() {
            if (this.$store.state.client == "origin") {
                this.server = "缘起稻香";
            } else {
                if (!this.server) {
                    this.server = "梦江南";
                }
            }
            if (sessionStorage.getItem("server_name")) {
                this.server = sessionStorage.getItem("server_name");
                sessionStorage.removeItem("server_name");
            }
        },
        loadPriceData() {
            if (!this.id) return;
            this.priceLoading = true;
            get_item_prices({
                item_id: this.id,
                server: this.server,
                aggregate_type: "daily",
            })
                .then((res) => {
                    this.priceList = res.data;
                })
                .finally(() => {
                    this.priceLoading = false;
                });
        },
        onAddItemPlan() {
            this.$refs["add-item-plan-drawer"].open(this.id);
        },
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                if (!val) return;
                this.loadInitData();
            },
        },
        server: {
            handler(val) {
                if (!val) return;
                this.loadPriceData();
            },
        },
    },
    mounted() {
        this.loadFavItems();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.p-mobile-item-detail {
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

    .m-page-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 0;
        gap: 20px;
        padding: 20px 0;
        margin-bottom: 76px;

        overflow-y: auto;

        .u-show-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;

            color: var(--black-80, rgba(28, 28, 28, 0.8));

            /* 14 Regular */
            font-family: "Microsoft YaHei UI";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
        }

        .c-item {
            margin: 0 20px;
        }
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

    .m-item-info {
        margin: 0 20px;
        padding: 8px 12px;

        overflow: hidden;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        gap: 12px;
        border-radius: 8px;
        background: var(--primary-brand-4, #fff);
    }

    .m-item-info .m-meta {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--black-80, rgba(28, 28, 28, 0.8));

        font-size: 14px;
        font-weight: 400;
        line-height: 20px; /* 142.857% */

        .u-meta-item {
            display: flex;
            align-items: center;

            .u-meta-label {
                width: 84px;
            }

            &.u-misc {
                justify-content: space-between;
                gap: 8px;
                margin-top: 4px;
                flex-wrap: 1;
                flex-wrap: wrap;
            }

            .u-meta-misc {
                display: flex;
                align-items: center;
                min-width: 80px;
                gap: 8px;
            }
        }
    }

    .m-item-info .m-head {
        overflow: hidden;
        display: flex;
        gap: 8px;

        .m-icon-section {
            display: flex;
            height: 44px;
            gap: 4px;
            flex-shrink: 0;

            .u-quality {
                width: 4px;
                height: 44px;
                border-radius: 100px;

                &.quality-1 {
                    background-color: var(--secondary-mint);
                }
                &.quality-2 {
                    background-color: var(--secondary-green);
                }
                &.quality-3 {
                    background-color: var(--secondary-cyan);
                }
                &.quality-4 {
                    background-color: var(--secondary-purple);
                }
                &.quality-5 {
                    background-color: var(--secondary-orange);
                }
                &.quality-6 {
                    background-color: var(--secondary-red);
                }
            }

            .u-icon {
                width: 44px;
                height: 44px;
                border-radius: 4px;
                background: #d9d9d9;
            }
        }

        .m-content-section {
            display: flex;
            align-items: center;
            height: 100%;

            color: var(--black-100, #1c1c1c);

            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
        }
    }

    .m-price {
        display: flex;
        flex-direction: column;

        &.w-fold-card {
            gap: 8px;
        }

        .w-fold-card-content {
            gap: 4px;
        }

        .u-swipe-tip {
            color: var(--black-40, rgba(28, 28, 28, 0.4));
            text-align: center;

            /* 12 Regular */
            font-family: "Microsoft YaHei UI";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
        }

        .u-today-price {
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 4px;
            align-items: center;
        }

        .u-price {
            color: var(--black-80, rgba(28, 28, 28, 0.8));

            /* 16 Bold */
            font-family: "Microsoft YaHei UI";
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */
        }

        .u-date {
            color: var(--black-80, rgba(28, 28, 28, 0.8));

            /* 12 Regular */
            font-family: "Microsoft YaHei UI";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
        }
    }

    .m-price-empty {
        display: flex;
        height: 100px;
        justify-content: center;
        align-items: center;

        color: var(--primary-brand-2, #24292e);
        text-align: center;

        /* 14 Regular */
        font-family: "Microsoft YaHei UI";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
    }

    .m-price-30day {
        color: var(--black-80, rgba(255, 255, 255, 0.8));

        /* 12 Regular */
        font-family: "Microsoft YaHei UI";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px; /* 150% */
    }

    .m-price-list {
        color: var(--black-80, rgba(255, 255, 255, 0.8));

        /* 14 Regular */
        font-family: "Microsoft YaHei UI";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */

        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .m-price-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--primary-brand-2);

        .u-server-select {
            color: var(--black-40, rgba(28, 28, 28, 0.4));

            /* 14 Regular */
            font-family: "Microsoft YaHei UI";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */
        }
    }

    .m-price-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
            box-sizing: border-box;

            .u-action {
                display: flex;
                height: 24px;
                justify-content: center;
                align-items: center;
                flex: 1 0 0;

                &.with-lb {
                    border-left: 0.5px solid rgba(254, 218, 163, 0.2);
                }
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
