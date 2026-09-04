<template>
    <DefaultLayout
        :name="$t('ui.apps.item')"
        slug="item"
        root="/item"
        :publishEnable="true"
        :feedbackEnable="true"
        :adminEnable="false"
    >
        <template #breadcrumb>
            <ItemBreadcrumb />
        </template>
        <template #left>
            <CommonNav>
                <Sidebar :sidebar="globalSidebar" />
            </CommonNav>
        </template>
        <Search class="m-item-search" :placeholder="$t('ui.item.searchPlaceholder')" @search="search($event)">
            <template #filter>
                <el-popover placement="bottom-end" trigger="click" popper-class="m-search-filter-popper">
                    <div class="m-search-filter">
                        <el-select
                            v-model="filter.BindType"
                            filterable
                            clearable
                            :placeholder="$t('ui.item.filters.bindType')"
                            @change="applyFilters"
                        >
                            <el-option
                                v-for="item in enums.BindType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.BelongSchool" filterable clearable :placeholder="$t('ui.item.filters.school')" @change="applyFilters">
                            <el-option v-for="item in enums.BelongSchool" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.MagicKind" filterable clearable :placeholder="$t('ui.item.filters.whiteStat')" @change="applyFilters">
                            <el-option v-for="item in enums.MagicKind" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.MagicType" filterable clearable :placeholder="$t('ui.item.filters.greenStat')" @change="applyFilters">
                            <el-option v-for="item in enums.MagicType" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.GetType" filterable clearable :placeholder="$t('ui.item.filters.source')" @change="applyFilters">
                            <el-option v-for="item in enums.GetType" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.TypeLabel" filterable clearable :placeholder="$t('ui.item.filters.type')" @change="applyFilters">
                            <el-option v-for="item in enums.TypeLabel" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <div class="u-filter-level">
                            <el-input v-model="filter.MinLevel" :placeholder="$t('ui.item.filters.minQuality')" @change="applyFilters"></el-input>
                            <span>~</span>
                            <el-input v-model="filter.MaxLevel" :placeholder="$t('ui.item.filters.maxQuality')" @change="applyFilters"></el-input>
                        </div>
                    </div>
                    <template #reference>
                        <el-button class="u-search-more" type="primary" plain>
                            <el-icon><Filter /></el-icon>
                            {{ $t("ui.common.actions.filter") }}
                        </el-button>
                    </template>
                </el-popover>
            </template>
        </Search>
        <router-view v-slot="{ Component }">
            <keep-alive include="PlanList">
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <template #right>
            <Extend />
        </template>
    </DefaultLayout>
</template>

<script>
import { get_item_enums } from "@/service/item";

import DefaultLayout from "@/layout/default-layout.vue";
import CommonNav from "@/components/common/nav.vue";
import Search from "@/components/common/search.vue";
import ItemBreadcrumb from "@/components/item/item-breadcrumb.vue";
import Sidebar from "@/components/item/sidebar.vue";
import Extend from "@/components/item/extend.vue";

export default {
    name: "ItemIndex",
    components: { DefaultLayout, ItemBreadcrumb, Sidebar, Extend, Search, CommonNav },
    data() {
        return {
            keyword: "",

            filter: {
                BindType: null,
                BelongSchool: null,
                MagicKind: null,
                MagicType: null,
                GetType: null,
                TypeLabel: null,
                MinLevel: null,
                MaxLevel: null,
            },
            enums: {
                BindType: [],
                BelongSchool: [],
                MagicKind: [],
                MagicType: [],
                GetType: [],
                TypeLabel: [],
            },
        };
    },
    computed: {
        globalSidebar() {
            return this.$store.state.sidebar;
        },
        query() {
            return this.$route.query;
        },
        params() {
            return this.$route.params;
        },
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                let sidebar = {};
                if (
                    typeof this.params.AucGenre === "undefined" &&
                    typeof this.params.AucSubTypeID === "undefined" &&
                    typeof this.query.auc_genre === "undefined" &&
                    typeof this.query.auc_sub_type_id === "undefined" &&
                    !this.params.item_id
                ) {
                    sidebar = { AucGenre: null, AucSubTypeID: null };
                } else {
                    sidebar = {
                        AucGenre: this.query.auc_genre || "",
                        AucSubTypeID: this.query.auc_sub_type_id || "",
                    };
                    // 如存在路由参数，优先使用路由参数
                    if (this.params.AucGenre) {
                        sidebar = {
                            AucGenre: this.params.AucGenre === "empty" ? "" : this.params.AucGenre,
                            AucSubTypeID: this.params.AucSubTypeID || "",
                        };
                    }
                }
                this.$store.commit("SET_STATE", { key: "sidebar", value: sidebar });
                this.initQuery();
            },
        },
    },
    methods: {
        search(keyword) {
            let query = { page: 1 };
            // 菜单筛选
            if (this.$store.state.sidebar.AucGenre) query.auc_genre = this.$store.state.sidebar.AucGenre;
            if (this.$store.state.sidebar.AucSubTypeID) query.auc_sub_type_id = this.$store.state.sidebar.AucSubTypeID;

            for (const key in this.filter) {
                const value = this.filter[key];
                if (value !== null && value !== undefined && value !== "") query[key] = value;
            }

            this.$router.push({
                name: "search",
                params: { keyword: keyword },
                query: query,
            });
        },

        initQuery() {
            this.keyword = this.$route.params.keyword || "";
            const query = this.$route.query;
            const nextFilter = {};
            for (const key of Object.keys(this.filter)) {
                const rawValue = Array.isArray(query[key]) ? query[key][query[key].length - 1] : query[key];
                if (rawValue === undefined || rawValue === "") {
                    nextFilter[key] = null;
                    continue;
                }
                nextFilter[key] = !Number.isNaN(Number(rawValue)) ? Number(rawValue) : rawValue;
            }
            this.filter = nextFilter;
        },
        applyFilters() {
            this.search(this.keyword);
        },
    },
    mounted() {
        get_item_enums({ client: this.client }).then((res) => {
            const data = res.data?.data;
            if (!data) return;
            this.enums = data;
            this.enums.BindType = [
                {
                    label: this.$t("ui.item.filters.unbound"),
                    value: 1,
                },
                {
                    label: this.$t("ui.item.filters.bindOnEquip"),
                    value: 2,
                },
                {
                    label: this.$t("ui.item.filters.bindOnPickup"),
                    value: 3,
                },
            ];
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/item/index.less";
</style>
