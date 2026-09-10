<template>
    <div class="m-knowledge-nav">
        <div class="m-knowledge-nav-header">
            <el-input
                :model-value="keyword"
                class="u-keyword"
                :placeholder="$t('ui.quest.navKeyword')"
                clearable
                @update:modelValue="updateKeyword"
                @keydown.enter="search"
            />
            <div class="m-filters">
                <el-checkbox  :model-value="reading.onlyUnread" @change="toggleUnread" :label="$t('ui.knowledge.onlyUnread')" border size="small" />
                <div class="u-total"><b class="u-completed-num">{{ reading.error ? '—' : reading.read }}</b><span> / {{ totalCount }}</span></div>
            </div>
        </div>
        <ul class="m-knowledge-stats">
            <li class="m-knowledge-stat">
                <a
                    class="m-knowledge-category"
                    href="/knowledge"
                    :class="{ 'is-active': $route.name === 'index' }"
                    :aria-current="$route.name === 'index' ? 'page' : undefined"
                >
                    <el-icon class="u-arrow"><CaretRight /></el-icon>
                    <span class="u-name">首页</span>
                </a>
            </li>
            <li v-for="item in maps" :key="item.id" class="m-knowledge-stat">
                <router-link
                    class="m-knowledge-category"
                    active-class="is-active"
                    :to="{ name: 'normal', params: { type_slug: item.id } }"
                >
                    <el-icon class="u-arrow"><CaretRight /></el-icon>
                    <span class="u-name">{{ item.name }}</span>
                    <span class="u-count">{{ reading.byType[item.id]?.read || 0 }} / {{ item.count }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { getKnowledgeMenus, getKnowledgeCount } from "@/service/knowledge.js";
import { reading, loadReading } from "@/store/knowledge-reading";
import User from "@jx3box/jx3box-common/js/user";
import { CaretRight } from "@element-plus/icons-vue";

export default {
    name: "KnowledgeNav",
    components: { CaretRight },
    emits: ["search"],
    data() {
        return {
            maps: [],
            keyword: "",
            reading,
        };
    },
    computed: {
        totalCount() {
            return this.maps.reduce((total, item) => total + (Number(item.count) || 0), 0);
        },
    },
    watch: {
        "$route.fullPath": {
            immediate: true,
            handler() {
                this.keyword = this.$route.params.keyword || "";
            },
        },
    },
    methods: {
        toggleUnread(value) {
            if (!User.isLogin()) { User.toLogin(); return; }
            reading.onlyUnread = value;
            if (value && !['normal', 'search'].includes(this.$route.name)) this.search();
        },
        search(event) {
            if (event?.isComposing) return;
            this.$emit("search", this.keyword);
        },
        updateKeyword(value) {
            const previous = this.keyword;
            this.keyword = value || "";
            if (previous && !this.keyword) this.search();
        },
        async loadKnowledge() {
            const [countsResponse, menusResponse] = await Promise.all([getKnowledgeCount(), getKnowledgeMenus()]);
            const counts = countsResponse?.data?.data || [];
            const menus = menusResponse?.data?.data || [];

            this.maps = Object.values(menus).map((item) => ({
                id: item.name,
                name: item.label,
                count: counts.find((count) => count.type === item.name)?.count ?? 0,
            }));
        },
    },
    created() {
        this.loadKnowledge();
        loadReading().catch(() => this.$message.error(this.$t('ui.knowledge.readLoadFailed')));
    },
};
</script>

<style lang="less">
@import "~@/assets/css/knowledge/nav.less";
</style>
