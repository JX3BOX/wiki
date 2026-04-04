<template>
    <DefaultLayout
        name="成就百科"
        slug="cj"
        root="/cj"
        :publishEnable="true"
        :feedbackEnable="true"
        :adminEnable="false"
    >
        <template #breadcrumb>
            <AchievementCount />
        </template>
        <template #left>
            <CommonNav>
                <Sidebar :sidebar="$store.state.sidebar" />
            </CommonNav>
        </template>
        <Search :placeholder="placeholder" @search="search($event)">
            <div class="cascader-wrapper">
                <el-cascader
                    v-model="regionId"
                    :props="{ emitPath: false }"
                    :show-all-levels="false"
                    :options="regions"
                    filterable
                    clearable
                    placeholder="地图"
                    size="large"
                ></el-cascader>
            </div>
        </Search>
        <router-view />
        <template #right>
            <Info type="achievement" />
        </template>
        <schema-select ref="schema-select"></schema-select>
    </DefaultLayout>
</template>

<script>
import { getMapList } from "@/service/achievement";
import DefaultLayout from "@/layout/default-layout.vue";
import AchievementCount from "@/components/cj/achievement-count.vue";
import Search from "@/components/common/search.vue";
import Sidebar from "@/components/cj/sidebar.vue";
import Info from "@/components/cj/extend.vue";
import { getAppIcon } from "@jx3box/jx3box-common/js/utils";
import CommonNav from "@/components/common/nav.vue";

import bus from "@/store/bus";
import SchemaSelect from "@/components/cj/schema-select.vue";

export default {
    name: "App",
    data() {
        return {
            placeholder: "输入成就名称/成就描述/称号/奖励物品「回车」进行搜索",
            regions: [],
            regionId: null,
            syncingFromRoute: false,
        };
    },
    components: {
        AchievementCount,
        Sidebar,
        Search,
        Info,
        DefaultLayout,
        CommonNav,
        SchemaSelect,
    },
    computed: {
        isSingle() {
            return this.$route.name == "view";
        },
    },
    watch: {
        regionId(val, oldVal) {
            if (this.syncingFromRoute) return;
            this.onChangeMap(val);
        },
        $route: {
            immediate: true,
            handler() {
                this.syncingFromRoute = true;
                const rawScene = this.$route.query.scene;
                const sceneVal = Array.isArray(rawScene) ? rawScene[rawScene.length - 1] : rawScene;
                this.regionId = sceneVal ? Number(sceneVal) : null;
                this.$nextTick(() => {
                    this.syncingFromRoute = false;
                });

                if (!this.$route.params.sub && !this.$route.params.detail && !this.$route.params.source_id) {
                    this.$store.state.sidebar.sub = null;
                    this.$store.state.sidebar.detail = null;
                } else {
                    if (this.$route.params.sub) this.$store.state.sidebar.sub = this.$route.params.sub;
                    if (this.$route.params.detail) this.$store.state.sidebar.detail = this.$route.params.detail;
                }

                if (this.$store.state.sidebar.general == 3 && this.$route.name) {
                    this.$store.state.sidebar.other = this.$route.name;
                }
            },
        },
    },
    methods: {
        onChangeMap(scene) {
            const currentScene = this.$route.query.scene ? Number([].concat(this.$route.query.scene).pop()) : null;
            if (scene === currentScene) return;
            // 构建干净的 query，先剔除所有 scene（防止数组累积），再按需加回
            const { scene: _drop, ...restQuery } = this.$route.query;
            const query = { ...restQuery };
            if (scene) query.scene = scene;
            delete query.page;
            this.$router.replace({ name: "search", query });
        },
        buildSearchRoute(keyword = this.$route.params.keyword, query = this.$route.query) {
            const normalizedKeyword = (keyword || "").trim().replace(/(?:^\[)|(?:\]$)/gi, "");
            return {
                path: normalizedKeyword ? `/search/${encodeURIComponent(normalizedKeyword)}` : "/search",
                query,
            };
        },
        getAppIcon,
        search(keyword) {
            delete this.$store.state.scroll_tops["search"];
            const target = this.buildSearchRoute(keyword, this.$route.query);
            this.$router.push(target);
        },
        loadMapList() {
            const client = this.$store.state.client;
            const params = {
                client,
                _no_page: 1,
            };
            getMapList(params).then((res) => {
                const data = res.data.data || [];
                this.regions = Object.values(
                    data.reduce((acc, cur) => {
                        if (!cur.RegionName) return acc;
                        if (!acc[cur.RegionName]) {
                            acc[cur.RegionName] = {
                                value: Number(cur.Region),
                                label: cur.RegionName,
                                children: [],
                            };
                        }
                        acc[cur.RegionName].children.push({
                            value: Number(cur.ID),
                            label: cur.MapName,
                        });

                        return acc;
                    }, {})
                );
            });
        },
    },
    mounted() {
        this.loadMapList();
        bus.on("append-to-leap-schema", (param) => {
            console.log(param);
            this.$refs["schema-select"].open(param);
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/cj/index.less";

.m-cj-search {
    align-items: stretch;
    gap: 6px;

    .el-input-group__prepend{
        padding:0;
        .el-input__wrapper{
            background:none;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: none;
            margin-right: -1px;
        }
    }

    .m-return {
        display: flex;
        align-items: stretch;
    }

    .m-search .el-input-group__prepend,
    .m-search .el-input-group__append {
        display: inline-flex;
        align-items: center;
    }
}
</style>
