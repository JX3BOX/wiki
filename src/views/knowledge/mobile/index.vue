<template>
    <div class="p-knowledge-mobile-index c-var">
        <div
            class="m-page-container"
            ref="pageContainer"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="disabled"
            infinite-scroll-distance="10"
        >
            <!-- Big Search Header -->
            <div class="m-big-search" v-if="!searchKey && !type" @click="openDrawer">
                <img class="u-search-icon" src="@/assets/img/cj/mobile/search.svg" svg-inline />
                <div class="u-info">
                    <span class="u-title">通识百科</span>
                    <span class="u-tip">点击开始搜索内容</span>
                </div>
            </div>

            <!-- Result Title (Search/Category Mode) -->
            <div class="m-section-header" v-if="searchKey || type">
                <span class="u-title">{{ typeName || "搜索结果" }}</span>
                <span class="u-back" @click="goHome" v-if="type || searchKey">返回首页</span>
            </div>

            <!-- Home Dashboard (No Search/Type) -->
            <template v-if="!searchKey && !type">
                <div class="m-home-sections">
                    <div class="m-section" v-for="(section, i) in homeSections" :key="`${section.key}${i}`">
                        <div class="m-section-header">
                            <span class="u-title">{{ section.label }}</span>
                            <span class="u-more" @click="enterCategory(section.key)"> 更多 </span>
                        </div>

                        <!-- Multi-Block Section (Mixed Layout) -->
                        <template v-if="section.blocks">
                            <div
                                class="m-section-body"
                                v-for="(block, bIndex) in section.blocks"
                                :key="bIndex"
                                :class="block.layout || 'list'"
                            >
                                <div
                                    class="m-knowledge-card"
                                    v-for="(item, k) in block.list"
                                    :key="k"
                                    @click="handleItemClick(item)"
                                >
                                    <div class="m-knowledge-title" v-html="item.name"></div>
                                    <i class="el-icon-arrow-right"></i>
                                </div>
                            </div>
                        </template>

                        <!-- Standard Section -->
                        <div class="m-section-body" v-else :class="section.layout || 'list'">
                            <div
                                class="m-knowledge-card"
                                v-for="(item, i) in section.list"
                                :key="i"
                                @click="handleItemClick(item)"
                            >
                                <div class="m-knowledge-title" v-html="item.name"></div>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- List/Search Content Area -->
            <div class="m-content-body" v-else>
                <div class="m-list list">
                    <div class="m-knowledge-card" v-for="(item, i) in list" :key="i" @click="handleItemClick(item)">
                        <div class="m-knowledge-title">
                            {{ item.name }}
                        </div>
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>

                <div class="m-status">
                    <div class="u-loading" v-if="loading"><i class="el-icon-loading"></i> 加载中...</div>
                    <div class="u-no-more" v-if="finished && list.length">End</div>
                    <div class="u-empty" v-if="finished && !list.length">暂无相关数据</div>
                </div>
            </div>
        </div>

        <knowledge-search-drawer ref="drawer" :menus="menus" />

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
            @search="openDrawer"
            ref="suspendCommon"
        >
            <template #default>
                <div class="m-more-action">
                    <div class="u-action" @click="openDrawer">
                        <img src="@/assets/img/cj/mobile/search.svg" svg-inline />
                        {{ displaySearchDesc || "搜索内容" }}
                    </div>
                </div>
            </template>
        </suspend-common>
    </div>
</template>

<script>
import KnowledgeSearchDrawer from "@/components/knowledge/mobile/knowledge-search-drawer.vue";
import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import { getKnowledgeList, getKnowledgeMenus, getMenuGroups } from "@/service/knowledge.js";

