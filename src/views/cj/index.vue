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
            <el-cascader
                v-model="regionId"
                @change="onChangeMap"
                :props="{ emitPath: false }"
                :show-all-levels="false"
                :options="regions"
                filterable
                clearable
                placeholder="地图"
            ></el-cascader>
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
            regionId: null,

            regions: [],
        };
    },
    components: {
        AchievementCount,
        Sidebar,
        Search,
        Info,
        DefaultLayout,
        CommonNav,
        SchemaSelect
    },
    computed: {
        isSingle() {
            return this.$route.name == "view";
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                if (this.$route.query.scene) {
                    this.regionId = Number(this.$route.query.scene);
                }

                if (!this.$route.params.sub && !this.$route.params.detail && !this.$route.params.source_id) {
                    this.$store.state.sidebar.sub = null;
                    this.$store.state.sidebar.detail = null;
                } else {
                    if (this.$route.params.sub) this.$store.state.sidebar.sub = this.$route.params.sub;
                    if (this.$route.params.detail) this.$store.state.sidebar.detail = this.$route.params.detail;
                }

                if (this.$store.state.sidebar.general == 3 && this.$route.name) {
                    this.$set(this.$store.state.sidebar, "other", this.$route.name);
                }
            },
        },
    },
    methods: {
        onChangeMap(scene) {
            if (!scene) {
                const query = {
                    ...this.$route.query,
                };
                delete query.scene;
                this.$router.replace({ name: "search", query });
                return;
            }
            const query = {
                ...this.$route.query,
                scene,
            };
            if (query.scene != this.$route.query.scene) {
                this.$router.replace({ name: "search", query });
            }
        },
        getAppIcon,
        search(keyword) {
            delete this.$store.state.scroll_tops["search"];
            const target = {
                name: "search",
                params: { keyword: keyword.trim().replace(/(?:^\[)|(?:\]$)/gi, "") },
                query: this.$route.query,
            };
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
    .m-search .el-input-group__prepend {
        // border: none;
        padding: 0;
        .el-cascader {
            width: 140px;
            line-height: 38px;
        }

        .el-cascader .el-input__inner {
            border: none;
            height: 38px;
            line-height: 38px;
            background-color: #f5f7fa;
        }
    }
}
</style>
