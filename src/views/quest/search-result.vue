<template>
    <div class="m-search-result">
        <list-head></list-head>
        <template v-if="resultIsObject">
            <template v-if="result.prev && result.prev.length > 0">
                <el-divider><i class="el-icon-star-off"></i> 前置分支</el-divider>
                <quest-card v-for="quest in result.prev" :key="quest.id" :quest="quest"></quest-card>
            </template>
            <template v-if="result.current && result.current.length > 0">
                <el-divider v-if="result.current.length > 0"><i class="el-icon-star-off"></i> 任务链条</el-divider>
                <quest-card
                    v-for="quest in result.current"
                    :class="{ current: quest.name == keyword }"
                    :key="quest.id"
                    :quest="quest"
                ></quest-card>
            </template>
            <template v-if="result.branch && result.branch.length > 0">
                <el-divider><i class="el-icon-star-off"></i> 任务分支</el-divider>
                <quest-card v-for="quest in result.branch" :key="quest.id" :quest="quest"></quest-card>
            </template>
            <template v-if="result.byKeyword && result.byKeyword.length > 0">
                <quest-card v-for="quest in result.byKeyword" :key="quest.id" :quest="quest"></quest-card>
            </template>
        </template>
        <el-pagination
            hide-on-single-page
            background
            layout="prev, pager, next"
            @current-change="search"
            :total="total"
            :page-size="pageSize"
            style="text-align: center; margin-top: 1.5rem"
        >
        </el-pagination>
    </div>
</template>

<script>
import LzString from "lz-string";
import { getQuests } from "@/service/quest";
import QuestCard from "@/components/quest/result/quest-card.vue";
import ListHead from "@/components/quest/result/list-head.vue";
import { mapState } from "vuex";

export default {
    name: "SearchResult",
    components: { QuestCard, ListHead },
    data: () => ({
        total: 1,
        pageSize: 10,
        result: {},
    }),
    mounted() {
        this.input = this.keyword;
        this.checkChain = this.chain;
        this.search();
    },
    methods: {
        search(page = 1) {
            getQuests(
                {
                    keyword: this.keyword,
                    chain: this.chain,
                    map_id: this.map_id,
                    client: this.client,
                    page,
                },
                {
                    filter: this.filter,
                }
            ).then((res) => {
                this.result = res.data.list;
                this.total = res.data.total;
                this.pageSize = res.data.per;
            });
        },
    },
    computed: {
        ...mapState({
            onlyNotCompleted: (state) => state.onlyNotCompleted,
            completedQuests: (state) => state.completedQuests,
        }),
        filter() {
            if (!this.onlyNotCompleted) return null;
            return LzString.compressToEncodedURIComponent(this.completedQuests.join(","));
        },
        keyword() {
            return this.$route.query.keyword;
        },
        chain() {
            return this.$route.query.chain;
        },
        map_id() {
            return this.$route.query.map_id;
        },
        watch_id() {
            return [this.keyword, this.chain, this.filter, this.map_id];
        },
        resultIsObject() {
            return this.result instanceof Object;
        },
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        watch_id: function () {
            this.search();
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/result/search-result.less";
</style>
