<template>
    <div class="m-search-view m-search-view--item">
        <Items :items="items" :error="loadError" @retry="loadItems">
            <template #empty-message>
                <span>{{ $t("ui.common.status.noRecords") }}</span>
                <template v-if="$route.query.auc_genre || $route.query.auc_sub_type_id">
                    <span>{{ $t("ui.item.searchIn") }}</span>
                    <span class="u-research" @click="clean_type">
                        <b>{{ $t("ui.item.searchAllCategories") }}</b>
                    </span>
                </template>
            </template>
        </Items>
        <div class="m-cursor-pagination" v-if="showPagination">
            <el-button :disabled="!canGoPrev" @click="goPrev">{{ $t("ui.common.pagination.previous") }}</el-button>
            <span class="u-page">{{ $t("ui.common.pagination.page", { page }) }}</span>
            <el-button :disabled="!canGoNext" @click="goNext">{{ $t("ui.common.pagination.next") }}</el-button>
        </div>
    </div>
</template>

<script>
import Items from "@/components/item/items.vue";

import { get_items_search } from "@/service/item";
import { canGoNextCursorPage } from "@/utils/pagination";
import { createLatestRequestGuard } from "@/utils/latest-request";

export default {
    name: "SearchPage",
    props: [],
    data: function () {
        return {
            items: null,
            total: 0,
            page: 1,
            length: 15,
            nextCursor: null,
            cursorByPage: { 1: null },
            cursorScope: "",
            loadError: false,
            requestGuard: createLatestRequestGuard(),
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        loading() {
            return this.items === null;
        },
        canGoPrev() {
            if (this.loading || this.page <= 1) return false;
            if (this.page === 2) return true;
            return Object.prototype.hasOwnProperty.call(this.cursorByPage, this.page - 1);
        },
        canGoNext() {
            return canGoNextCursorPage({
                loading: this.loading,
                nextCursor: this.nextCursor,
                total: this.total,
                page: this.page,
                pageSize: this.length,
            });
        },
        showPagination() {
            return !this.loadError && (this.page > 1 || this.total > this.length);
        },
    },
    methods: {
        clean_type() {
            let query = JSON.parse(JSON.stringify(this.$route.query));
            delete query.auc_genre;
            delete query.auc_sub_type_id;
            delete query.last_id_key;
            query.page = 1;
            this.$router.replace({ query: query });
        },
        getCursorScope() {
            const { page, last_id_key, ...query } = this.$route.query;
            return JSON.stringify({ params: this.$route.params, query, client: this.client });
        },
        getLastIdKey(items) {
            const lastItem = items?.[items.length - 1];
            return lastItem?.idKey || null;
        },
        pushCursorPage(page, cursor) {
            const query = { ...this.$route.query, page };
            if (cursor) {
                query.last_id_key = cursor;
            } else {
                delete query.last_id_key;
            }
            this.$router.push({
                name: "search",
                params: { keyword: this.$route.params.keyword },
                query: query,
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
        loadItems() {
            const token = this.requestGuard.begin();
            this.items = null;
            this.loadError = false;
            const cursorScope = this.getCursorScope();
            if (cursorScope !== this.cursorScope) {
                this.cursorScope = cursorScope;
                this.cursorByPage = { 1: null };
            }
            this.page = parseInt(this.$route.query.page) || 1;
            const lastIdKey = this.page > 1 ? this.$route.query.last_id_key : null;
            if (lastIdKey) this.cursorByPage[this.page] = lastIdKey;
            let params = {
                ids: this.$route.query.ids || "",
                keyword: this.$route.params.keyword,
                page: this.page,
                per: this.length,
                client: this.client,
                ...this.$route.query,
            };
            if (!lastIdKey) delete params.last_id_key;

            get_items_search(params)
                .then((data) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    data = data.data;
                    this.items = data.data.data || [];
                    this.total = data.data.total || 0;
                    this.nextCursor = this.getLastIdKey(this.items);
                })
                .catch(() => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.items = [];
                    this.total = 0;
                    this.nextCursor = null;
                    this.loadError = true;
                });
        },
    },
    components: {
        Items,
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                this.loadItems();
            },
        },
    },
    beforeUnmount() {
        this.requestGuard.invalidate();
    },
};
</script>

<style lang="less">
.m-search-view {
    .u-research {
        .pl(5px);

        b {
            color: @v4primary;
            .pointer;
            .fz(15px);
        }
    }

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
