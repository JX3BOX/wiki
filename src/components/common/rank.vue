<template>
    <div class="m-wiki-rank">
        <h2 class="m-title">
            <img class="u-icon" svg-inline src="@/assets/img/cj/rank.svg" />
            <span class="u-text">{{ $t("ui.common.rank") }}</span>
        </h2>
        <el-tabs v-model="activeTab">
            <el-tab-pane :label="tab.label" :name="tab.name" v-for="tab in tabs" :key="tab.name">
                <ul class="u-list">
                    <li v-for="(rank, k) in ranks" :key="k">
                        <a class="u-contributor" :href="rank.id ? authorLink(rank.id) : null">
                            <span class="u-left">
                                <span class="u-order" :class="k < 3 && `t${k + 1}`">{{ k + 1 }}</span>
                                <img class="u-avatar" :src="showAvatar(rank.avatar)" :alt="rank.nickname" />
                                <span class="u-name" v-text="rank.nickname"></span>
                            </span>
                            <em class="u-count">+ {{ rank.count }}</em>
                        </a>
                    </li>
                </ul>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getWikiRanking } from "@/service/wiki";
import { authorLink, showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "WikiRanks",
    props: {
        type: {
            type: String,
            default: "achievement",
        },
    },
    data() {
        return {
            ranks: [],
            activeTab: "achievement",
        };
    },
    computed: {
        tabs() {
            return [
                {
                    name: "achievement",
                    label: this.$t("ui.types.achievement"),
                },
                {
                    name: "item",
                    label: this.$t("ui.types.item"),
                },
                {
                    name: "quest",
                    label: this.$t("ui.types.quest"),
                },
                {
                    name: "knowledge",
                    label: this.$t("ui.types.knowledge"),
                },
                {
                    name: "skill",
                    label: this.$t("ui.types.skill"),
                },
            ];
        },
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        activeTab() {
            this.loadData();
        },
    },
    mounted() {
        this.loadData();
    },
    methods: {
        showAvatar,
        authorLink,
        loadData() {
            const params = {
                type: this.activeTab,
                client: this.client,
            };
            getWikiRanking(params).then((res) => {
                this.ranks = (res.data?.data || []).slice(0, 10);
            });
        },
    },
};
</script>

<style lang="less">
.m-wiki-rank {
    padding: 15px;
    .m-title {
        .fz(18px, 24px);
        margin: 0;
        padding: 0 0 5px 0;
        border-bottom: 1px solid #ebeef5;
        .flex;
        align-items: center;
    }

    .u-icon {
        .h(24px);
        .y(top);
        fill: @bg-black;
        .mr(5px);
    }

    .u-list {
        list-style: none;
        padding: 0;
        margin: 0;

        max-height: 360px;
        overflow: hidden auto;
        padding-right: 5px;
        .scrollbar();

        li {
            border-bottom: 1px dotted #eee;
        }
        a:hover .u-name {
            color: @v4primary;
        }
    }

    .u-contributor {
        .flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;

        &:hover {
            background-color: @bg-light;
        }
    }

    @h: 24px;
    .u-left {
        .flex;
        align-items: center;
        gap: 5px;
    }
    .u-order {
        background-color: #f6f8fa;
        display: inline-block;
        border-radius: 3px;
        font-size: 12px;
        line-height: 16px;
        width: 16px;
        height: 16px;
        color: #888;
        vertical-align: middle;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
        &.t1 {
            color: #fff;
            background-color: #fc3c3c;
        }
        &.t2 {
            color: #fff;
            background-color: #fba524;
        }
        &.t3 {
            color: #fff;
            background-color: #2A65CF;
        }
    }
    .u-avatar {
        .size(14px);
        .r(50%);
    }

    .u-name {
        .fz(12px);
        .lh(@h);
        color: #555;
    }

    .u-count {
        .fz(10px, @h);
        color: @v4primary;
        .fr;
        .mr(2px);
    }
}
</style>
