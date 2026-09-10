<template>
    <div class="m-knowledge-panel m-knowledge-home-section">
        <div class="m-title">
            <span class="u-title-left">
                <LegacyIcon class="el-icon-postcard" /><span> {{ $t("ui.knowledge.terminology") }}</span>
            </span>
            <router-link class="u-wiki-more" :to="{ name: 'normal', params: { type_slug: 'jargon' } }">{{ $t("ui.common.actions.more") }}</router-link>
        </div>
        <div class="m-panel m-jargon">
            <router-link
                v-for="item in list"
                :key="item.id"
                class="u-jargon"
                :to="{ name: 'view', params: { source_id: item.id } }"
            >
                <LegacyIcon class="u-icon el-icon-collection-tag" />
                <span class="u-name">{{ item.name }}</span>
            </router-link>
        </div>
    </div>
</template>
<script>
import { getKnowledgeList } from "@/service/knowledge.js";
export default {
    name: "Jargon",
    props: [],
    data: function () {
        return {
            list: "",
        };
    },
    computed: {},
    watch: {},
    methods: {
        getJargon: function () {
            getKnowledgeList({
                type: "jargon",
                per: 48,
            }).then((res) => {
                this.list = res.data.data?.list || [];
            });
        },
    },
    created: function () {
        this.getJargon();
    },
};
</script>
<style lang="less" scoped>
.m-jargon {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 2px 8px;
    padding: 8px;
    border: 1px solid #eceef4;
    border-radius: 8px;
    background: #fafbfc;

    .u-jargon {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        min-width: 0;
        padding: 5px 8px;
        border-radius: 6px;
        color: #596170;
        font-size: 13px;
        line-height: 20px;
        transition: color 0.16s, background-color 0.16s;

        .u-icon {
            flex-shrink: 0;
            margin-top: 3px;
            color: #a6acb5;
        }

        .u-name {
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: clip;
        }

        &:hover {
            background: #f5f3ff;
            color: @v4primary;

            .u-name {
                text-decoration: none;
            }
        }

        &:focus-visible {
            outline: 2px solid #a6acb5;
            outline-offset: -2px;
        }
    }
}

@media screen and (max-width: @phone) {
    .m-jargon {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px;
        padding: 8px;
    }
}
</style>
