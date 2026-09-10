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
        .fz(16px, 24px);
        font-weight: 600;
        color: #454d5a;
        margin: 0;
        padding: 0 0 10px;
        border-bottom: 1px solid #ebeef5;
        .flex;
        align-items: center;
    }

    .u-icon {
        .h(20px);
        .y(top);
        fill: @bg-black;
        .mr(5px);
    }

    .el-tabs__header {
        margin: 8px 0 12px;
    }

    .el-tabs__nav-wrap {
        padding: 4px;
        border-radius: 12px;
        background: #f2f3f7;

        &.is-scrollable {
            padding-right: 22px;
            padding-left: 22px;
        }
    }

    .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
    }

    .el-tabs__nav {
        display: flex;
        flex: 1;
        gap: 3px;
        border: 0;
    }

    .el-tabs__item,
    .el-tabs__item.is-top:nth-child(2),
    .el-tabs__item.is-top:last-child {
        flex: 1;
        justify-content: center;
        height: 28px;
        padding: 0 8px;
        border-radius: 9px;
        font-size: 12px;
        font-weight: 500;
        color: #858c99;
        transition: color 0.18s, background-color 0.18s, box-shadow 0.18s;

        &:hover {
            color: @v4primary;
            background: rgba(255, 255, 255, 0.55);
        }

        &.is-active {
            color: @v4primary;
            background: #fff;
            box-shadow: 0 1px 4px rgba(42, 34, 79, 0.1);
        }

        &:focus-visible {
            outline: 2px solid #b6a9ef;
            outline-offset: -2px;
        }
    }

    .el-tabs__active-bar,
    .el-tabs__nav-wrap::after {
        display: none;
    }

    .u-list {
        list-style: none;
        padding: 0;
        margin: 0;


        li {
            border-bottom: 1px solid #f0f1f5;
            &:last-child { border-bottom: 0; }
        }
        a:hover .u-name {
            color: @v4primary;
        }
    }

    .u-contributor {
        .flex;
        justify-content: space-between;
        align-items: center;
        padding: 7px 4px;
        gap: 10px;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.15s;

        &:hover {
            background-color: @bg-light;
        }
    }

    @h: 24px;
    .u-left {
        .flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
    }
    .u-order {
        flex-shrink: 0;
        background-color: #f3f4f7;
        display: inline-block;
        border-radius: 3px;
        font-size: 12px;
        line-height: 18px;
        width: 18px;
        height: 18px;
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
        .size(18px);
        flex-shrink: 0;
        .r(50%);
    }

    .u-name {
        .fz(12px);
        .lh(@h);
        color: #555d6b;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .u-count {
        .fz(11px, @h);
        flex-shrink: 0;
        font-style: normal;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
        color: @v4primary;
        .fr;
        .mr(2px);
    }
}
</style>
