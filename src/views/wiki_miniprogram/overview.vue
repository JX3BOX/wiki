<template>
    <div class="mini-program-overview">
        <!-- 用户信息区域 -->
        <div class="user-info-section">
            <div class="avatar-container">
                <div class="avatar-bg">
                    <img v-if="avatar_frame" class="u-avatar-border" :src="avatar_frame" alt="头像边框" />
                    <RoleAvatar class="u-avatar-img" :mount="currentRole.mount" :body_type="currentRole.body_type" />
                </div>
                <!-- <div class="avatar">1</div> -->
            </div>
            <div class="user-name" @click="openRoleDrawer">{{ currentRole.name }}</div>
            <div class="user-detail">
                <img width="30" height="30" :src="showSchoolIcon(currentRole.mount)" class="hb-icon">
                <span>
                    {{ currentRole.server }}
                </span>
            </div>
        </div>

        <!-- 总进度条 -->
        <div class="total-progress">
            <div class="progress-info">
                <span class="progress-percentage">{{ totalProgress }}<span>%</span></span>
                <span class="progress-value">
                    <!-- 总点数万字位以上 -->
                    {{ ownPointsCountW }}<span>{{ ownPointsCountOther }}</span></span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: totalProgress + '%' }"></div>
            </div>
        </div>

        <!-- 进度概览 -->
        <div class="progress-overview">
            <div class="section-header">
                <div class="section-title">进度概览</div>
                <div class="toggle-mode" @click="drawerModeVisible = true; isSimpleModeSelect = isSimpleMode">
                    {{ isSimpleMode ? '简略模式' : '详细模式' }}
                    <i class="el-icon-sort u-switch"></i>
                </div>
            </div>

            <!-- 分类进度卡片 -->
            <div class="category-progress">
                <div class="progress-card" v-for="(category, index) in list" :key="index"
                    @click="handleClick(category)">
                    <div class="u-top" v-if="isSimpleMode">
                        <div class="card-icon">
                            <img :src="getIconPath(category.sub)" alt="" class="hb-icon" svg-inline>
                        </div>
                        <div class="u-info">
                            <div class="card-title">{{ category.name }}</div>
                            <div class="progress-percentage-small">
                                {{ getCurrentProgress(category.ownPoints, category.allPoints) }}%
                            </div>
                        </div>
                    </div>
                    <!-- 详细模式top -->
                    <div class="u-top-detailed" v-else>
                        <div class="u-name">{{ category.name }}</div>
                        <div class="u-info">
                            <div class="u-num">
                                {{ category.ownAchievements.length }}/{{ category.allAchievements.length }}
                                <img width="14" height="14"
                                    :src="require(`@/assets/img/wiki_miniprogram/${isDark ? 'Dark' : 'Light'}/count.svg`)"
                                    alt="成就logo" />
                            </div>
                            <div class="u-num">
                                {{ category.ownPoints }}/{{ category.allPoints }}
                                <img width="14" height="14"
                                    :src="require(`@/assets/img/wiki_miniprogram/${isDark ? 'Dark' : 'Light'}/sum.svg`)"
                                    alt="资历logo" />
                            </div>
                        </div>
                    </div>
                    <div class="progress-bar-small">
                        <div class="progress-fill"
                            :style="{ width: getCurrentProgress(category.ownPoints, category.allPoints) + '%' }"></div>
                    </div>

                </div>
            </div>
        </div>
        <!-- 模式切换 -->
        <el-drawer title="显示模式" :visible="drawerModeVisible" direction="btt" size="280px" @close="handleModeClose"
            class="c-mode-list-drawer">
            <div class="mode-list-container">
                <div v-for="(item, index) in modeType" :key="index" class="mode-item" @click="toggleMode(item.value)"
                    :class="{ 'selected': isSimpleModeSelect == item.value }">
                    <div class="mode-name">{{ item.name }}</div>
                    <div class="mode-detail">{{ item.detail }}</div>
                </div>
            </div>
            <div class="mode-button-group">
                <el-button @click="resetMode" class="u-reset">重置</el-button>
                <el-button @click="confirmMode" class="u-submit">确定</el-button>
            </div>
        </el-drawer>
        <!-- 角色列表 -->
        <RoleListVue :visible.sync="drawerVisible" :roles="roleList" :currentRole="currentRole"
            @confirmSelection="handleConfirmSelection">
        </RoleListVue>
    </div>
</template>
<script>
/**
 * 小程序概览组件
 * 展示用户信息、总进度和分类进度概览
 */
