<template>
    <div class="c-var p-mobile-item">
        <div
            class="m-page-container"
            :class="{ 'is-center': !favItemList.length && !isSearchMode }"
            ref="pageContainer"
            v-infinite-scroll="loadMore"
        >
            <div class="m-big-search" v-if="!favItemList.length && !isSearchMode">
                <img class="u-search-icon" src="@/assets/img/cj/mobile/search.svg" svg-inline />
                <div class="u-info">
                    <span class="u-title">物品百科</span>
                    <span class="u-tip">点击开始搜索内容</span>
                </div>
            </div>
            <router-link to="/item/plan" class="m-to-plan">
                <span>查看物品清单</span>
                <i class="el-icon-arrow-right"></i>
            </router-link>
            <div class="m-section m-fav-section" v-if="!isSearchMode && favItemList.length">
                <div class="m-section-title">
                    <span>我收藏的物品</span>
                    <span class="u-btn" @click="favEditMode = !favEditMode">编辑</span>
                </div>
                <div class="m-item-list">
                    <item-card
                        v-for="item in favItemList"
                        :key="item.post_id"
                        :item-id="item.post_id"
                        :show-delete="favEditMode"
                        @click="toView(item.post_id)"
                        @delete="onRemoveFavItem(item)"
                    />
                </div>
            </div>
            <div class="m-section m-fav-section" v-if="isSearchMode">
                <div class="m-section-title">
                    <span>搜索结果</span>
                </div>
                <div class="m-item-list">
                    <item-card
                        v-for="item in searchList"
                        :key="item.id"
                        :item-id="item.id"
                        :data="item"
                        @click="toView(item.id)"
                    />
                </div>
            </div>
        </div>

        <el-button class="m-to-top" @click="scrollToTop">
            <img svg-inline src="@/assets/img/totop.svg" alt="" />
        </el-button>
        <search-drawer ref="search-drawer" :menus="menus"></search-drawer>
        <suspend-common
            class="u-suspend-common"
            :btn-options="{
                showHome: true,
                showIcon: false,
                showMore: true,
            }"
            :drawer-options="{
                hideType: ['collect', 'rss', 'laterOn', 'user', 'report', 'pin'],
                direction: 'btt',
            }"
            style="width: 100%"
            @search="onSearch"
            ref="suspendCommon"
        >
            <template #default>
                <div class="m-more-action">
                    <div class="u-action" @click="onSearch">
                        <img src="@/assets/img/cj/mobile/search.svg" svg-inline />
                        {{ showSearchDesc || "搜索内容" }}
                    </div>
                </div>
            </template>
        </suspend-common>
    </div>
</template>

<script>
import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import ItemCard from "@/components/item/mobile/item-card.vue";
import { getMyFav, delMyFav } from "@/service/item.js";
import SearchDrawer from "@/components/item/mobile/search-drawer.vue";
import { getMenus, get_items_search } from "@/service/item";

