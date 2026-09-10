<template>
    <div class="m-search-view">
        <WikiSearchLoading v-if="loading" />
        <div class="m-list-empty" v-else-if="loadError">
            <span>{{ $t("ui.common.status.loadFailed") }}</span>
            <el-button link type="primary" @click="getListData">{{ $t("ui.common.actions.retry") }}</el-button>
        </div>
        <span class="m-list-empty" v-else-if="!loading && isEmpty">{{ $t("ui.common.status.noRecords") }}</span>
        <!-- 搜索结果 & list列表 -->
        <knowledgeList
            v-if="!loading && list && !loadError && list.length"
            :list="list"
            :total="total"
            :pagination="pagination"
            @onPageKey="onPageKey"
        />
    </div>
</template>

<script>
import WikiSearchLoading from "@/components/common/wiki-search-loading.vue";
import knowledgeList from "@/components/knowledge/list.vue";
import { reading } from "@/store/knowledge-reading";
import { getKnowledgeList } from "@/service/knowledge.js";
import { createLatestRequestGuard } from "@/utils/latest-request";

export default {
    name: "SearchPage",
    components: {
        WikiSearchLoading,
        knowledgeList,
    },
    props: [],
    data() {
        return {
            loading: false,
            list: null,
            loadError: false,
            requestGuard: createLatestRequestGuard(),

            page: 1,
            per: 20,
            total: 1,
            pages: 1,
        };
    },
    computed: {
        onlyUnread() { return reading.onlyUnread; },
        search() {
            return this.$route.params.keyword;
        },
        isEmpty() {
            return Array.isArray(this.list) && !this.list.length;
        },
        type() {
            return this.$route.params.knowledge_type;
        },
        params() {
            let params = {
                per: this.per,
                page: this.page,
                type: this.type,
                unread: reading.onlyUnread ? 1 : 0,
            };
            if (this.search) {
                params._search = this.search;
            }
            return params;
        },
        pagination() {
            return {
                page: this.page,
                total: this.total,
                per: this.per,
            };
        },
    },
    methods: {
        // 按类别获取数据
        getListData() {
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
            getKnowledgeList(this.params)
                .then((res) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.total = res.data.data.total || 0;
                    this.list = res.data.data.list || [];
                })
                .catch(() => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.total = 0;
                    this.list = [];
                    this.loadError = true;
                })
                .finally(() => {
                    if (this.requestGuard.isCurrent(token)) this.loading = false;
                });
        },

        // 搜索关键词查找
        onSearchKey(val) {
            this.page = 1;
            this.$router.push({ name: "search", params: { keyword: val } });
        },
        // 切换页码
        onPageKey(val) {
            this.page = val;
        },
    },
    watch: {
        onlyUnread: {
            flush: "sync",
            handler() {
                this.page = 1;
                this.list = null;
            },
        },
        params: {
            immediate: true,
            deep: true,
            handler() {
                this.getListData();
            },
        },
        type() {
            this.page = 1;
        },
    },
    beforeUnmount() {
        this.requestGuard.invalidate();
    },
};
</script>
<style lang="less">
.u-list-empty {
    .db;
    .u-msg-yellow;
    .mt(5px);
    text-align: center;
}
</style>