import User from "@jx3box/jx3box-common/js/user";
import { showSchoolIcon, iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
// import xf from "@jx3box/jx3box-data/data/xf/xf.json"

import {
    getAchievementPoints,
    getRoleGameAchievements,
    getMenus,
} from "@/service/achievement";
import { getUserRoles } from "@/service/team";
import { getUserInfo } from "@/service/wiki";
import { __imgPath } from "@/utils/config";
import RoleAvatar from "@/components/wiki/RoleAvatar.vue";
import RoleListVue from "@/views/wiki_miniprogram/components/roleList.vue";
import { mobileOpen } from "@/utils/minprogram";
export default {
    name: "OverviewMiniProgram",
    components: {
        RoleAvatar, RoleListVue,
    },
    // 数据定义
    data() {
        return {
            // 用户信息
            userInfo: {},
            //角色列表
            roleList: [],
            currentRole: {},
            drawerVisible: false,
            //是否精简模式
            isSimpleMode: true,
            isSimpleModeSelect: true,
            drawerModeVisible: false,
            modeType: [
                {
                    name: '简略模式',
                    detail: '<只显示百分比进度>',
                    value: true
                },
                {
                    name: '详细模式',
                    detail: '<显示成就数和资历数>',
                    value: false
                }
            ],
            //分类数据
            achievementData: [],
            //成就点数
            pointsData: {},
            //整合列表
            list: [],
            allPointsCount: 0,
            ownPointsCount: 0,
            // 我拥有的所有资历点数万字位以上
            ownPointsCountW: null,
            // 我拥有的所有资历点数其他位
            ownPointsCountOther: 0,

        }
    },
    computed: {
        isDark() {
            // // 使用 window.matchMedia 检查系统是否启用了暗色模式
            const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
            return mediaQueryList.matches;
        },
        avatar_frame() {
            if (this.userInfo) {
                const { user_avatar_frame } = this.userInfo;
                if (user_avatar_frame) {
                    return __imgPath + `avatar/images/${user_avatar_frame}/${user_avatar_frame}.svg`;
                }
            }
            return null;
        },
        // 总进度
        totalProgress() {
            if (!this.ownPointsCount && !this.allPointsCount) return 0;
            return ((this.ownPointsCount / this.allPointsCount) * 100).toFixed(2);
        },
    },
    watch: {

        currentRole: {
            deep: true,
            immediate: true,
            handler(val) {
                if (!val) return;

                const { jx3id } = val;
                if (jx3id) {
                    this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: [] });
                    this.loadRoleAchievements(jx3id);
                }
            },
        },
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        showSchoolIcon,
        /**
         * 处理分类点击
         * @param {object} category - 分类项
         */
        handleClick(category) {
            localStorage.setItem("category_data", JSON.stringify(category || {}));
            // this.$router.push({ name: "catalogue", query: {} });
            // 小程序打开界面
            mobileOpen(this.$router.resolve({
                name: "catalogue",
                query: {}
            }).href);
        },
        /**
         * 获取图标路径
         * @param {string} sub - 分类子项
         * @returns {string} - 图标路径
         */
        getIconPath(sub) {
            return require(`@/assets/img/wiki_miniprogram/${this.isDark ? 'Dark' : 'Light'}/tog_${sub}.svg`);
        },
        /**************************模式切换***********************/
        /**
         * 切换显示模式
       * @param {boolean} isSimple - 是否为简略模式
         */
        toggleMode(isSimple) {
            this.isSimpleModeSelect = isSimple;
        },
        /**
         * 处理抽屉关闭
         */
        handleModeClose() {
            this.drawerModeVisible = false;
        },
        /**
         * 重置显示模式为默认值（简略模式）
         */
        resetMode() {
            this.isSimpleModeSelect = true;
        },
        /**
         * 确认选择并关闭抽屉
         */
        confirmMode() {
            this.isSimpleMode = this.isSimpleModeSelect
            this.drawerModeVisible = false;
        },

        getUserInfo() {
            if (!User.isLogin()) {
                this.$confirm("请先登录再使用")
                return;
            }
            alert(JSON.stringify(User.getInfo()))
            const uid = User.getInfo().uid;
            uid &&
                getUserInfo(uid).then((res) => {
                    if (res.data.code == 0) {

                        this.userInfo = res.data.data;
                        this.getList();
                    }
                });
        },

        /**************************角色相关*****************************/
        // 获取用户角色列表
        loadUserRoles() {
            getUserRoles().then((res) => {
                this.roleList = res.data?.data?.list || [];
                const wiki_last_sync_jx3id = localStorage.getItem("wiki_last_sync");
                if (wiki_last_sync_jx3id && wiki_last_sync_jx3id !== "0") {
                    this.currentRole = this.roleList.find((item) => item.jx3id == wiki_last_sync_jx3id) || "";
                } else {
                    if (this.roleList.length) {
                        this.currentRole = this.roleList[0];
                        localStorage.setItem("wiki_last_sync", this.currentRole.jx3id || 0);
                        this.$store.commit("SET_STATE", { key: "role", value: this.currentRole });
                    }
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
                localStorage.setItem("achievements", JSON.stringify(list || []));
                this.getRenderList();
            });
        },
        /**
         * 打开角色选择抽屉
         */
        openRoleDrawer() {
            this.drawerVisible = true;
        },
        /**
         * 处理角色选择确认
         * @param {Object} role - 选中的角色
         */
        handleConfirmSelection(role) {
            console.log(role);
            this.currentRole = role;
            this.drawerVisible = false;
        },
        /*****************************获取成就列表********************************/
        getList() {
            getMenus({
                general: 1,
                client: this.$store.state.client,
            }).then((res) => {
                const data = res.data.data.menus;
                this.achievementData = data;
                this.getPoints();
            });
        },
        // 获取成就对应点数
        getPoints() {
            getAchievementPoints().then((res) => {
                const data = res.data.data.points;
                this.pointsData = data;
                localStorage.setItem("points_data", JSON.stringify(data || {}));
                this.loadUserRoles(); // 获取用户角色列表
            });
        },

        // 回调获取所有成就
        getAllAchievementsData(
            data,
            allAchievements = [],
            ownAchievements = [],
            countData = { allPoints: 0, ownPoints: 0 }
        ) {
            // 我完成的成就
            const ownAllAchievements = this.$store.state.achievements;
            // console.log("成就循环", data);
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
                    this.getAllAchievementsData(item, allAchievements, ownAchievements, countData);
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
        getRenderList(data) {
            data = data ? data : this.achievementData;
            const list = Object.keys(data).map((key) => {
                const item = data[key];
                const allData = this.getAllAchievementsData(item);
                return {
                    sub: item.sub,
                    detail: item.detail,
                    name: item.name,
                    allAchievements: allData.allAchievements,
                    ownAchievements: allData.ownAchievements,
                    children: item.children,
                    allPoints: allData.allPoints,
                    ownPoints: allData.ownPoints,
                };
            });
            this.list = list;
            this.allPointsCount = list.reduce((acc, item) => acc + item.allPoints, 0);
            const my_achievements = this.$store.state.achievements;
            this.ownPointsCount = my_achievements.reduce((acc, item) => acc + (this.pointsData[item] || 0), 0);
            // 如果我的成就点数长度大于4，则截取后4位写在ownPointsCountOther，其余写在ownPointsCountW
            const pointsStr = this.ownPointsCount.toString();
            if (pointsStr.length > 4) {
                this.ownPointsCountW = pointsStr.slice(0, -4);
                this.ownPointsCountOther = pointsStr.slice(-4);
            } else {
                this.ownPointsCountW = '';
                this.ownPointsCountOther = pointsStr;
            }
        },
        getCurrentProgress(own, all) {
            return ((own / all) * 100).toFixed(2);
        },
    }
}
</script>
<style lang="less">
.c-mode-list-drawer {
    overflow: auto;

    .el-drawer {
        border-radius: 20px 20px 0 0;
        background: #24292E;
    }

    .el-drawer__header {
        margin-bottom: 0;
    }

    .mode-list-container {
        padding: 20px 20px 0 20px;

        .mode-item {
            padding: 16px;
            margin-bottom: 16px;
            border: 2px solid #30363D;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;

            &:last-child {
                margin-bottom: 2px;
            }

            .mode-name {
                font-size: 16px;
                font-weight: 700;
                line-height: 24px;
                color: rgba(255, 255, 255, 0.8);
            }

            .mode-detail {
                font-size: 12px;
                line-height: 18px;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.8);
            }

            &.selected {
                border-color: #FEDAA3;
                background-color: rgba(255, 255, 255, 0.05);

                .mode-name,
                .mode-detail {
                    color: #FEDAA3;
                }

            }
        }
    }

    .mode-button-group {
        padding: 16px 20px;
        display: flex;
        justify-content: flex-end;
        gap: 20px;
        border-top: 1px solid #30363D;

        .el-button {
            margin-left: 0;
            border-radius: 12px;
        }

        .u-submit {
            flex: 1;
            background: #FEDAA3;
        }
    }
}