export default {
    name: "MobileItemIndex",
    components: { SuspendCommon, ItemCard, SearchDrawer },
    data() {
        return {
            favItemList: [],
            favLoading: false,
            favPageIndex: 1,
            favPageSize: 10,
            favTotal: 0,
            favEditMode: false,

            menus: [],
            search: {
                searchKey: "",
                aucGenre: null,
                subAucGenre: null,
            },
            searchLoading: false,
            searchPage: 1,
            searchTotal: 0,
            searchList: [],
        };
    },
    computed: {
        isSearchMode() {
            return Boolean(this.showSearchDesc?.length);
        },
        favHasMore() {
            if (!this.favItemList.length) return;
            return this.favItemList.length < this.favTotal;
        },
        searchHasMore() {
            if (!this.searchList.length) return;
            return this.searchList.length < this.searchTotal;
        },
        currentMenu() {
            return this.menus.find((item) => item.AucGenre == this.search.aucGenre);
        },
        currentSubMenu() {
            return this.currentMenu?.children.find((item) => item.AucSubType == this.search.subAucGenre);
        },
        showSearchDesc() {
            let str = "";
            if (this.currentMenu) str += this.currentMenu.label;
            if (this.currentSubMenu) str += `-${this.currentSubMenu.label}`;
            if (this.search.keyword) {
                if (str) str += ", ";
                str += `${this.search.keyword}`;
            }
            return str;
        },
    },
    methods: {
        toView(id) {
            this.$router.push({ name: "view", params: { item_id: id } });
        },
        onSearch() {
            this.$refs["search-drawer"]
                .open(this.search)
                .then((res) => {
                    this.search = res;
                    this.searchList = [];
                    this.searchPage = 1;
                    this.searchLoading = false;
                    this.loadSearch();
                })
                .catch(() => {});
        },
        scrollToTop() {
            this.$refs["pageContainer"].scrollTo({ top: 0, behavior: "smooth" });
        },
        loadFavItems() {
            this.favLoading = true;
            getMyFav({ post_type: "item", pageSize: this.favPageSize, pageIndex: this.favPageIndex++ })
                .then((res) => {
                    const list = res.data.data.list;
                    this.favTotal = res.data.data.page.total;
                    if (!list?.length) {
                        this.favTotal = this.favItemList.length;
                        return;
                    }
                    this.favItemList = [...this.favItemList, ...list];
                })
                .finally(() => {
                    this.favLoading = false;
                });
        },
        onRemoveFavItem(item) {
            delMyFav(item.id).then(() => {
                this.favTotal--;
                this.favItemList = this.favItemList.filter((x) => x.id !== item.id);
            });
        },
        loadSearch() {
            const params = {};
            if (this.search.searchKey) params.keyword = this.search.searchKey;
            if (this.search.aucGenre) params.auc_genre = this.search.aucGenre;
            if (this.search.subAucGenre) params.auc_sub_type_id = this.search.subAucGenre;
            this.searchLoading = true;
            get_items_search({
                ...params,
                page: this.searchPage++,
                limit: 10,
                client: this.client,
            })
                .then((res) => {
                    const resp = res.data.data;
                    this.searchTotal = resp.total;

                    this.searchList = [...this.searchList, ...resp.data];
                })
                .finally(() => {
                    this.searchLoading = false;
                });
        },
        loadMore() {
            if (!this.isSearchMode && this.favHasMore) {
                return this.loadFavItems();
            } else if (
                this.isSearchMode &&
                this.searchHasMore &&
                Object.keys(this.search).some((x) => Boolean(this.search[x]))
            ) {
                return this.loadSearch();
            }
        },
        loadMenus() {
            getMenus().then((res) => {
                const menu = res.data.data.menus || [];
                this.menus = menu;
            });
        },
    },
    mounted() {
        this.loadFavItems();
        this.loadMenus();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.p-mobile-item {
    background: #f1f1f1;
    @media (prefers-color-scheme: dark) {
        background: #000;
    }

    font-family: "Microsoft YaHei UI";
    font-style: normal;

    display: flex;
    flex-direction: column;
    .size(100vw, 100vh);

    .m-page-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 0;
        gap: 20px;
        padding: 20px;
        margin-bottom: 76px;

        overflow-y: auto;

        &.is-center {
            justify-content: center;
        }
    }

    .m-to-top {
        position: fixed;
        .size(40px);
        background-color: var(--primary-brand-2, #fedaa3);
        color: var(--primary-brand-3, #24292e);
        bottom: 90px;
        right: 20px;
        .r(100%);
        .flex;
        align-items: center;
        justify-content: center;
    }

    .m-to-plan {
        display: flex;
        padding: 17px 20px;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        background: var(--primary-brand-2, #fedaa3);
        color: var(--primary-brand-3, #24292e);

        /* 16 Bold */
        font-family: "Microsoft YaHei UI";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }

    .m-section {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .m-section-title {
            color: var(--black-100, #1c1c1c);

            /* 16 Bold */
            font-family: "Microsoft YaHei UI";
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */

            display: flex;
            justify-content: space-between;
            align-items: center;

            .u-btn {
                color: var(--black-40, rgba(28, 28, 28, 0.4));
            }
        }
    }

    .m-big-search {
        display: flex;
        padding: 12px 20px;
        justify-content: center;
        align-items: center;
        gap: 12px;
        border-radius: 8px;
        background: var(--black-5, rgba(255, 255, 255, 0.1));
        color: var(--primary-brand-2, #24292e);

        .u-search-icon {
            width: 120px;
            height: 120px;
            flex-shrink: 0;
            aspect-ratio: 1/1;
        }

        .u-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .u-title {
            font-size: 24px;
            font-weight: 700;
            line-height: 30px; /* 125% */
        }

        .u-tip {
            font-size: 16px;
            font-weight: 700;
            line-height: 24px; /* 150% */
        }
    }

    .m-item-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
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
