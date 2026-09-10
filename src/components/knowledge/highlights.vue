<template>
    <WikiPanel v-for="section in sections" :key="section.key" :border="false" class="m-knowledge-highlights">
        <template #head-title>
            <LegacyIcon :class="section.icon" />
            <span>{{ $t(section.title) }}</span>
        </template>
        <template #body>
            <div v-if="section.loading" class="u-state">{{ $t('ui.common.status.loading') }}</div>
            <div v-else-if="section.error" class="u-state">
                {{ $t('ui.common.status.loadFailed') }}
                <el-button link type="primary" @click="loadSection(section.key)">{{ $t('ui.common.actions.retry') }}</el-button>
            </div>
            <el-carousel
                v-else-if="section.items.length"
                height="66px"
                direction="vertical"
                :interval="3500"
                :autoplay="!reducedMotion && section.items.length > cardsPerPage"
                indicator-position="none"
            >
                <el-carousel-item v-for="(items, index) in pages(section.items)" :key="index">
                    <div class="m-highlight-row">
                        <router-link
                            v-for="item in items"
                            :key="item.id"
                            class="u-highlight"
                            :to="{ name: 'view', params: { source_id: item.id } }"
                        >
                            <span class="u-highlight-title">
                                <LegacyIcon class="el-icon-medal" />
                                <span>{{ item.name }}</span>
                            </span>
                            <span class="u-highlight-desc">
                                <LegacyIcon class="el-icon-mic" />
                                <span>{{ item.post?.remark || $t('ui.knowledge.noDescription') }}</span>
                            </span>
                        </router-link>
                    </div>
                </el-carousel-item>
            </el-carousel>
            <div v-else class="u-state">{{ $t('ui.common.status.noRecords') }}</div>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "@/components/common/wiki-panel.vue";
import { getKnowledgeList } from "@/service/knowledge.js";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import { useMediaQuery } from "@vueuse/core";

export default {
    name: "KnowledgeHighlights",
    components: { WikiPanel },
    setup() {
        return {
            reducedMotion: useMediaQuery("(prefers-reduced-motion: reduce)"),
        };
    },
    data() {
        return {
            sections: [
                { key: 'hot', title: 'ui.knowledge.popularKnowledge', icon: 'el-icon-notebook-1', items: [], loading: true, error: false },
                { key: 'newest', title: 'ui.knowledge.newestKnowledge', icon: 'el-icon-notebook-2', items: [], loading: true, error: false },
            ],
        };
    },
    computed: {
        cardsPerPage() {
            return 3;
        },
    },
    methods: {
        pages(items) {
            const result = [];
            for (let i = 0; i < items.length; i += this.cardsPerPage) result.push(items.slice(i, i + this.cardsPerPage));
            return result;
        },
        async loadSection(key) {
            const section = this.sections.find((item) => item.key === key);
            section.loading = true;
            section.error = false;
            try {
                if (key === 'newest') {
                    const response = await getKnowledgeList({ page: 1, per: 6 });
                    section.items = response.data.data?.list || [];
                } else {
                    const response = await getStatRank('knowledge', 'views', 6, '7days');
                    const ids = [...new Set((response.data || []).map((item) => /^knowledge-(\d+)$/.exec(item.name)?.[1]).filter(Boolean))];
                    const results = await Promise.allSettled(ids.map((id) => wiki.get({ type: 'knowledge', id }, { client: null })));
                    if (results.length && results.every((result) => result.status === 'rejected')) throw new Error('Knowledge rank details unavailable');
                    section.items = results.flatMap((result) => {
                        if (result.status !== 'fulfilled') return [];
                        const data = result.value.data.data;
                        return data?.source?.id && data.post ? [{ ...data.source, post: data.post }] : [];
                    });
                }
            } catch {
                section.error = true;
                section.items = [];
            } finally {
                section.loading = false;
            }
        },
    },
    created() {
        this.loadSection('hot');
        this.loadSection('newest');
    },
};
</script>

<style lang="less" scoped>
.m-knowledge-highlights {
    .m-highlight-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
    }

    .u-highlight {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 3px;
        min-width: 0;
        height: 66px;
        box-sizing: border-box;
        padding: 8px 12px;
        border: 1px solid #d7dae1;
        border-left: 5px solid @v4primary;
        border-radius: 5px;
        background: #f5f7fa;
        color: #3d454d;

        &:hover {
            background: #f5f3ff;
            color: @v4primary;
        }

        &:focus-visible {
            outline: 2px solid @v4primary;
            outline-offset: -2px;
        }
    }

    .u-highlight-title,
    .u-highlight-desc {
        display: flex;
        align-items: center;
        gap: 7px;
        line-height: 20px;

        > span {
            min-width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: clip;
        }

        > .legacy-icon {
            flex-shrink: 0;
        }
    }

    .u-highlight-title {
        font-size: 13px;
        font-weight: 500;
    }
    .u-highlight-desc {
        font-size: 12px;
        font-weight: 400;
        color: #9298a3;
        line-height: 18px;
    }
    .u-state { min-height: 66px; color: #999; font-size: 13px; }

    @media screen and (max-width: @phone) {
        .m-highlight-row {
            grid-template-columns: minmax(0, 1fr);
            gap: 8px;
        }
    }
}
</style>
