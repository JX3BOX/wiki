<template>
    <div class="c-var p-mobile-quest">
        <div class="m-page-container" v-infinite-scroll="loadSearchQuests">
            <template v-if="!isSearchMode">
                <div class="m-section">
                    <div class="m-section-title">热门任务</div>
                    <Carousel :items="hotQuests" :showCount="1" :item-gap="20" :container-padding="0">
                        <template #default="{ item: quests }">
                            <div class="m-quest-group">
                                <div
                                    class="m-quest-item"
                                    :class="{ 'is-completed': questIsCompleted(quest.id) }"
                                    v-for="(quest, index) in quests"
                                    :key="index"
                                    @click="onView(quest.id)"
                                >
                                    <div class="u-name">{{ quest.name }}</div>
                                    <div class="u-target">{{ quest.target }}</div>
                                </div>
                            </div>
                        </template>
                    </Carousel>
                </div>
                <div class="m-section">
                    <div class="m-section-title">最新任务</div>
                    <Carousel :items="newestQuests" :show-count="1" :item-gap="20" :container-padding="0">
                        <template #default="{ item: quests }">
                            <div class="m-quest-group">
                                <div
                                    class="m-quest-item"
                                    :class="{ 'is-completed': questIsCompleted(quest.id) }"
                                    v-for="(quest, index) in quests"
                                    :key="index"
                                    @click="onView(quest.id)"
                                >
                                    <div class="u-name">{{ quest.name }}</div>
                                    <div class="u-target">{{ quest.target }}</div>
                                </div>
                            </div>
                        </template>
                    </Carousel>
                </div>
                <div class="m-section">
                    <div class="m-section-title">最近更新</div>
                    <div class="m-quest-group">
                        <div
                            class="m-quest-item"
                            :class="{ 'is-completed': questIsCompleted(post.source_id) }"
                            v-for="(post, index) in recentUpdateQuests"
                            :key="index"
                            @click="onView(post.source_id)"
                        >
                            <div class="u-name">{{ post.title }}</div>
                            <div class="u-target">
                                <i class="el-icon-news"></i>
                                {{ post.remark }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="m-section">
                    <div class="m-section-title">{{ currentRole?.name }} 在 {{ currentMap?.label }} 的任务</div>
                    <div class="m-quest-group">
                        <div
                            class="m-quest-item"
                            v-for="(quest, index) in searchQuests"
                            :key="index"
                            :class="{ 'is-completed': questIsCompleted(quest.id) }"
                            @click="onView(quest.id)"
                        >
                            <div class="u-name">{{ quest.name }}</div>
                            <div class="u-target">{{ quest.target }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

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
                    <div class="u-action" @click="() => (userSelectShow = true)">
                        <img src="@/assets/img/cj/mobile/user.svg" svg-inline />
                    </div>
                    <div class="u-action" @click="() => (mapDrawerShow = true)">
                        <img src="@/assets/img/cj/mobile/map.svg" svg-inline />
                    </div>
                    <div class="u-action" @click="onSearch">
                        <img src="@/assets/img/cj/mobile/search.svg" svg-inline />
                    </div>
                </div>
            </template>
            <template #drawerBox2>
                <div
                    class="m-only-no-complete"
                    :class="{ 'is-active': onlyNotCompleted }"
                    @click="toggleOnlyNotCompleted"
                >
                    <img src="@/assets/img/no-visible.svg" svg-inline />
                    隐藏已完成的成就
                </div>
            </template>
        </suspend-common>

        <user-select-drawer
            custom-class="in-quest"
            :visible.sync="userSelectShow"
            :current-role="currentRole"
            @change="setRole"
        />
        <map-filter-drawer
            :visible.sync="mapDrawerShow"
            :regions="maps"
            :search="mapSearch"
            @change="setMapSearch"
            :auto-select="1"
        />
        <wiki-view-drawer ref="view-drawer"></wiki-view-drawer>
    </div>
</template>

<script>
import { mapState } from "vuex";

import Carousel from "@/components/cj/mobile/carousel.vue";
import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import UserSelectDrawer from "@/components/cj/mobile/user-select-drawer.vue";
import MapFilterDrawer from "@/components/cj/mobile/map-filter-drawer.vue";
import WikiViewDrawer from "@/components/quest/mobile/wiki-view-drawer.vue";

import { getQuestMaps, listUserQuest, getQuests, getNewestQuests } from "@/service/quest";
import { isInMiniprogramWebview } from "@/utils/minprogram";
import { chunk } from "lodash";
import questType from "@/assets/data/quest-type.json";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import LzString from "lz-string";

export default {
    name: "MobileQuestIndex",
    components: { Carousel, SuspendCommon, UserSelectDrawer, MapFilterDrawer, WikiViewDrawer },
    data() {
        return {
            // 最新任务
            newestQuests: [],
            // 热门任务
            hotQuests: [],
            // 最近更新
            recentUpdateQuests: [],

            userSelectShow: false,
            currentRole: this.$store.state.role,

            mapDrawerShow: false,
            maps: [],
            mapSearch: {},
            searchQuests: [],
            loading: false,
            page: 0,
            total: 0,
        };
    },
    computed: {
        ...mapState({
            onlyNotCompleted: (state) => state.onlyNotCompleted,
            completedQuests: (state) => state.completedQuests,
        }),
        client() {
            return this.$store.state.client;
        },
        currentMap() {
            return this.mapSearch?.map || {};
        },
        isSearchMode() {
            return this.currentMap.value;
        },
        hasMore() {
            return this.page == 0 || this.total > this.searchQuests.length;
        },
    },
    methods: {
        toggleOnlyNotCompleted() {
            this.$store.state.onlyNotCompleted = !this.$store.state.onlyNotCompleted;
        },
        questIsCompleted(id) {
            return this.completedQuests.includes(Number(id));
        },
        setMapSearch(val) {
            this.mapDrawerShow = false;
            this.mapSearch = val;

            this.page = 0;
            this.total = 0;
            this.searchQuests = [];
            this.loadSearchQuests();
        },
        onSearch() {
            if (isInMiniprogramWebview()) {
                wx.miniProgram.navigateTo({
                    url: `/pages/search/search-detail/search-detail?app=wiki&filter_category=成就`,
                });
            } else {
                this.$message({
                    message: "非小程序环境，不支持跳转搜索页",
                    type: "warning",
                });
            }
        },
        loadNewestQuests() {
            getNewestQuests({
                page: 1,
                client: this.client,
            }).then((res) => {
                const data = (res.data.list || []).slice(0, 6);
                this.newestQuests = chunk(data, 3);
            });
        },
        async loadHotQuests() {
            const statKey = this.client == "origin" ? "origin_quest" : "quest";
            const statRank = await getStatRank(statKey, "views", 12).then((res) => {
                res = res.data;
                const source_ids = [];
                for (const item of res) {
                    const source_id = item.name.split("-")?.pop();
                    source_ids.push(source_id);
                }
                return source_ids;
            });
            getQuests({
                ids: statRank.join(","),
                client: this.client,
            }).then((res) => {
                const data = (res.data || []).slice(0, 6);
                this.hotQuests = chunk(data, 3);
            });
        },
        loadRecentUpdateQuests() {
            wiki.latest({
                type: "quest",
            })
                .then((res) => {
                    this.recentUpdateQuests = res.data.data?.list ?? [];
                })
                .catch(() => {
                    this.recentUpdateQuests = [];
                });
        },
        loadQuestMaps() {
            getQuestMaps({
                client: this.client,
            }).then((res) => {
                const mapObj = res.data?.data || {};
                const maps = [];
                for (const key in mapObj) {
                    if (!questType[key]) continue;
                    const group = {
                        label: questType[key],
                        value: key,
                        children: mapObj[key].map((item) => ({
                            label: item.name,
                            value: item.id,
                        })),
                    };
                    maps.push(group);
                }
                this.maps = maps;
            });
        },
        setRole(val) {
            this.currentRole = val;
            this.userSelectShow = false;
        },
        loadSearchQuests() {
            if (this.loading) return;
            if (!this.isSearchMode) return;
            if (!this.hasMore) return;
            this.page++;
            const query = {
                map_id: this.currentMap?.value,
                page: this.page,
                client: this.client,
            };
            const payload = {};
            if (this.onlyNotCompleted) {
                payload.filter = LzString.compressToEncodedURIComponent(this.completedQuests.join(","));
            }
            this.loading = true;
            getQuests(query, payload)
                .then((res) => {
                    this.searchQuests.push(...(res.data?.list?.byKeyword || []));
                    this.total = res.data?.total || 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onView(id) {
            this.$refs["view-drawer"].open(id);
        },
    },
    watch: {
        currentRole: {
            deep: true,
            handler(val) {
                if (!val) return;
                this.$store.commit("SET_ROLE", val);
                listUserQuest(this.currentRole.ID).then((res) => {
                    const data = res.data?.data || [];
                    this.$store.commit("SET_COMPLETED_QUESTS", data);
                    localStorage.setItem("quests_last_sync", this.currentRole.jx3id);
                });
            },
        },
    },
    mounted() {
        this.loadNewestQuests();
        this.loadHotQuests();
        this.loadRecentUpdateQuests();
        this.loadQuestMaps();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.m-only-no-complete {
    box-sizing: border-box;
    padding: 8px;

    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    box-shadow: none;
    .r(12px);

    color: rgba(255, 255, 255, 0.8);
    height: 80px;

    /* 16 Bold */
    font-size: 16px;
    font-weight: 700;
    line-height: 24px; /* 150% */

    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;

    img {
        .size(40px);
    }

    &.is-active {
        color: #fedaa3;
    }
}

.user-select-drawer.in-quest {
    .u-reset {
        color: #ffffff66 !important;
    }
    .m-user-item {
        color: #ffffffcc;

        .u-area {
            &::before {
                content: "<";
            }
            &::after {
                content: ">";
            }
        }
    }
}

.p-mobile-quest {
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
    }

    .m-section {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .carousel-indicators {
            margin-top: 20px;
        }

        .carousel-dot {
            background: var(--black-10, rgba(28, 28, 28, 0.1));

            &.active {
                background: var(--black-20, rgba(28, 28, 28, 0.2));
            }
        }
    }

    .m-section-title {
        color: var(--black-80, rgba(28, 28, 28, 0.8));
        font-weight: 700;
        .fz(16px, 24px);
    }

    .m-quest-group {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .m-quest-item {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;

        .r(12px);
        background: var(--primary-brand-4, #282828);

        .u-name {
            color: var(--black-80, rgba(255, 255, 255, 0.8));
            .fz(16px, 24px);
            font-weight: 700;
        }

        .u-target {
            color: var(--black-80, rgba(255, 255, 255, 0.8));
            .fz(14px, 20px);
            font-weight: 400;
        }

        &.is-completed {
            .pr;
            &:before {
                content: "";
                position: absolute;
                right: -104px;
                top: -130px;
                background: #fedaa3;
                width: 226px;
                height: 190px;
                transform: rotate(30deg);
                z-index: 2;
            }

            &:after {
                content: "完成";
                .pa;
                top: 16px;
                right: 16px;

                color: var(--secondary-orange, #ff9500);
                font-size: 12px;
                font-style: normal;
                font-weight: 700;
                line-height: 18px;
                z-index: 3;
            }
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
