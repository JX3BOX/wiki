<template>
    <div class="p-achievement-overview">
        <div class="m-overview-header">
            <!-- 资历、选中用户信息 -->
            <div class="m-header-info">
                <!-- 用户信息展示 -->
                <div
                    :style="{
                        opacity: currentRole ? 1 : 0.5,
                    }"
                    class="m-info-user"
                >
                    <span class="u-name"
                        >{{ currentRole.name }}
                        {{ currentRole.server && "·" }}
                        {{ currentRole.server }}</span
                    >
                    <img width="30" height="30" :src="showSchoolIcon(currentRole.mount)" alt="jx3logo" />
                    <el-dropdown trigger="click">
                        <div class="u-toggle-btn">
                            <div>
                                <span>切换角色</span>
                                <img src="@/assets/img/wiki/overview/toggle-user-icon.svg" alt="" />
                            </div>
                        </div>
                        <el-dropdown-menu class="m-role-dropdown" slot="dropdown">
                            <el-dropdown-item v-if="isLogin">
                                <div class="m-role-item" @click="onChangeRole(virtualRole)">
                                    <span>{{ virtualRole.name }}</span>
                                    <span>&lt;虚拟角色&gt;</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item v-for="role in roleList" :key="role.ID">
                                <div
                                    @click="onChangeRole(role)"
                                    class="m-role-item"
                                    :class="{
                                        active: role.jx3id === currentRole.jx3id,
                                    }"
                                >
                                    <span>{{ role.name }}</span>
                                    <span>{{ role.server }}</span>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <div v-if="viewAchievementsName" class="u-overview" @click="onSeeOverview">查看总览</div>
                </div>
                <!-- 资历展示 -->
                <div class="m-info-zl">
                    <div class="m-info-zl__info">
                        <div>
                            <span class="u-title">{{ viewAchievementsName || "总" }}资历：</span>
                            <img width="32" height="32" src="@/assets/img/wiki/overview/zl-logo.svg" alt="资历logo" />
                            <span class="u-number">{{ ownPointsCount }}</span>
                        </div>
                        <div class="u-rate">{{ totalProgress }}%</div>
                    </div>
                    <div class="m-info-zl__progress">
                        <div
                            class="u-active-progress"
                            :style="{
                                width: `${totalProgress}%`,
                                background: getCurrentProgressBg(totalProgress),
                            }"
                        ></div>
                    </div>
                </div>
            </div>
            <div class="m-info-avatar" v-if="viewAchievementsName">
                <img
                    class="u-achievement-icon"
                    height="70"
                    :src="require(`@/assets/img/wiki/overview/title/${viewAchievementsName}.png`)"
                    alt=""
                />
            </div>
            <!-- 头像 -->
            <div v-else class="m-info-avatar">
                <!-- TODO：头像边框 与 头像-->
                <img
                    class="u-avatar-border"
                    src="https://img.js.design/assets/img/667be113ba14aab13a28e7b6.png#d2f64fd0890db470e45ef6e665e83359"
                    alt="头像边框"
                />

                <img class="u-avatar-img" src="@/assets/img/wiki/overview/avatar_demo.svg" alt="门派头像" />
            </div>
        </div>
        <div class="m-overview-main">
            <!-- item -->
            <div class="m-cj-item" @click="onEnterCategory(item)" v-for="(item, i) in list" :key="i">
                <!-- 做边框 -->
                <img class="u-border" src="@/assets/img/wiki/overview/item-left-border.svg" alt="" />
                <div class="m-cj-wrapper">
                    <div class="m-cj-content">
                        <div class="u-cj-info">
                            <div class="u-name">{{ item.name }}</div>
                            <div class="u-rate">{{ getCurrentProgress(item.ownPoints, item.allPoints) }}%</div>
                        </div>
                        <div class="m-count-box">
                            <div class="m-count-inner">
                                <div class="u-item">
                                    <img
                                        width="14"
                                        height="14"
                                        src="@/assets/img/wiki/overview/cj-logo.svg"
                                        alt="成就logo"
                                    />
                                    <span>{{ item.ownAchievements.length }}/{{ item.allAchievements.length }}</span>
                                </div>
                                <div class="u-item">
                                    <img
                                        width="14"
                                        height="14"
                                        src="@/assets/img/wiki/overview/zl-logo.svg"
                                        alt="资历logo"
                                    />
                                    <span>{{ item.ownPoints }}/{{ item.allPoints }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 分类logo -->
                    <div class="u-logo" v-if="item.children">
                        <img height="70" :src="require(`@/assets/img/wiki/overview/item/${item.name}.png`)" alt="" />
                    </div>
                    <!-- 进度展示 -->
                    <div
                        class="u-progress"
                        :style="{
                            width: `${getCurrentProgress(item.ownPoints, item.allPoints)}%`,
                            background: getCurrentProgressBg(item.ownPoints, item.allPoints),
                        }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";

