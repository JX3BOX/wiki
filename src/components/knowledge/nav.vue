<template>
    <div class="m-knowledge-nav">
        <div class="m-knowledge-nav-header">
            <el-input
                v-model="keyword"
                class="u-keyword"
                :placeholder="$t('ui.quest.navKeyword')"
                clearable
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
                    :aria-expanded="item.expanded"
                    @click="toggleCategory(item)"
                >
                    <el-icon class="u-arrow" :class="{ 'is-expanded': item.expanded }"><CaretRight /></el-icon>
                    <span class="u-name">{{ item.name }}</span>
                    <span class="u-count">{{ reading.byType[item.id]?.read || 0 }} / {{ item.count }}</span>
                </router-link>
                <ul v-if="item.expanded" class="m-knowledge-children" v-loading="item.loading">
                    <li v-if="item.error" class="u-child-status">
                        <el-button link type="primary" @click="loadCategory(item)">{{ $t("ui.common.actions.retry") }}</el-button>
                    </li>
                    <li v-else-if="item.loaded && !filteredEntries(item).length" class="u-child-status">{{ $t("ui.common.status.noRecords") }}</li>
                    <li v-for="entry in filteredEntries(item)" :key="entry.id">
                        <router-link
                            class="u-entry"
                            active-class="is-active"
                            :to="{ name: 'view', params: { source_id: entry.id } }"
                            :title="entry.name"
                        >
                            <template v-for="(part, index) in highlightParts(entry.name)" :key="index">
                                <mark v-if="part.match" class="u-search-match">{{ part.text }}</mark>
                                <template v-else>{{ part.text }}</template>
                            </template>
                        </router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import { getKnowledgeMenus, getKnowledgeCount, getKnowledgeList } from "@/service/knowledge.js";
import { reading, loadReading } from "@/store/knowledge-reading";
import User from "@jx3box/jx3box-common/js/user";
import { CaretRight } from "@element-plus/icons-vue";

export default {
    name: "KnowledgeNav",
    components: { CaretRight },
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
    methods: {
        filteredEntries(item) {
            const keyword = this.keyword.trim().toLowerCase();
            return keyword
                ? item.children.filter((entry) => String(entry.name || "").toLowerCase().includes(keyword))
                : item.children;
        },
        highlightParts(name) {
            const text = String(name || "");
            const keyword = this.keyword.trim();
            if (!keyword) return [{ text, match: false }];
            const parts = [];
            const normalized = text.toLowerCase();
            const query = keyword.toLowerCase();
            let start = 0;
            let index = normalized.indexOf(query);
            while (index !== -1) {
                if (index > start) parts.push({ text: text.slice(start, index), match: false });
                parts.push({ text: text.slice(index, index + keyword.length), match: true });
                start = index + keyword.length;
                index = normalized.indexOf(query, start);
            }
            if (start < text.length) parts.push({ text: text.slice(start), match: false });
            return parts;
        },
        toggleCategory(item) {
            item.expanded = !item.expanded;
            if (item.expanded && !item.loaded && !item.loading) this.loadCategory(item);
        },
        async loadCategory(item) {
            item.loading = true;
            item.error = false;
            try {
                const response = await getKnowledgeList({ type: item.id, _no_page: 1 });
                const data = response?.data?.data;
                item.children = Array.isArray(data) ? data : data?.list || [];
                item.loaded = true;
            } catch {
                item.error = true;
            } finally {
                item.loading = false;
            }
        },
        toggleUnread(value) {
            if (!User.isLogin()) { User.toLogin(); return; }
            reading.onlyUnread = value;
            if (value && !['normal', 'search'].includes(this.$route.name)) {
                this.$router.push({ name: 'search', query: { page: 1 } });
            }
        },
        async loadKnowledge() {
            const [countsResponse, menusResponse] = await Promise.all([getKnowledgeCount(), getKnowledgeMenus()]);
            const counts = countsResponse?.data?.data || [];
            const menus = menusResponse?.data?.data || [];

            this.maps = Object.values(menus).map((item) => ({
                expanded: false,
                loading: false,
                loaded: false,
                error: false,
                children: [],
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
