<template>
    <nav class="m-nav">
        <div class="m-menus-panel">
            <el-tree
                :data="maps"
                :props="defaultProps"
                node-key="id"
                ref="tree"
                :indent="42"
                lazy
                :load="loadNode"
            >
                <template #default="{ node, data }">
                    <span v-if="!node.isLeaf" class="el-tree-node__label">
                        <span class="u-name" v-text="data.name"></span>
                        <em v-if="data.count" class="u-count" v-text="`(${data.count})`"></em>
                    </span>
                    <router-link v-else class="el-tree-node__label" :to="menuLink(data, node)">
                        <span class="u-leaf-name" v-text="data.name" :title="data.name"></span>
                        <em v-if="data.count" class="u-count" v-text="`(${data.count})`"></em>
                    </router-link>
                </template>
            </el-tree>
        </div>
    </nav>
</template>

<script>
import { getKnowledgeMenus, getKnowledgeCount, getKnowledgeList } from "@/service/knowledge.js";
import { each } from "lodash";
import { getCalendarCount } from "@/service/calendar";

export default {
    name: "Nav",
    components: {},
    data: function () {
        return {
            active: "knowledge",
            maps: [],
            defaultProps: {
                children: "children",
                label: "name",
                isLeaf: "leaf",
            },
        };
    },
    computed: {
    },
    methods: {
        // 数据加载
        init: function () {
            // 通识
            this.loadKnowledge();
        },
        async loadNode(node, resolve) {
            const { level, data } = node;

            if (level === 0) {
                return resolve(this.maps);
            }

            const res = await getKnowledgeList({ type: data.id, _no_page: 1 });

            let children = res?.data?.data;

            children = children.map((item) => {
                return {
                    ...item,
                    leaf: true,
                };
            });

            if (children?.length) {
                resolve(children);
            } else {
                resolve([]);
            }
        },
        loadKnowledge: async function () {
            // 加载通识子类统计
            const data = await getKnowledgeCount();
            const res = await getKnowledgeMenus();
            // const list = await getKnowledgeList({ _no_page: 1 });

            let knowledgeMenus = res?.data?.data;
            const maps = [];

            each(knowledgeMenus, (item, key) => {
                const _item = data.data.data?.find((i) => i.type == item.name);
                maps.push({
                    id: item.name,
                    name: item.label,
                    count: _item.count,
                    children: [],
                    leaf: false,
                });
            });

            this.maps = maps;
        },
        loadCalendarCount: function (year) {
            getCalendarCount({ year }).then((res) => {
                const currentYear = this.data.calendar.children.find((child) => child.key == year);

                res.data.forEach((item) => {
                    const month = currentYear.children.find((currentMonth) => currentMonth.month == item.month);

                    if (month) {
                        month.count = item.count;
                    }
                });
            });
        },
        menuLink(data, node) {
            return { path: `/view/${data.id}` };
        },
    },
    created: function () {
        this.init();
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/knowledge/nav.less";
</style>