/**
 * 小程序概览组件样式
 */
.mini-program-overview {
    height: 100vh;
    background-color: #F5F5F5;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;

    // 用户信息区域
    .user-info-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 16px;

        .avatar-container {
            position: relative;
            width: 160px;
            height: 160px;
            margin-bottom: 16px;

            .avatar-bg {
                width: 100%;
                height: 100%;
                background-color: #AEA6A6;
                position: absolute;
                top: 0;
                left: 0;
            }

            .u-avatar-img {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                overflow: hidden;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .u-avatar-border {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .user-name {
            font-size: 18px;
            font-weight: 700;
            line-height: 28px;
            color: #1C1C1C;

        }

        .user-detail {
            font-size: 14px;
            line-height: 20px;
            font-weight: 400;
            color: rgba(28, 28, 28, 0.40);
            display: flex;
            align-items: center;

            .hb-icon {
                width: 20px;
                height: 20px;
                margin-right: 4px;
            }
        }
    }

    // 总进度条
    .total-progress {
        background-color: #24292e;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;

        .progress-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 4px;

            .progress-percentage {
                font-size: 24px;
                font-weight: 700;
                line-height: 30px;
                color: #fedaa3;

                span {
                    font-size: 16px;
                    line-height: 24px;
                }
            }

            .progress-value {
                font-size: 14px;
                font-weight: 700;
                line-height: 20px;
                color: #fedaa3;

                span {
                    font-size: 12px;
                    font-weight: 18px;
                }
            }
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            overflow: hidden;

            .progress-fill {
                height: 100%;
                background-color: #fedaa3;
                border-radius: 4px;
            }
        }
    }

    // 进度概览
    .progress-overview {
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .section-title {
                font-size: 14px;
                font-weight: 700;
                line-height: 20px;
                color: rgba(28, 28, 28, 0.80);
            }

            .toggle-mode {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-weight: 700;
                line-height: 20px;
                color: rgba(28, 28, 28, 0.40);
                cursor: pointer;
                margin-right: 4px;
                //禁止选中
                user-select: none;

                .u-switch {
                    //翻转90度
                    transform: rotate(90deg);
                }
            }
        }

        // 分类进度卡片
        .category-progress {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            .progress-card {
                padding: 12px;
                background-color: #ffffff;
                width: calc(50% - 5px);
                flex-shrink: 0;
                box-sizing: border-box;

                //简略模式
                .u-top {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;

                    .card-icon {
                        width: 44px;
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                    }

                    .u-info {
                        color: rgba(28, 28, 28, 0.80);
                        font-style: normal;
                        font-weight: 700;
                        text-align: right;

                        .card-title {
                            font-size: 14px;
                            line-height: 20px;

                        }

                        .progress-percentage-small {
                            font-size: 12px;
                            line-height: 18px;
                        }
                    }
                }

                //详细模式
                .u-top-detailed {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    color: rgba(28, 28, 28, 0.80);
                    font-style: normal;

                    .u-name {
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 20px;
                    }

                    .u-info {
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 18px;
                        text-align: right;

                        .u-num {
                            width: 100%;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            gap: 4px;
                        }
                    }
                }

                .progress-bar-small {
                    width: 100%;
                    height: 4px;
                    margin-top: 4px;
                    background-color: rgba(28, 28, 28, 0.1);
                    border-radius: 4px;
                    overflow: hidden;

                    .progress-fill {
                        height: 100%;
                        background-color: rgba(28, 28, 28, 0.8);
                        border-radius: 4px;
                    }
                }
            }
        }
    }
}

