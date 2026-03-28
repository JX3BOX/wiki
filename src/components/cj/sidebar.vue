<template>
    <div class="m-left-side">
        <role-select v-model="currentRole" @list-loaded="onRoleLoaded">
            <template #tip>
                <el-tooltip
                    v-if="!isVirtual && !isSync"
                    class="item"
                    effect="dark"
                    content="请先在游戏中同步成就"
                    placement="top"
                >
                    <a href="/tool/74559" target="_blank"><i class="el-icon-warning-outline"></i></a>
                </el-tooltip>
                <el-tooltip
                    v-else
                    class="item"
                    effect="dark"
                    content="虚拟角色即为魔盒账号本身，可自定义进度"
                    placement="top"
                >
                    <a href="/tool/74559" target="_blank"><i class="el-icon-warning-outline"></i></a>
                </el-tooltip>
            </template>
        </role-select>

        <el-select v-model="sidebar.general" size="small">
            <el-option v-for="type in menu_types" :key="type.value" :label="type.label" :value="type.value"></el-option>
        </el-select>
        <div v-if="currentRole" class="m-filters">
            <el-checkbox v-model="uncompleted" label="只看未完成" border size="small"></el-checkbox>
            <div class="u-total" v-if="[1, 2].includes(sidebar.general)">
                <!-- numTotal -->
                <b class="u-completed-num">{{ uncompleted ? achievementTotal - completedNum : completedNum }}</b>
                <span class="u-total-num"> / {{ achievementTotal }}</span>
            </div>
        </div>
        <div class="m-menus">
            <el-tree
                class="filter-tree"
                :class="{ other: [3].includes(sidebar.general) }"
                :data="menus"
                node-key="id"
                :expand-on-click-node="false"
                @node-click="clickNode"
                :filter-node-method="filterNode"
                ref="tree"
            >
                <template #default="{ data }">
                    <router-link class="el-tree-node__label" :to="menu_url(data)">
                        <span class="u-name" v-text="data.name"></span>
                        <em v-if="data.achievements_count" class="u-count">
                            (<span v-if="currentRole">{{
                                `${
                                    uncompleted
                                        ? data.achievements_count +
                                          ~~data.own_achievements_count -
                                          getMenuCompleted(data)
                                        : getMenuCompleted(data)
                                }/`
                            }}</span>
                            <span>{{ `${data.achievements_count + ~~data.own_achievements_count}` }}</span
                            >)
                        </em>
                    </router-link>
                </template>
            </el-tree>
        </div>
    </div>
</template>

