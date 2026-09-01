<template>
    <div class="m-search-result" v-loading="loading">
        <list-head></list-head>
        <div class="m-list-empty" v-if="loadError">
            <span>{{ $t("ui.common.status.loadFailed") }}</span>
            <el-button link type="primary" @click="search()">{{ $t("ui.common.actions.retry") }}</el-button>
        </div>
        <div class="m-list-empty" v-else-if="!loading && !hasResults">{{ $t("ui.common.status.noRecords") }}</div>
        <template v-else-if="resultIsObject">
            <template v-if="result.prev && result.prev.length > 0">
                <el-divider><LegacyIcon class="el-icon-star-off" /> {{ $t("ui.quest.precedingBranch") }}</el-divider>
                <quest-card v-for="quest in result.prev" :key="quest.id" :quest="quest"></quest-card>
            </template>
            <template v-if="result.current && result.current.length > 0">
                <el-divider v-if="result.current.length > 0"><LegacyIcon class="el-icon-star-off" /> {{ $t("ui.quest.chain") }}</el-divider>
                <quest-card
                    v-for="quest in result.current"
                    :class="{ current: quest.name == keyword }"
                    :key="quest.id"
                    :quest="quest"
                ></quest-card>
            </template>
            <template v-if="result.branch && result.branch.length > 0">
                <el-divider><LegacyIcon class="el-icon-star-off" /> {{ $t("ui.quest.branch") }}</el-divider>
                <quest-card v-for="quest in result.branch" :key="quest.id" :quest="quest"></quest-card>
            </template>
            <template v-if="result.byKeyword && result.byKeyword.length > 0">
                <quest-card v-for="quest in result.byKeyword" :key="quest.id" :quest="quest"></quest-card>
            </template>
        </template>
        <el-pagination
            hide-on-single-page
            background
            layout="prev, pager, next, jumper"
            @current-change="search"
            :total="total"
            :page-size="pageSize"
            v-if="!loadError"
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
import { createLatestRequestGuard } from "@/utils/latest-request";

export default {
    name: "SearchResult",
    components: { QuestCard, ListHead },
    data: () => ({
        total: 1,
        pageSize: 10,
        result: {},
        loading: false,
        loadError: false,
        requestGuard: createLatestRequestGuard(),
    }),
    mounted() {
        this.input = this.keyword;
        this.checkChain = this.chain;
        this.search();
    },
    methods: {
        search(page = 1) {
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
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
            )
                .then((res) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.result = res.data.list || {};
                    this.total = res.data.total || 0;
                    this.pageSize = res.data.per || 10;
                })
                .catch(() => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.result = {};
                    this.total = 0;
                    this.loadError = true;
                })
                .finally(() => {
                    if (this.requestGuard.isCurrent(token)) this.loading = false;
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
        hasResults() {
            if (Array.isArray(this.result)) return this.result.length > 0;
            return Object.values(this.result || {}).some((items) => Array.isArray(items) && items.length > 0);
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
    beforeUnmount() {
        this.requestGuard.invalidate();
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/result/search-result.less";
</style>