export default {
    name: "MobileKnowledgeIndex",
    components: {
        KnowledgeSearchDrawer,
        SuspendCommon,
    },
    data() {
        return {
            loading: false,
            list: [],
            page: 1,
            total: 0,
            per: 20,

            searchKey: "",
            type: null, // knowledge type key

            menus: [],

            // Defines which sections to show on home and their layout
            // 'wanfa' (Gameplay) -> Grid
            // 'player' (Player Info) -> Grid
            // Others -> List
            homeSections: [],
        };
    },
    computed: {
        finished() {
            // If page is 1, we haven't finished loading the first batch yet
            if (this.page <= 1) return false;
            // Otherwise, check if we've loaded all items
            return this.list.length >= this.total;
        },
        disabled() {
            return !this.type && !this.searchKey ? true : this.loading || this.finished;
            // Disable infinite scroll on home page, enable on list page
        },
        typeName() {
            if (!this.type) return "";
            return this.menus.find((item) => item.name == this.type)?.label || this.type;
        },
        displaySearchDesc() {
            let r = "";
            if (this.type) r += this.typeName;
            if (this.searchKey) {
                if (r) r += ",";
                r += this.searchKey;
            }
            return r;
        },
    },
    methods: {
        loadMore() {
            // Only load more if we are in a list context (search or type selected)
            if (!this.type && !this.searchKey) return;
            if (this.loading || this.finished) return;

            this.loading = true;
            const params = {
                page: this.page,
                per: this.per,
            };
            if (this.searchKey) params._search = this.searchKey;
            if (this.type) params.type = this.type;

            getKnowledgeList(params)
                .then((res) => {
                    const data = res.data.data;
                    if (this.page === 1) {
                        this.list = data.list || [];
                        this.total = data.total;
                    } else {
                        this.list = [...this.list, ...(data.list || [])];
                    }
                    this.page++;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        openDrawer() {
            this.$refs.drawer
                .open({
                    searchKey: this.searchKey,
                    type: this.type,
                })
                .then((res) => {
                    if (res) {
                        // Ensure res exists
                        this.searchKey = res.searchKey;
                        this.type = res.type;
                        this.reset();
                    }
                })
                .catch((e) => {});
        },
        reset() {
            this.page = 1;
            this.list = [];
            this.total = 0;
            this.loadMore();
            window.scrollTo(0, 0);
        },
        goHome() {
            this.type = null;
            this.searchKey = "";
            this.list = [];
        },
        enterCategory(key) {
            this.type = key;
            this.reset();
        },
        loadMenus() {
            getKnowledgeMenus().then((res) => {
                this.menus = res.data.data || [];
                this.initHomeSections();
            });
        },
        async initHomeSections() {
            const sections = [];

            const gameMenu = this.menus.find((m) => m.name === "game");
            if (gameMenu) {
                const guideKeys = ["guide-pve", "guide-pvp", "guide-pvx"];
                try {
                    const res = await getMenuGroups({ key: guideKeys.join(",") });
                    let mergedList = [];

                    guideKeys.forEach((key) => {
                        const group = res.find((item) => item.name === key);
                        if (group && group.menus) {
                            // Take top 2
                            mergedList.push(
                                ...group.menus.slice(0, 2).map((m) => ({
                                    name: m.label,
                                    link: m.link,
                                }))
                            );
                        }
                    });

                    sections.push({
                        key: "game",
                        label: "玩法",
                        layout: "grid",
                        list: mergedList,
                    });
                } catch (e) {
                    console.error("Failed to load guide groups", e);
                }
            }

            const handledKeys = ["game", "player", "organization"];
            const others = this.menus.filter((m) => !handledKeys.includes(m.name));

            for (const menu of others) {
                const section = {
                    key: menu.name,
                    label: menu.label,
                    layout: "list", // Default to list for others
                    list: [],
                };

                getKnowledgeList({
                    type: section.key,
                    per: 5,
                    page: 1,
                }).then((res) => {
                    section.list = res.data.data.list || [];
                });
                sections.push(section);
            }

            const playerMenu = this.menus.find((m) => m.name === "player");
            if (playerMenu) {
                const playerRes = await getKnowledgeList({ type: "player", per: 4, page: 1 }).catch(() => ({
                    data: { data: { list: [] } },
                }));
                const orgRes = await getKnowledgeList({ type: "organization", per: 2, page: 1 }).catch(() => ({
                    data: { data: { list: [] } },
                }));

                const playerList = playerRes.data?.data?.list || [];
                const orgList = orgRes.data?.data?.list || [];

                if (playerList.length || orgList.length) {
                    sections.push({
                        key: "player", // More link goes to Player category
                        label: "玩家&组织",
                        blocks: [
                            { layout: "grid", list: playerList }, // Player: Grid, 4 items
                            { layout: "list", list: orgList }, // Org: List, 2 items
                        ],
                    });
                }
            }

            this.homeSections = sections;
        },
        handleItemClick(item) {
            if (item.link) {
                window.location.href = item.link;
            } else if (item.id) {
                this.$router.push({ name: "view", params: { source_id: item.id } });
            }
        },
        toDetail(id) {
            this.$router.push({ name: "view", params: { source_id: id } });
        },
    },
    created() {
        this.loadMenus();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.p-knowledge-mobile-index {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fafafa;
    @media (prefers-color-scheme: dark) {
        background: #1c1c1c;
    }

    font-family: 微软雅黑;

    .m-page-container {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        padding-bottom: 80px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .m-knowledge-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        cursor: pointer;
        border-radius: 8px;
        background: var(--primary-brand-4, #fff);

        color: var(--black-100, #fff);

        /* 14 Regular */
        font-size: 14px;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
    }

    .m-big-search {
        display: flex;
        padding: 12px 20px;
        justify-content: center;
        align-items: center;
        gap: 12px;
        border-radius: 8px;
        background: var(--black-5, rgba(28, 28, 28, 0.05));
        color: var(--primary-brand-2, #fedaa3);

        .u-search-icon {
            .size(120px);
        }

        .u-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .u-title {
            font-size: 24px;
            font-weight: 700;
        }

        .u-tip {
            font-size: 14px;
            color: var(--black-60);
        }
    }
    .m-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .m-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .u-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--black-100);
            position: relative;
        }

        .u-more,
        .u-back {
            color: var(--black-40, rgba(255, 255, 255, 0.4));

            /* 16 Bold */
            font-family: "Microsoft YaHei UI";
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */
        }
    }

    .m-home-sections {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-bottom: 20px;

        .m-section-body {
            gap: 8px;
            &.grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            &.list {
                display: flex;
                flex-direction: column;
            }
        }
    }

    .m-content-body {
        width: 100%;
        .m-list.list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
    }

    .m-status {
        padding: 20px;
        text-align: center;
        color: var(--black-40);
        font-size: 12px;
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
