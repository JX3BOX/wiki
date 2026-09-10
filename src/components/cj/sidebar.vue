<template>
    <div class="m-left-side">
        <div class="m-nav-header">
            <role-select v-model="currentRole" @list-loaded="onRoleLoaded">
                <template #tip>
                    <el-tooltip
                        v-if="currentRole && !isVirtual"
                        class="item"
                        effect="dark"
                        :content="$t('ui.achievement.syncTip')"
                        placement="top"
                    >
                        <a href="/tool/74559" target="_blank" rel="noopener noreferrer" :aria-label="$t('ui.achievement.syncTip')" @click.stop><el-icon><Link /></el-icon></a>
                    </el-tooltip>
                    <el-tooltip
                        v-else-if="currentRole"
                        class="item"
                        effect="dark"
                        :content="$t('ui.common.role.virtualTip')"
                        placement="top"
                    >
                        <a href="/tool/74559" target="_blank" rel="noopener noreferrer" @click.stop><LegacyIcon class="el-icon-warning-outline" /></a>
                    </el-tooltip>
                </template>
            </role-select>

            <el-select v-model="selectedGeneral">
                <el-option v-for="type in menu_types" :key="type.value" :label="type.label" :value="type.value"></el-option>
            </el-select>
            <div v-if="currentRole" class="m-filters">
                <el-checkbox v-model="uncompleted" :label="$t('ui.achievement.onlyUnfinished')" border size="small"></el-checkbox>
                <div class="u-total" v-if="[1, 2].includes(treeGeneral)">
                    <!-- numTotal -->
                    <b class="u-completed-num">{{ uncompleted ? achievementTotal - completedNum : completedNum }}</b>
                    <span class="u-total-num"> / {{ achievementTotal }}</span>
                </div>
            </div>
        </div>
        <div class="m-menus">
            <router-link class="u-cj-home" :class="{ 'is-active': $route.name === 'home' }" :to="{ name: 'home' }" @click="goHome">
                <el-icon><CaretRight /></el-icon>
                <span>{{ $t("ui.achievement.navHome") }}</span>
            </router-link>
            <el-tree
                class="filter-tree"
                :data="menus"
                node-key="id"
                :indent="42"
                :expand-on-click-node="false"
                @node-click="clickNode"
                :filter-node-method="filterNode"
                ref="tree"
            >
                <template #default="{ data }">
                    <router-link
                        class="el-tree-node__label"
                        :to="menu_url(data)"
                    >
                        <span class="u-name" v-text="data.name"></span>
                        <em v-if="getMenuAchievementCount(data)" class="u-count">
                            (<span v-if="currentRole">{{
                                `${
                                    uncompleted
                                        ? Math.max(0, getMenuAchievementCount(data) - getMenuCompleted(data))
                                        : getMenuCompleted(data)
                                }/`
                            }}</span>
                            <span>{{ getMenuAchievementCount(data) }}</span>)
                        </em>
                    </router-link>
                </template>
            </el-tree>
        </div>
    </div>
</template>

<script>
import { getMenus, getRoleGameAchievements, getVirtualRoleAchievements } from "@/service/achievement";
import { CaretRight, Link } from "@element-plus/icons-vue";
import RoleSelect from "@/components/common/role-select.vue";
import bus from "@/store/bus";
import User from "@jx3box/jx3box-common/js/user";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import omit from "lodash/omit";
import { collectMenuAchievementIds } from "@/utils/achievement-statistics";

const MENU_TYPE_KEYS = Object.freeze({
    1: "ui.achievement.menuTypes.1",
    2: "ui.achievement.menuTypes.2",
    3: "ui.achievement.menuTypes.3",
});

