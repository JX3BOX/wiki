<template>
    <div>
        <el-drawer
            :visible="visible"
            class="c-var"
            direction="btt"
            :show-close="false"
            :with-header="false"
            custom-class="add-item-search-drawer"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
            v-bind="$attrs"
        >
            <template #default>
                <div class="c-var m-add-item-search-drawer" v-loading="loading">
                    <div class="m-drawer-content">
                        <div class="m-user-select__title">加入物品</div>
                        <div class="m-search-bar">
                            <el-input v-model="search" placeholder="输入物品名或id搜索"></el-input>
                            <div class="u-search-btn" @click="searchItems">搜索</div>
                        </div>
                        <div class="m-item-list" v-infinite-scroll="searchItems" infinite-scroll-disabled="loading">
                            <ItemCardVue
                                v-for="(item, index) in items"
                                :key="index"
                                :item-id="item.id"
                                :data="item"
                                @click="onSelectItem(item)"
                            ></ItemCardVue>
                        </div>
                    </div>
                </div>
            </template>
        </el-drawer>
        <AddItemPlanDrawerVue ref="add-item-plan-drawer"></AddItemPlanDrawerVue>
    </div>
</template>

<script>
import { get_items_search } from "@/service/item.js";
import ItemCardVue from "./item-card.vue";
import AddItemPlanDrawerVue from "./add-item-plan-drawer.vue";
export default {
    name: "AddItemPlanDrawer",
    components: { ItemCardVue, AddItemPlanDrawerVue },
    props: ["menus"],
    data() {
        return {
            visible: false,
            plan: null,
            items: [],
            page: 1,
            total: 0,
            loading: false,

            search: "",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        search: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.page = 1;
                    this.items = [];
                    this.total = 0;
                    this.searchItems();
                }
            },
        },
    },
    methods: {
        open(plan) {
            this.visible = true;
            this.plan = plan;
        },
        onClose() {
            this.visible = false;
        },
        searchItems() {
            if (!this.search) return;
            if (this.loading) return;
            if (this.total != 0 && this.items.length >= this.total) return;
            const params = {
                per: 10,
                page: this.page++,
                client: this.client,
            };
            console.log(params);
            if (this.search.match(/^\d+_\d+^/)) {
                params.ids = this.search;
            } else {
                params.keyword = this.search;
            }
            this.loading = true;
            get_items_search(params)
                .then((res) => {
                    const resp_data = res.data.data;
                    this.total = resp_data.total;
                    this.items = [...this.items, ...resp_data.data];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onSelectItem(item) {
            this.$refs["add-item-plan-drawer"]
                .open({
                    item_id: item.id,
                    item: item,
                    plan: this.plan,
                })
                .then(() => {
                    this.$emit("plan-change");
                });
        },
    },
};
</script>

<style lang="less">
.add-item-search-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
}

.m-add-item-search-drawer {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    padding: 20px;
    position: relative;
    gap: 12px;

    .m-search-bar {
        display: flex;
        gap: 12px;

        .el-input__inner {
            display: flex;
            padding: var(--16, 16px) var(--20, 20px);
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
            align-self: stretch;

            border-radius: var(--16, 16px);
            background: rgba(255, 255, 255, 0.1);

            color: rgba(255, 255, 255, 0.6);

            font-size: 14px;
            line-height: 20px; /* 142.857% */
            height: auto;
            box-shadow: none;
            border: none;
        }

        .u-search-btn {
            display: flex;
            padding: var(--12, 12px) var(--16, 16px);
            justify-content: center;
            align-items: center;
            gap: var(--8, 8px);
            flex-shrink: 0;

            border-radius: var(--12, 12px);
            background: var(--secondary-blue, #1886fe);

            color: #fff;

            /* 16 Bold */
            font-family: "Microsoft YaHei UI";
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */
        }
    }

    .m-item-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 300px;
        overflow: auto;
    }

    .m-drawer-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: auto;
        flex-grow: 1;
        margin-bottom: 20px;
    }

    .w-mobile-item-card {
        background-color: transparent;
        flex-shrink: 0;
    }
    .m-user-select__title {
        color: rgba(255, 255, 255, 0.8);

        /* 14 Bold */
        font-family: "Microsoft YaHei UI";
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px; /* 142.857% */
    }
}
</style>
