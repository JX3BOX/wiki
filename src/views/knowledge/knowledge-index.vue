<template>
    <div class="v-knowledge-index m-home-view" v-loading="loading">
        <!-- 搜索结果 -->
        <knowledgeList v-if="search" :list="list" :total="total" :pagination="pagination" @onPageKey="onPageKey" />
        <template v-else>
            <!-- 快捷入口 -->
            <!-- <wikiEntry /> -->
            <!--  玩法指南 -->
            <wikiGuide />
            <!-- 热门剧情 -->
            <!-- <wikiHot /> -->
            <!-- 术语大全 -->
            <wikiJargon />
            <!-- 最新更新 -->
            <wikiRecent />
        </template>
    </div>
</template>

<script>
import knowledgeList from "@/components/knowledge/list.vue";
// import wikiEntry from "@/components/knowledge/entry.vue"; // 快捷入口
import wikiGuide from "@/components/knowledge/guide.vue"; // 玩法指南
// import wikiHot from "@/components/knowledge/hot.vue"; // 热门剧情
import wikiJargon from "@/components/knowledge/jargon.vue"; // 术语大全
import wikiRecent from "@/components/knowledge/recent.vue"; // 最新更新
import { getKnowledgeList } from "@/service/knowledge.js";

export default {
    name: "KnowledgeIndex",
    components: {
        knowledgeList,
        // wikiEntry,
        // wikiHot,
        wikiJargon,
        wikiGuide,
        wikiRecent,
    },
    data: function () {
        return {
            loading: false,
            search: "",
            list: "",

            page: 1,
            per: 20,
            total: 1,
            pages: 1,
        };
    },
    computed: {
        params() {
            let params = {
                per: this.per,
                page: this.page,
                _search: this.search,
            };
            return params;
        },
        pagination() {
            return {
                page: this.page,
                total: this.total,
                per: this.per,
            };
        },
        routeSearch() {
            return this.$route.query.search;
        },
    },
    watch: {
        params() {
            this.getSearchData();
        },
    },
    methods: {
        // 获取搜索的数据
        getSearchData() {
            this.loading = true;
            getKnowledgeList(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // ===============
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
    created: function () {},
};
</script>
<style lang="less">
@import "~@/assets/css/knowledge/index.less";
</style>