export default {
    name: "Sidebar",
    props: ["sidebar"],
    components: {
        RoleSelect,
        CaretRight,
        Link,
    },
    computed: {
        menu_types() {
            return [1, 2].map((value) => ({
                value,
                label: this.$t(MENU_TYPE_KEYS[value]),
            })).concat(this.staticMenus.map((item) => ({ value: item.router, label: item.name })));
        },
        staticMenus() {
            return [
                { name: this.$t("ui.achievement.newest"), id: "newest", router: "newest" },
                { name: this.$t("ui.achievement.waiting"), id: "waiting", router: "waiting" },
                { name: this.$t("ui.achievement.adventure"), id: "adventure", router: "adventure" },
                { name: this.$t("ui.achievement.rare"), id: "rare", router: "rare" },
            ];
        },
        treeGeneral() {
            return this.sidebar.general === 2 ? 2 : 1;
        },
        generalTotal() {
            return this.$store.state.generalTotal;
        },
        armorTotal() {
            return this.$store.state.armorTotal;
        },
        achievementTotal() {
            let total = this.total;
            if (this.treeGeneral === 1) {
                total = this.generalTotal;
            }
            if (this.treeGeneral === 2) {
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
        achievementMetadata() {
            return this.$store.state.achievementMetadata;
        },
        selectedGeneral: {
            get() {
                return this.staticMenus.some((item) => item.router === this.$route.name)
                    ? this.$route.name
                    : this.treeGeneral;
            },
            set(value) {
                if (this.staticMenus.some((item) => item.router === value)) {
                    this.$router.push({ name: value });
                    return;
                }
                this.$store.commit("SET_STATE", {
                    key: "sidebar",
                    value: { ...this.sidebar, general: value, sub: null, detail: null },
                });
                this.$router.push({ name: value === 2 ? "top_five" : "home" });
            },
        },
        isVirtual() {
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
                return this.getMenuAchievementCount(data);
            });
            return numList.reduce((acc, cur) => {
                return acc + cur;
            }, 0);
        },
    },
    data() {
        return {
            menus_cache: [],
            menus: [],
            old_node: null,
            roleList: [],
            currentRole: null,
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
    watch: {
        // 鐩戝惉$route 褰撲笉澶勪簬normal璺敱鐨勬椂鍊?鍙栨秷灞曞紑 tree
        $route(to) {
            if (to.name === "home") this.$refs.tree?.setCurrentKey(null);
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
                if (that.sidebar.general) that.get_menus(this.treeGeneral);
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
                    this.currentRole = null;
                    this.$store.commit("SET_STATE", { key: "role", value: null });
                    this.$store.commit("SET_STATE", { key: "wiki_last_sync", value: 0 });
                    localStorage.setItem("wiki_last_sync", 0);
                    // this.$store.commit("SET_STATE", { key: "cj-roles", value: [], isSession: true });
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
            },
        },
    },
    methods: {
        goHome() {
            this.$refs.tree?.setCurrentKey(null);
            this.old_node = null;
            if (window.innerWidth < 1024) bus.emit("toggleLeftSide", false);
        },
        getMenuAchievementIds(data) {
            return collectMenuAchievementIds(data).filter((id) => {
                const item = this.achievementMetadata[id];
                return item?.visible && item.general === this.treeGeneral;
            });
        },
        getMenuAchievementCount(data) {
            return this.getMenuAchievementIds(data).length;
        },
        getMenuCompleted(data, achievementsVirtual, achievements) {
            const list = this.isVirtual
                ? achievementsVirtual || this.achievementsVirtual
                : achievements || this.achievements;
            const completedIds = new Set((list || []).map(String));
            return this.getMenuAchievementIds(data).filter((id) => completedIds.has(id)).length;
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
                            name: that.treeGeneral == 2 ? "top_five" : "normal",
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

            getMenus({ general, client: this.$store.state.client }).then(
                (data) => {
                    data = data.data;
                    if (data.code === 200) {
                        let menus = [];
                        for (let i in data.data.menus) menus.push(data.data.menus[i]);
                        if (general === that.treeGeneral) that.menus = menus;

                        // 缂撳瓨鑿滃崟鏁版嵁
                        that.menus_cache[general] = menus;

                        // 灞曞紑鑿滃崟
                        that.expand_menu();
                    }
                },
                () => {
                    if (general === that.treeGeneral) that.menus = [];
                }
            );
        },
        expand_menu() {
            let that = this;
            that.$nextTick(function () {
                if (that.$route.name === "home") {
                    that.$refs.tree?.setCurrentKey(null);
                    return;
                }
                // 榛樿灞曞紑褰撳墠鑿滃崟
                let key = "";
                if (["normal", "top_five"].includes(that.$route.name)) {
                    const { sub, detail } = that.$route.params;
                    key = sub ? sub + (detail ? `-${detail}` : "") : "";
                }
                if (!key) that.$refs.tree?.setCurrentKey(null);

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
            switch (this.treeGeneral) {
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

            }
            return null;
        },
        onRoleLoaded(list, virtualRole) {
            const wiki_last_sync_jx3id = localStorage.getItem("wiki_last_sync");
            if (wiki_last_sync_jx3id && wiki_last_sync_jx3id !== "0") {
                this.currentRole = list.find((item) => item.jx3id == wiki_last_sync_jx3id) || null;
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
