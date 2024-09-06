<template>
    <nav class="m-nav">
        <role-select v-model="role" @list-loaded="onRolesLoaded">
            <template #tip>
                <el-tooltip class="item" effect="dark" content="虚拟角色即为魔盒账号本身，可自定义进度" placement="top">
                    <a href="/tool/74559" target="_blank"><i class="el-icon-warning-outline"></i></a>
                </el-tooltip>
            </template>
        </role-select>
        <el-input class="u-keyword" size="small" v-model="keyword" placeholder="输入关键字"> </el-input>
        <div class="m-menus-panel">
            <el-tree
                :data="maps"
                :props="defaultProps"
                :filter-node-method="filterNode"
                node-key="id"
                @node-click="clickNode"
                ref="tree"
                :indent="42"
            >
                <template slot-scope="{ node, data }">
                    <span v-if="!node.isLeaf" class="el-tree-node__label">
                        <span class="u-name" v-text="data.name"></span>
                        <em v-if="data.count" class="u-count" v-text="`(${data.completed}/${data.count})`"></em>
                    </span>
                    <router-link v-else class="el-tree-node__label" :to="menuLink(data, node)">
                        <span class="u-name" v-text="data.name"></span>
                        <em v-if="data.count" class="u-count" v-text="`(${data.completed}/${data.count})`"></em>
                    </router-link>
                </template>
            </el-tree>
        </div>
    </nav>
</template>

<script>
import RoleSelect from "@/components/common/role-select.vue";
import { getQuestMaps, listUserQuest } from "@/service/quest";
import questType from "@/assets/data/quest-type.json";
import Bus from "@jx3box/jx3box-common-ui/service/bus";
import { mapState } from "vuex";

export default {
    name: "Nav",
    components: { RoleSelect },
    data: () => ({
        keyword: "",
        maps: [],
        questType,
        defaultProps: {
            children: "children",
            label: "name",
        },

        role: "",
    }),
    computed: {
        ...mapState({
            completed: (state) => state.completedQuests,
        }),
        client() {
            return this.$store.state.client;
        },
    },
    watch: {
        keyword(val) {
            this.$refs.tree.filter(val);
        },
        role(val) {
            this.$store.commit("SET_ROLE", val);
            // 加载该角色的列表
            listUserQuest(this.role.ID).then((res) => {
                const data = res.data?.data || [];
                this.$store.commit("SET_COMPLETED_QUESTS", data);
                localStorage.setItem("quests_last_sync", this.role.jx3id);
            });
        },
        completed() {
            this.updateNav();
        },
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        menuLink(menu, node) {
            return { name: "result", query: menu.id ? { map_id: menu.id } : {} };
        },
        updateNav() {
            this.maps.forEach((item) => {
                let group_count = 0;
                if (!item.children) return;
                item.children.forEach((child) => {
                    if (!child.quests) return;
                    child.completed = child.quests.filter((id) => this.completed.includes(id)).length;
                    group_count += child.completed;
                });
                item.completed = group_count;
            });
        },
        loadMaps() {
            getQuestMaps().then((res) => {
                const mapObj = res.data?.data || {};
                const maps = [];
                for (let key in mapObj) {
                    if (questType[key]) {
                        const group = {
                            id: key,
                            name: questType[key],
                            children: mapObj[key]
                                .filter((item) => item.count > 0)
                                .map((item) => ({ ...item, completed: 0 })),
                            count: mapObj[key].map((item) => item.count).reduce((a, b) => a + b),
                            completed: 0,
                        };
                        if (group.count > 0) {
                            maps.push(group);
                        }
                    }
                }
                this.maps = maps;
            });
        },
        clickNode(data, node) {
            // 移动端收起边栏
            if (window.innerWidth < 1024) {
                if (node.isLeaf) {
                    Bus.$emit("toggleLeftSide", false);
                }
            }
        },
        onRolesLoaded(list, virtualRole) {
            const quests_last_sync_jx3id = localStorage.getItem("quests_last_sync");
            if (quests_last_sync_jx3id && quests_last_sync_jx3id !== "0") {
                this.role = list.find((item) => item.jx3id == quests_last_sync_jx3id) || "";
            } else {
                this.role = virtualRole;
            }
        },
    },
    mounted() {
        this.loadMaps();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/quest/nav.less";
</style>
