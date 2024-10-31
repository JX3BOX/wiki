<template>
    <div class="m-item-index m-item-normal">
        <div class="m-items-list">
            <Items :items="items"></Items>
        </div>
        <el-pagination
            background
            :total="items_total"
            hide-on-single-page
            layout="prev, pager, next"
            :current-page="page"
            :page-size="length"
            prev-html="&laquo;"
            next-html="&raquo;"
            @current-change="page_change_handle"
        ></el-pagination>
    </div>
</template>

<script>
import Items from "@/components/item/items.vue";
import { get_menu_items } from "@/service/item";

export default {
    name: "Normal",
    props: [],
    data: function () {
        return {
            items: null,
            items_total: 0,
            page: 1,
            length: 20,
            auc_genre: null,
            auc_sub_type: null,
        };
    },
    components: {
        Items,
    },
    methods: {
        page_change_handle(page) {
            this.$router.push({
                name: "normal",
                params: {
                    AucGenre: this.$store.state.sidebar.AucGenre === "" ? "empty" : this.$store.state.sidebar.AucGenre,
                    AucSubTypeID: this.$store.state.sidebar.AucSubTypeID,
                },
                query: { page: page },
            });
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                this.items = null; // 加载中状态
                this.page = Number(this.$route.query.page);
                // 获取菜单物品列表
                get_menu_items({
                    auc_genre: this.$store.state.sidebar.AucGenre,
                    auc_sub_type_id: this.$store.state.sidebar.AucSubTypeID,
                    page: this.page,
                    limit: this.length,
                    client: this.$store.state.client,
                }).then((data) => {
                    data = data.data;
                    this.items = data.data.data || [];
                    this.items_total = data.data.total || 0;
                });
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/normal.less";
</style>
