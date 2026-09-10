<template>
    <nav class="m-nav">
        <div class="m-nav-header">
        <role-select v-model="role" @list-loaded="onRolesLoaded">
            <template #tip>
                <el-tooltip v-if="role && Number(role.jx3id) === 0" class="item" effect="dark" :content="$t('ui.common.role.virtualTip')" placement="top">
                    <a href="/tool/74559" target="_blank" rel="noopener noreferrer" @click.stop><LegacyIcon class="el-icon-warning-outline" /></a>
                </el-tooltip>
                <a v-else-if="role" href="/tool/74559" target="_blank" rel="noopener noreferrer" :aria-label="$t('ui.quest.roleHelp')" @click.stop>
                    <el-icon><Link /></el-icon>
                </a>
            </template>
        </role-select>
        <el-input class="u-keyword" v-model="keyword" :placeholder="$t('ui.quest.navSearchPlaceholder')" clearable @keydown.enter="searchQuests">
            <template #suffix>
                <button class="u-nav-search" type="button" :aria-label="$t('ui.common.actions.search')" @click="searchQuests">
                    <el-icon><Search /></el-icon>
                </button>
            </template>
        </el-input>
        <div v-if="role" class="m-filters">
            <el-checkbox v-model="uncompleted" :label="$t('ui.quest.onlyUnfinished')" border size="small"></el-checkbox>
            <div class="u-total">
                <!-- numTotal -->
                <b class="u-completed-num">{{ uncompleted ? total - completedNum : completedNum }}</b>
                <span class="u-total-num"> / {{ total }}</span>
            </div>
        </div>
        </div>
        <div class="m-menus-panel">
            <router-link class="u-quest-home" :class="{ 'is-active': $route.name === 'home' }" :to="{ name: 'home' }" @click="goHome">
                <el-icon><CaretRight /></el-icon>
                <span>{{ $t("ui.quest.navHome") }}</span>
            </router-link>
            <el-tree
                :data="maps"
                :props="defaultProps"
                node-key="id"
                @node-click="clickNode"
                ref="tree"
                :indent="42"
            >
                <template #default="{ node, data }">
                    <span v-if="!node.isLeaf" class="el-tree-node__label">
                        <span class="u-name" v-text="data.name"></span>
                        <em
                            v-if="data.count"
                            class="u-count"
                            v-text="`(${uncompleted ? data.count - data.completed : data.completed}/${data.count})`"
                        ></em>
                    </span>
                    <router-link v-else class="el-tree-node__label" :to="menuLink(data, node)">
                        <span class="u-name" v-text="data.name"></span>
                        <em
                            v-if="data.count"
                            class="u-count"
                            v-text="`(${uncompleted ? data.count - data.completed : data.completed}/${data.count})`"
                        ></em>
                    </router-link>
                </template>
            </el-tree>
        </div>
    </nav>
</template>

<script>
import RoleSelect from "@/components/common/role-select.vue";
import { CaretRight, Link, Search } from "@element-plus/icons-vue";
import { getQuestMaps, listUserQuest } from "@/service/quest";
import questType from "@/assets/data/quest-type.json";
import bus from "@/store/bus";
import { mapState } from "vuex";

export default {
    name: "Nav",
    components: { RoleSelect, CaretRight, Link, Search },
    data: () => ({
        keyword: "",
        maps: [],
        questType,
        defaultProps: {
            children: "children",
            label: "name",
        },

        role: null,
        uncompleted: false,
    }),
    computed: {
        ...mapState({
            completed: (state) => state.completedQuests,
        }),
        client() {
            return this.$store.state.client;
        },
        total() {
            return this.maps.reduce((a, b) => a + b.count, 0);
        },
        completedNum() {
            return this.completed.length;
        },
    },
    watch: {
        "$route.name"(name) {
            if (name === "home") {
                this.$refs.tree?.setCurrentKey(null);
            }
        },
        uncompleted(val) {
            this.$store.commit("SET_STATE", {
                onlyNotCompleted: val,
            });
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
        goHome() {
            this.$refs.tree?.setCurrentKey(null);
            this.clickNode(null, { isLeaf: true });
        },
        searchQuests(event) {
            if (event?.isComposing || event?.keyCode === 229) return;
            const keyword = this.keyword.trim();
            if (!keyword) return;
            this.$refs.tree?.setCurrentKey(null);
            this.$router.push({ name: "result", query: { keyword } });
            this.clickNode(null, { isLeaf: true });
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
            getQuestMaps({client: this.client}).then((res) => {
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
                    bus.emit("toggleLeftSide", false);
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
