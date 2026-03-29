<template>
    <div class="m-knowledge-panel">
        <div class="m-title">
            <span class="u-text"><LegacyIcon class="el-icon-orange" /><span> 玩法指南</span></span>
            <router-link class="u-more" to="/type/game">查看更多 &raquo;</router-link>
        </div>
        <div class="m-guide m-panel">
            <div v-for="(item, index) in data" :key="index" class="u-guide">
                <div class="u-title">{{ item.label }}</div>
                <div class="u-list">
                    <a
                        class="u-label"
                        v-for="(menu, key) in item.menus"
                        :key="key"
                        :href="menu.link"
                        v-html="menu.label"
                    ></a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getMenuGroups } from "@/service/knowledge.js";
export default {
    name: "Guide",
    data: function () {
        return {
            data: "",
        };
    },
    computed: {},
    watch: {},
    methods: {
        // 获取玩法指南
        getGuideData() {
            getMenuGroups({ key: ["guide-pve", "guide-pvx", "guide-pvp"].join(",") }).then((res) => {
                this.data = res.reduce((acc, cur) => {
                    acc[cur.name] = cur;
                    return acc;
                }, {});
            });
        },
    },
    created: function () {
        this.getGuideData();
    },
};
</script>

<style scoped lang="less">
.m-guide {
    .flex;
    background-color: #fff;
    border: 1px solid #e1e4e8;
    .r(5px);
    margin-bottom: 10px;
    .u-guide {
        width: 34%;
        border-right: 1px solid #eee;
        &:last-child {
            border-right: 0;
        }
        .u-title {
            .x;
            .lh(40px);
            .bold;
            background-color: #fafbfc;
            border-bottom: 1px solid #eee;
        }
        .u-list {
            .flex;
            .fz(13px);
            flex-wrap: wrap;
            padding: 20px;
            .u-label {
                flex-shrink: 0;
                min-width: 30%;
                .mb(5px);
                .mr(10px);
                .color(#0366d6,@pink);
                span {
                    color: #888;
                    margin-left: 5px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