/**
 * 暗黑模式样式@media screen and (width: 390px)
 */
// @media (prefers-color-scheme: dark)
@media (prefers-color-scheme: dark) {
    .mini-program-overview {
        background-color: #000000;
        color: #ffffff;

        // 用户信息区域
        .user-info-section {
            .user-name {
                color: #ffffff;
            }

            .user-detail {
                color: #cccccc;
            }

            .avatar-container {
                .avatar-bg {
                    background-color: #333333;
                }

                .avatar {
                    background-color: #555555;
                }
            }
        }

        // 总进度条
        .total-progress {
            background-color: #fedaa3;

            .progress-info {
                .progress-percentage {
                    color: #24292E;
                }

                .progress-value {
                    color: #24292E;
                }
            }

            .progress-bar {
                background-color: rgba(255, 255, 255, 0.2);

                .progress-fill {
                    background-color: #24292E;
                }
            }
        }

        // 进度概览
        .progress-overview {
            .section-header {
                .section-title {
                    color: rgba(255, 255, 255, 0.8);
                }

                .toggle-mode {
                    color: rgba(255, 255, 255, 0.4);
                }
            }

            // 分类进度卡片
            .category-progress {
                .progress-card {
                    background-color: #282828;

                    .u-top,
                    .u-top-detailed {
                        color: rgba(255, 255, 255, 0.8);

                        .u-info {
                            color: rgba(255, 255, 255, 0.8);
                        }
                    }

                    .progress-bar-small {
                        background-color: rgba(255, 255, 255, 0.1);

                        .progress-fill {
                            background-color: rgba(255, 255, 255, 0.8);
                        }
                    }
                }
            }
        }
    }
}
</style>
