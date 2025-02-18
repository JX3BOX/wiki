<template>
    <DefaultLayout
        name="物品百科"
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
        <Search class="m-item-search" :placeholder="placeholder" @search="search($event)">
            <template #filter>
                <el-popover placement="bottom-end" trigger="click" popper-class="m-search-filter-popper">
                    <div class="m-search-filter">
                        <el-select v-model="filter.BindType" filterable clearable placeholder="绑定类型">
                            <el-option
                                v-for="item in enums.BindType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.BelongSchool" filterable clearable placeholder="所属门派">
                            <el-option v-for="item in enums.BelongSchool" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.MagicKind" filterable clearable placeholder="白字类型">
                            <el-option v-for="item in enums.MagicKind" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.MagicType" filterable clearable placeholder="绿字类型">
                            <el-option v-for="item in enums.MagicType" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.GetType" filterable clearable placeholder="获取方式">
                            <el-option v-for="item in enums.GetType" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-select v-model="filter.TypeLabel" filterable clearable placeholder="物品类型">
                            <el-option v-for="item in enums.TypeLabel" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <div class="u-filter-level">
                            <el-input v-model="filter.MinLevel" placeholder="最低品质"></el-input>
                            <span>~</span>
                            <el-input v-model="filter.MaxLevel" placeholder="最高品质"></el-input>
                        </div>
                    </div>
                    <el-button slot="reference" class="u-search-more" type="primary" plain>
                        <i class="el-icon-more"></i>
                    </el-button>
                </el-popover>
            </template>
        </Search>
        <keep-alive include="PlanList">
            <router-view />
        </keep-alive>
        <template #right>
            <Extend />
        </template>
    </DefaultLayout>
</template>

<script>
import { get_item_enums } from "@/service/item";

import DefaultLayout from "@/layout/default-layout.vue";
import ItemBreadcrumb from "@/components/item/item-breadcrumb.vue";
import Sidebar from "@/components/item/sidebar.vue";
import Extend from "@/components/item/extend.vue";
import Search from "@/components/common/search.vue";
import CommonNav from "@/components/common/nav.vue";

export default {
    name: "ItemIndex",
    components: { DefaultLayout, ItemBreadcrumb, Sidebar, Extend, Search, CommonNav },
    data() {
        return {
            placeholder: "输入物品名称（可适配中括号形式）/物品描述「回车」进行搜索",

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
            // immediate: true,
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
        filter: {
            handler(val, oldVal) {
                if (val.MinLevel === oldVal.MinLevel && val.MaxLevel === oldVal.MaxLevel) {
                    this.search(this.keyword);
                }
            },
            deep: true,
        },
    },
    methods: {
        search(keyword) {
            let query = { page: 1 };
            // 菜单筛选
            if (this.$store.state.sidebar.AucGenre) query.auc_genre = this.$store.state.sidebar.AucGenre;
            if (this.$store.state.sidebar.AucSubTypeID) query.auc_sub_type_id = this.$store.state.sidebar.AucSubTypeID;

            for (let key in this.filter) {
                if (this.filter[key]) query[key] = this.filter[key];
            }

            this.$router.push({
                name: "search",
                params: { keyword: keyword },
                query: query,
            });
        },

        initQuery() {
            this.keyword = this.$route.params.keyword;
            const query = this.$route.query;
            for (let key in query) {
                if (this.filter[key] !== undefined)
                    this.filter[key] = !isNaN(Number(query[key])) ? Number(query[key]) : query[key];
            }
        },
    },
    mounted() {
        this.initQuery();
        get_item_enums({ client: this.client }).then((res) => {
            const data = res.data?.data;
            if (!data) return;
            this.enums = data;
            this.enums.BindType = [
                {
                    label: "不绑定",
                    value: 1,
                },
                {
                    label: "装备后绑定",
                    value: 2,
                },
                {
                    label: "拾取后绑定",
                    value: 3,
                },
            ];
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