import {
    getAchievementPoints,
    getVirtualRoleAchievements,
    getRoleGameAchievements,
    getMenus,
} from "@/service/achievement";
import { getUserRoles } from "@/service/team";
export default {
    name: "wiki-achievement-overview",
    props: [],
    data: function () {
        return {
            achievementData: {},
            pointsData: {},
            list: [],
            roleList: [],
            currentRole: "",
            isLogin: User.isLogin(),
            virtualRole: {
                ...User.getInfo(),
                jx3id: 0,
                ID: ~~User.getInfo().uid,
            },
        };
    },
    computed: {
        viewAchievementsName() {
            return this.$store.state.viewAchievementsName;
        },

        // 总进度
        totalProgress() {
            return ((this.ownPointsCount / this.allPointsCount) * 100).toFixed(2);
        },
        // 总资历点数
        allPointsCount() {
            let count = 0;
            this.list.forEach((item) => {
                count += item.allPoints || 0;
            });
            return count;
        },
        // 我拥有的所有资历点数
        ownPointsCount() {
            let count = 0;
            this.list.forEach((item) => {
                count += item.ownPoints || 0;
            });
            return count;
        },
    },
    watch: {
        achievementData() {
            this.getRenderList();
        },
        pointsData() {
            this.getRenderList();
        },
        "$store.state.achievements": {
            deep: true,
            handler(val) {
                this.getRenderList();
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
                        // 虚拟角色
                        this.loadVirtualAchievements();
                    }
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
                this.getRenderList();
            },
        },
    },

    mounted() {
        this.loadData();
    },
    methods: {
        onChangeRole(role) {
            this.currentRole = role;
        },
        showSchoolIcon,
        onEnterCategory(data) {
            if (data.children) {
                this.$store.commit("SET_STATE", { key: "viewAchievementsName", value: data.name });
                this.getRenderList(data.children);
            }
        },
        onSeeOverview() {
            this.$store.commit("SET_STATE", { key: "viewAchievementsName", value: null });
            this.getRenderList();
        },
        loadData() {
            this.loadUserRoles();
            this.getList();
            this.getPoints();
        },
        getRenderList(data) {
            data = data ? data : this.achievementData;

            const list = Object.keys(data).map((key) => {
                const item = data[key];
                const allData = this.getAllachievementsData(item);
                return {
                    name: item.name,
                    allAchievements: allData.allAchievements,
                    ownAchievements: allData.ownAchievements,
                    children: item.children,
                    allPoints: allData.allPoints,
                    ownPoints: allData.ownPoints,
                };
            });
            this.list = list;
        },
        getCurrentProgress(own, all) {
            return ((own / all) * 100).toFixed(2);
        },
        getCurrentProgressBg(own, all) {
            let n = 0;
            if (!all) {
                n = own;
            } else {
                n = ((own / all) * 100).toFixed(2);
            }
            if (n > 66) {
                return `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(204, 184, 155, 1) 100%)`;
            } else if (n > 33) {
                return `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(191, 191, 191, 1) 100%)`;
            } else {
                return `linear-gradient(90deg, rgba(247, 247, 247, 1) 0%, rgba(204, 177, 175, 1) 100%)`;
            }
        },
        // 回调获取所有成就
        getAllachievementsData(
            data,
            allAchievements = [],
            ownAchievements = [],
            countData = { allPoints: 0, ownPoints: 0 }
        ) {
            // 我完成的成就
            const ownAllAchievements = this.$store.state.achievements;
            data.achievements.forEach((aItem) => {
                // 判断aItem是否是数组
                if (Array.isArray(aItem)) {
                    aItem.forEach((item) => {
                        if (this.pointsData[item]) {
                            countData.allPoints += this.pointsData[item];
                            allAchievements.push(item);
                            if (ownAllAchievements.includes(String(item))) {
                                countData.ownPoints += this.pointsData[item];
                                ownAchievements.push(item);
                            }
                        }
                    });
                } else {
                    if (this.pointsData[aItem]) {
                        countData.allPoints += this.pointsData[aItem];
                        allAchievements.push(aItem);
                        if (ownAllAchievements.includes(String(aItem))) {
                            countData.ownPoints += this.pointsData[aItem];
                            ownAchievements.push(aItem);
                        }
                    }
                }
            });

            if (data.children) {
                data.children.forEach((item) => {
                    this.getAllachievementsData(item, allAchievements, ownAchievements, countData);
                });
            }

            // 去重
            return {
                allAchievements: allAchievements,
                allPoints: countData.allPoints,
                ownAchievements: ownAchievements,
                ownPoints: countData.ownPoints,
            };
        },
        // 获取成就列表
        getList() {
            return getMenus({
                general: 1,
                client: "std",
            }).then((res) => {
                const data = res.data.data.menus;
                this.achievementData = data;
            });
        },
        // 获取成就对应点数
        getPoints() {
            return getAchievementPoints().then((res) => {
                const data = res.data.data.points;
                this.pointsData = data;
            });
        },
        // 获取用户角色列表
        loadUserRoles() {
            this.isLogin &&
                getUserRoles().then((res) => {
                    this.roleList = res.data?.data?.list || [];
                    const wiki_last_sync_jx3id = localStorage.getItem("wiki_last_sync");
                    if (wiki_last_sync_jx3id && wiki_last_sync_jx3id !== "0") {
                        this.currentRole = this.roleList.find((item) => item.jx3id == wiki_last_sync_jx3id) || "";
                    } else {
                        this.currentRole = this.virtualRole;
                        this.$store.commit("SET_STATE", { key: "role", value: this.virtualRole });
                        this.loadVirtualAchievements();
                    }
                });
        },
        // 获取角色成就状态
        loadRoleAchievements(jx3id) {
            getRoleGameAchievements(jx3id).then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const jx3id = res.data?.data?.jx3id;
                this.isSync = !!jx3id; // 是否在游戏中同步
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievements", value: list, isSession: true });
            });
        },
        // 获取虚拟角色成就列表
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

