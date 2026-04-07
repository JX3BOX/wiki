<template>
    <div class="m-search-view">
        <span class="m-list-empty" v-if="isEmpty">👻 暂无记录</span>
        <!-- 搜索结果 & list列表 -->
        <knowledgeList v-if="list" :list="list" :total="total" :pagination="pagination" @onPageKey="onPageKey" />
    </div>
</template>

<script>
import knowledgeList from "@/components/knowledge/list.vue";
import { getKnowledgeList } from "@/service/knowledge.js";

export default {
    name: "SearchPage",
    components: {
        knowledgeList,
    },
    props: [],
    data() {
        return {
            loading: false,
            list: "",

            page: 1,
            per: 20,
            total: 1,
            pages: 1,
        };
    },
    computed: {
        search() {
            return this.$route.params.keyword;
        },
        isEmpty() {
            return !this.list?.length;
        },
        type() {
            return this.$route.params.knowledge_type;
        },
        params() {
            let params = {
                per: this.per,
                page: this.page,
                type: this.type,
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
            this.loading = true;
            getKnowledgeList(this.params)
                .then((res) => {
                    this.total = res.data.data.total || 0;
                    this.list = res.data.data.list || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 搜索关键词查找
        onSearchKey(val) {
            this.search = val;
            this.page = 1;
        },
        // 切换页码
        onPageKey(val) {
            this.page = val;
        },
    },
    watch: {
        params() {
            this.getListData();
        },
        type() {
            this.page = 1;
        },
    },
    created: function () {
        this.getListData();
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
