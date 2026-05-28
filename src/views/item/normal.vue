<template>
    <div class="m-item-index m-item-normal">
        <div class="m-items-list">
            <Items :items="items"></Items>
        </div>
        <div class="m-cursor-pagination" v-if="showPagination">
            <el-button :disabled="!canGoPrev" @click="goPrev">&laquo; 上一页</el-button>
            <span class="u-page">第 {{ page }} 页</span>
            <el-button :disabled="!canGoNext" @click="goNext">下一页 &raquo;</el-button>
        </div>
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
            nextCursor: null,
            cursorByPage: { 1: null },
            cursorScope: "",
        };
    },
    computed: {
        loading() {
            return this.items === null;
        },
        canGoPrev() {
            if (this.loading || this.page <= 1) return false;
            if (this.page === 2) return true;
            return Object.prototype.hasOwnProperty.call(this.cursorByPage, this.page - 1);
        },
        canGoNext() {
            return !this.loading && !!this.nextCursor && this.items_total > this.length;
        },
        showPagination() {
            return this.page > 1 || this.items_total > this.length;
        },
    },
    components: {
        Items,
    },
    methods: {
        getCursorScope() {
            return JSON.stringify({
                AucGenre: this.$store.state.sidebar.AucGenre,
                AucSubTypeID: this.$store.state.sidebar.AucSubTypeID,
                client: this.$store.state.client,
            });
        },
        getLastIdKey(items) {
            const lastItem = items?.[items.length - 1];
            return lastItem?.idKey || null;
        },
        pushCursorPage(page, cursor) {
            const query = { page };
            if (cursor) query.last_id_key = cursor;
            this.$router.push({
                name: "normal",
                params: {
                    AucGenre: this.$store.state.sidebar.AucGenre === "" ? "empty" : this.$store.state.sidebar.AucGenre,
                    AucSubTypeID: this.$store.state.sidebar.AucSubTypeID,
                },
                query,
            });
        },
        goPrev() {
            if (!this.canGoPrev) return;
            const page = this.page - 1;
            this.pushCursorPage(page, this.cursorByPage[page]);
        },
        goNext() {
            if (!this.canGoNext) return;
            const page = this.page + 1;
            this.cursorByPage[page] = this.nextCursor;
            this.pushCursorPage(page, this.nextCursor);
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                this.items = null; // 加载中状态
                const cursorScope = this.getCursorScope();
                if (cursorScope !== this.cursorScope) {
                    this.cursorScope = cursorScope;
                    this.cursorByPage = { 1: null };
                }
                this.page = Number(this.$route.query.page) || 1;
                const lastIdKey = this.page > 1 ? this.$route.query.last_id_key : null;
                if (lastIdKey) this.cursorByPage[this.page] = lastIdKey;
                // 获取菜单物品列表
                const params = {
                    auc_genre: this.$store.state.sidebar.AucGenre,
                    auc_sub_type_id: this.$store.state.sidebar.AucSubTypeID,
                    page: this.page,
                    per: this.length,
                    client: this.$store.state.client,
                };
                if (lastIdKey) params.last_id_key = lastIdKey;
                get_menu_items(params).then((data) => {
                    data = data.data;
                    this.items = data.data.data || [];
                    this.items_total = data.data.total || 0;
                    this.nextCursor = this.getLastIdKey(this.items);
                });
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/normal.less";

.m-item-normal {
    .m-cursor-pagination {
        .mt(20px);
        .flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

        .u-page {
            color: #909399;
            .fz(13px);
        }
    }
}
</style>