<style lang="less" scoped>
.p-achievement-overview {
    padding-top: 65px;
    width: 960px;
    .m-overview-header {
        .mb(18px);
        .flex;
        justify-content: space-between;
        gap: 48px;
        .m-header-info {
            flex: 1;
            .pt(42px);
            .m-info-user {
                .mb(8px);
                .flex;
                .h(35px);
                transition: 0.5s;
                align-items: center;
                color: rgba(255, 236, 204, 1);

                .u-name {
                    .fz(24px,35px);
                    .mr(8px );
                    .bold;
                }
                .u-toggle-btn {
                    .r(4px);
                    .size(96px, 28px);
                    .ml(36px);
                    .flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(191, 184, 172, 1);
                    color: #ffeccc;
                    gap: 4px;
                    cursor: pointer;
                    > div {
                        .flex;
                        align-items: center;
                        img {
                            .ml(4px);
                            width: 16px;
                            height: 16px;
                        }
                    }
                }
                .u-overview {
                    .fz(24px,35px);
                    .bold;
                    color: white;
                    margin-left: auto;
                    cursor: pointer;
                    text-decoration: underline;
                    position: relative;
                    bottom: -5px;
                }
            }
            .m-info-zl {
                background: rgba(247, 247, 247, 1);
                padding: 12px 8px;
                .m-info-zl__info {
                    .mb(8px);
                    .flex;
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    > div {
                        .flex;
                        align-items: center;
                    }
                    .u-title,
                    .u-number {
                        .fz(32px,47px);
                        .bold;
                    }
                    .u-number {
                        .ml(8px);
                        color: rgba(201, 146, 50, 1);
                    }
                    .u-rate {
                        .fz(24px,35px);
                        .bold;
                        color: rgba(148, 126, 93, 1);
                    }
                }
                .m-info-zl__progress {
                    position: relative;
                    .size(100%,12px);
                    background: white;
                    .u-active-progress {
                        position: absolute;
                        transition: 0.5s;
                        left: 0;
                        top: 0;
                        height: 100%;
                    }
                }
            }
        }
        .m-info-avatar {
            max-width: 205px;
            width: 205px;
            height: 200px;
            position: relative;
            .u-avatar-border {
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 2;
            }
            .u-achievement-icon {
                position: absolute;
                z-index: 1;
                width: 200px;
                height: 200px;
                border-radius: 100%;
                overflow: hidden;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
            .u-avatar-img {
                position: absolute;
                z-index: 1;
                width: 175px;
                height: 175px;
                border-radius: 100%;
                overflow: hidden;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    .m-overview-main {
        .grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(6, 1fr);
        height: 540px;
        overflow-y: scroll;
        row-gap: 24px;
        column-gap: 12px;
        .m-cj-item {
            .flex;
            .h(70px);
            cursor: pointer;
            .u-border {
                width: 4px;
                height: 100%;
            }
            .m-cj-wrapper {
                position: relative;
                flex: 1;
                background: #ebe5df;
                .m-cj-content {
                    .size(100%, 70px);
                    position: relative;
                    box-sizing: border-box;
                    padding: 10px 8px;
                    z-index: 3;
                    .u-cj-info {
                        .flex;
                        justify-content: space-between;
                        .mb(8px);
                        .u-name {
                            .fz(16px, 24px);
                            .bold;
                            color: rgba(61, 61, 61, 1);
                        }
                        .u-rate {
                            .fz(16px, 24px);
                            .bold;
                            color: rgba(112, 83, 45, 1);
                        }
                    }
                    .m-count-box {
                        .r(2px);
                        .dbi;
                        .fz(12px,18px);
                        box-sizing: border-box;
                        padding: 0 4px;
                        color: rgba(161, 161, 161, 1);
                        background: rgba(255, 255, 255, 0.5);
                        .m-count-inner {
                            .flex;
                            gap: 12px;
                            .u-item {
                                height: 18px;
                                .flex;
                                align-items: center;
                                img {
                                    .mr(4px);
                                }
                            }
                        }
                    }
                }
                .u-progress {
                    transition: 0.5s;
                    position: absolute;
                    box-sizing: border-box;
                    border: 2px solid #f7f7f7;
                    border-left: 0;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    height: 100%;
                }
                .u-logo {
                    position: absolute;
                    right: 12px;
                    top: 0;
                    z-index: 2;
                }
            }
        }
    }
}
.m-role-dropdown {
    ::v-deep {
        .el-dropdown-menu__item {
            padding: 0;
        }
        .popper__arrow {
            display: none;
        }
    }
    .m-role-item {
        .flex;
        justify-content: space-between;
        gap: 20px;
        min-width: 180px;
        padding: 0 12px;
        &:hover {
            background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(204, 184, 155, 1) 100%);
            color: #947e5d;
        }
        &.active {
            color: #947e5d;
            background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(204, 184, 155, 1) 100%);
        }
    }
}
</style>