<script>
import { getMenus, getRoleGameAchievements, getVirtualRoleAchievements } from "@/service/achievement";
import RoleSelect from "@/components/common/role-select.vue";
import bus from "@/store/bus";
import User from "@jx3box/jx3box-common/js/user";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import { flattenDeep, cloneDeep, omit } from "lodash";
export default {
    name: "Sidebar",
    props: ["sidebar"],
    components: {
        RoleSelect,
    },
    data() {
        return {
            menus_cache: [],
            menus: [],
            old_node: null,
            menu_types: [
                { value: 1, label: "常规成就" },
                { value: 2, label: "五甲成就" },
                { value: 3, label: "其他板块" },
            ],

            roleList: [],
            currentRole: "",
            isLogin: User.isLogin(),
            uncompleted: false,
            virtualRole: {
                ...User.getInfo(),
                jx3id: 0,
                ID: ~~User.getInfo().uid,
            },
            isSync: false,
        };
    },
    computed: {
        generalTotal() {
            return this.$store.state.generalTotal;
        },
        armorTotal() {
            return this.$store.state.armorTotal;
        },
        achievementTotal() {
            let total = this.total;
            if (this.sidebar.general === 1) {
                total = this.generalTotal;
            }
            if (this.sidebar.general === 2) {
                total = this.armorTotal;
            }
            return total;
        },
        achievements() {
            return this.$store.state.achievements;
        },
        achievementsVirtual() {
            return this.$store.state.achievementsVirtual;
        },
        isVirtual() {
            // 鏄惁鏄櫄鎷熻鑹?- 榄旂洅璐﹀彿
            return !this.currentRole?.jx3id;
        },
        completedNum({ menus, achievementsVirtual, achievements }) {
            const completedNumList = menus.map((data) => {
                return this.getMenuCompleted(data, achievementsVirtual, achievements);
            });
            return completedNumList.reduce((acc, cur) => {
                return acc + cur;
            }, 0);
        },
        total({ menus }) {
            const numList = menus.map((data) => {
                return data.achievements_count + data.own_achievements_count;
            });
            return numList.reduce((acc, cur) => {
                return acc + cur;
            }, 0);
        },
    },
    watch: {
        // 鐩戝惉$route 褰撲笉澶勪簬normal璺敱鐨勬椂鍊?鍙栨秷灞曞紑 tree
        $route(to) {
            if (to.name !== "normal") {
                let all = this.$refs.tree.store._getAllNodes();
                for (let i = 0; i < all.length; i++) all[i].expanded = false;
            }
        },
        sidebar: {
            immediate: true,
            deep: true,
            handler(new_val, old_val) {
                let that = this;

                // 灞曞紑鑿滃崟
                that.expand_menu();

                // 寮傛鍔犺浇渚ц竟鏍忔暟鎹?
                if (that.sidebar.general) that.get_menus(this.sidebar.general);
            },
        },
        virtualRole: {
            immediate: true,
            deep: true,
            handler(virtualRole) {
                this.currentRole = virtualRole;
            },
        },
        currentRole: {
            deep: true,
            handler(val) {
                if (!val) return;
                localStorage.setItem("wiki_last_sync", val.jx3id || 0);
                this.$store.commit("SET_STATE", { key: "role", value: val });
                const { jx3id } = val;
                if (jx3id) {
                    this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: [] });
                    this.loadRoleAchievements(jx3id);
                } else {
                    if (jx3id === 0) {
                        // 铏氭嫙瑙掕壊
                        this.loadVirtualAchievements();
                    }
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
            },
        },
        uncompleted(bol) {
            this.$store.commit("SET_STATE", { key: "onlyUncompleted", value: bol });
        },
        isLogin: {
            immediate: true,
            handler(bol) {
                if (!bol) {
                    this.currentRole = "";
                    this.$store.commit("SET_STATE", { key: "role", value: "" });
                    this.$store.commit("SET_STATE", { key: "wiki_last_sync", value: 0 });
                    localStorage.setItem("wiki_last_sync", 0);
                    // this.$store.commit("SET_STATE", { key: "cj-roles", value: [], isSession: true });
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
            },
        },
    },
    methods: {
        getLastAchievement(achievements = []) {
            // 娓告垙瑙掕壊
            // 姣斿浼犲姛锛屽彧鍙栨渶鍚庝竴涓紶鍔?00娆＄殑ID浣滀负鏄惁瀹屾垚鐨勪緷鎹?
            return achievements.map((achievement) => {
                if (Array.isArray(achievement)) {
                    // 姣斿浼犲姛锛屽彧鍙栨渶鍚庝竴涓紶鍔?00娆＄殑ID浣滀负鏄惁瀹屾垚鐨勪緷鎹?
                    const lastOne = achievement?.[achievement.length - 1];
                    return lastOne;
                } else {
                    return achievement;
                }
            });
        },
        getMenuCompleted(data, achievementsVirtual, achievements) {
            const newData = cloneDeep(data);
            const newDataAchievements = this.isVirtual
                ? flattenDeep(newData.achievements)
                : this.getLastAchievement(newData.achievements);
            newData.all_achievements = newData.children
                ? Array.from(
                      new Set(
                          newDataAchievements.concat(
                              flattenDeep(
                                  newData.children.map((item) => {
                                      return this.isVirtual
                                          ? item.achievements
                                          : this.getLastAchievement(item.achievements);
                                  })
                              )
                          )
                      )
                  )
                : newDataAchievements;
            const list = this.isVirtual
                ? achievementsVirtual || this.achievementsVirtual
                : achievements || this.achievements;
            return newData.all_achievements.filter((item) => list.includes(item + ""))?.length;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        clickNode(data, node) {
            let that = this;
            // Sub鑿滃崟涓嬫棤鎴愬氨鏃讹紝榛樿鎵撳紑绗竴涓狣etail鑿滃崟
            let first_node = null;
            if (data.own_achievements_count === 0) {
                first_node = node.childNodes[0];
                if (first_node) {
                    setTimeout(function () {
                        that.$router.push({
                            name: that.sidebar.general == 2 ? "top_five" : "normal",
                            params: {
                                sub: first_node.data.sub,
                                detail: first_node.data.detail,
                            },
                            query: omit(that.$route.query, "page"),
                        });
                    }, 100);
                    this.$refs.tree.store.setCurrentNode(first_node);
                }
            }

            // 灞曞紑/鏀惰捣
            let _node = first_node ? first_node : node;
            if (node.expanded !== true) {
                node.expanded = true;
            } else if (this.old_node == _node) {
                node.expanded = false;
            }

            // 璁板綍涓婁竴涓妭鐐?
            this.old_node = _node;

            // 绉诲姩绔敹璧疯竟鏍?
            if (window.innerWidth < 1024) {
                if (node.isLeaf) {
                    bus.emit("toggleLeftSide", false);
                }
            }
        },
        get_menus(general) {
            let that = this;

            if (that.menus_cache[general]) {
                that.menus = that.menus_cache[general];
                return;
            }

            if (general == 3) {
                that.menus = [
                    { name: "最新成就", id: "newest", router: "newest" },
                    { name: "待攻略成就", id: "waiting", router: "waiting" },
                    // { name: "缁濈増鎴愬氨", id: "out_print", router: "out_print" },
                    { name: "奇遇成就", id: "adventure", router: "adventure" },
                    { name: "珍宠成就", id: "rare", router: "rare" },
                ];
                return;
            }

            // if (general === 4) {
            //     that.menus = [{ name: "瀹犵墿鎴愬氨", id: "rare", router: "rare" }];
            //     that.$router.push({ name: 'rare' })
            //     that.$refs.tree.setCurrentKey('rare')
            //     return;
            // }
            // if (general === 5) {
            //     that.menus = [{ name: "濂囬亣鎴愬氨", id: "adventure", router: "adventure" }];
            //     that.$router.push({ name: 'adventure' })
            //     // that.$refs.tree.setCurrentKey('adventure')
            //     return;
            // }

            getMenus({ general }).then(
                (data) => {
                    data = data.data;
                    if (data.code === 200) {
                        let menus = [];
                        for (let i in data.data.menus) menus.push(data.data.menus[i]);
                        that.menus = menus;

                        // 缂撳瓨鑿滃崟鏁版嵁
                        that.menus_cache[general] = menus;

                        // 灞曞紑鑿滃崟
                        that.expand_menu();
                    }
                },
                () => {
                    that.menus = false;
                }
            );
        },
        expand_menu() {
            let that = this;
            that.$nextTick(function () {
                // 榛樿灞曞紑褰撳墠鑿滃崟
                let key = "";
                if (that.sidebar.general != 3) {
                    let sub = that.sidebar.sub;
                    let detail = that.sidebar.detail;
                    key = sub + (detail ? `-${detail}` : "");
                } else {
                    key = that.sidebar.other;
                }

                if (key) {
                    let node = that.$refs.tree.store.getNode(key);
                    if (node) {
                        node.expanded = true;
                        if (node.parent) node.parent.expanded = true;
                        that.$refs.tree.store.setCurrentNode(node);
                        return;
                    }
                }
                // let all = that.$refs.tree.store._getAllNodes();
                // for (let i = 0; i < all.length; i++) all[i].expanded = false;
            });
        },
        menu_url(data) {
            switch (this.sidebar.general) {
                case 1:
                    return {
                        name: "normal",
                        params: { sub: data.sub, detail: data.detail },
                        query: omit(this.$route.query, ["page"]),
                    };
                case 2:
                    return {
                        name: "top_five",
                        params: { sub: data.sub, detail: data.detail },
                        query: omit(this.$route.query, ["page"]),
                    };
                case 3:
                    // case 4:
                    // case 5:
                    return { name: data.router, query: omit(this.$route.query, ["page"]) };
            }
            return null;
        },
        onRoleLoaded(list, virtualRole) {
            const wiki_last_sync_jx3id = localStorage.getItem("wiki_last_sync");
            if (wiki_last_sync_jx3id && wiki_last_sync_jx3id !== "0") {
                this.currentRole = list.find((item) => item.jx3id == wiki_last_sync_jx3id) || "";
            } else {
                this.currentRole = virtualRole;
                this.$store.commit("SET_STATE", { key: "role", value: virtualRole });
                this.loadVirtualAchievements();
            }
        },
        // 鑾峰彇瑙掕壊鎴愬氨鐘舵€?
        loadRoleAchievements(jx3id) {
            getRoleGameAchievements(jx3id).then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const jx3id = res.data?.data?.jx3id;
                this.isSync = !!jx3id; // 鏄惁鍦ㄦ父鎴忎腑鍚屾
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievements", value: list, isSession: true });
            });
        },
        showSchoolIcon,
        // 鑾峰彇铏氭嫙瑙掕壊鎴愬氨鍒楄〃
        loadVirtualAchievements() {
            if (!this.currentRole || this.currentRole.jx3id) return;
            getVirtualRoleAchievements().then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/left-side.less";
</style>

