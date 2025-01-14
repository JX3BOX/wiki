<template>
    <div class="m-dj-form">
        <!-- 定制方案弹出层 -->
        <el-dialog
            title="创建方案"
            :visible.sync="dialogTableVisible"
            lock-scroll
            width="888px"
            :close-on-click-modal="false"
            custom-class="m-custom-dialog"
        >
            <div class="u-dialog-content">
                <!-- 顶部 -->
                <div class="u-dialog-header">
                    <div class="u-dialog-header_item">
                        <span>方案名称：</span>
                        <el-input v-model="leapForm.title" placeholder="请输入"></el-input>
                    </div>
                    <div class="u-dialog-header_item">
                        <span>目标资历：</span>
                        <el-input v-model.number="leapForm.number" placeholder="请输入"></el-input>
                    </div>
                </div>
                <div class="u-dialog-tips">请选择个人偏好，盒子娘将会为你制定专属渡劫方案：</div>
                <!-- 主体左右布局 -->
                <div class="u-dialog-main">
                    <div class="u-dialog-main_left">
                        <div class="u-dialog-main_title">方向</div>
                        <div class="u-dialog-main_category">
                            <div
                                class="u-dialog-main_category_item"
                                :class="{ active: dialogQueryParams.is_official == 1 }"
                                @click="changeCategory(1)"
                            >
                                推荐
                            </div>
                            <div
                                class="u-dialog-main_category_item"
                                :class="{ active: dialogQueryParams.is_official == 0 }"
                                @click="changeCategory(0)"
                            >
                                自选
                            </div>
                        </div>
                    </div>
                    <div class="u-dialog-main_right">
                        <div class="u-dialog-main_title">
                            {{ dialogQueryParams.is_official == 1 ? "推荐方案" : "自选方案" }}
                        </div>
                        <!-- 推荐 -->
                        <div v-if="dialogQueryParams.is_official == 1" class="u-dialog-main_recommend">
                            <div class="u-recommend-empty" v-if="!recommendList.length">
                                <img src="../../../assets/img/wiki/leap/leap_empty.png" width="300px" />
                            </div>
                            <!-- 方案列表 -->
                            <div class="u-recommend-list u-common-list" v-if="recommendList.length">
                                <div
                                    class="u-item"
                                    :class="{ active: item.id == selectRecommendItem.id }"
                                    v-for="item in recommendList"
                                    :key="item.id"
                                    @click="selectRecommend(item)"
                                    :title="item.title"
                                >
                                    {{ item.title }}
                                </div>
                            </div>
                            <!-- 方案描述 -->
                            <div class="u-recommend-desc" v-if="recommendList.length">
                                <!-- 点数根据schema计算 -->
                                <div class="u-recommend-desc_title">
                                    方案总资历点数：{{ selectRecommendItem?.all || 0 }}
                                </div>
                                <div class="u-recommend-desc_source">
                                    来源：{{
                                        selectRecommendItem
                                            ? selectRecommendItem.is_official == 1
                                                ? "魔盒"
                                                : "玩家"
                                            : "-"
                                    }}
                                </div>
                                <div class="u-recommend-desc_text">
                                    <span>简介：</span>
                                    <div v-html="selectRecommendItem.desc"></div>
                                </div>
                            </div>
                        </div>
                        <!-- 自选方案区域 -->
                        <div class="u-dialog-main_custom" v-else>
                            <!-- 自选再分，总览和地图 -->
                            <div class="u-dialog-main_category">
                                <div
                                    class="u-dialog-main_category_item"
                                    :class="{ active: isSelectType == 1 }"
                                    @click="changeSelfCategory(1)"
                                >
                                    总览
                                </div>
                                <div
                                    class="u-dialog-main_category_item"
                                    :class="{ active: isSelectType == 2 }"
                                    @click="changeSelfCategory(2)"
                                >
                                    地图
                                </div>
                            </div>

                            <!-- 总览 -->
                            <div v-if="isSelectType == 1" class="u-dialog-main_box">
                                <div class="u-dialog-main_custom_list u-common-list u-first-box">
                                    <div
                                        class="u-item u-first"
                                        :class="{ active: selectMenuItem.id == item.id }"
                                        v-for="item in menuList"
                                        :key="item.id"
                                        @click="selectMenu(item, 1)"
                                    >
                                        <!-- <el-badge is-dot> {{ item.name }} </el-badge> -->
                                        <el-badge :value="selectMenuNum(item)" class="u-badge-item">
                                            {{ item.name }}
                                        </el-badge>
                                    </div>
                                </div>
                                <!-- 成就分类二级区域 -->
                                <div class="u-dialog-main_custom_list u-common-list">
                                    <div
                                        class="u-item"
                                        :class="{ active: selectMenuChildrenItem.id == item.id }"
                                        v-for="item in selectMenuItem.children"
                                        :key="item.id"
                                        @click="selectMenu(item)"
                                    >
                                        <el-badge :is-dot="isSelectMenu(item)"> {{ item.name }} </el-badge>
                                    </div>
                                </div>
                                <!-- 成就区域 -->
                                <div class="u-dialog-main_custom_list u-common-list">
                                    <img
                                        src="../../../assets/img/wiki/leap/leap_empty.png"
                                        width="90%"
                                        v-if="achievements.length == 0"
                                    />

                                    <div class="u-item u-select-all" @click="selectAllAchievement()" v-else>全部</div>
                                    <div
                                        class="u-item u-select"
                                        :class="{ 'achievement-active': isSelectAchievement(item) }"
                                        v-for="item in achievements"
                                        :key="item.ID"
                                        @click="selectAchievement(item)"
                                    >
                                        <img src="../../../assets/img/wiki/leap/tick.svg" />

                                        <el-tooltip effect="dark" :content="item.Name" placement="top-start">
                                            <div>{{ item.Name }}</div>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                            <!-- 地图区域 -->
                            <div v-else class="u-dialog-main_box">
                                <div class="u-dialog-main_custom_list u-common-list u-first-box">
                                    <div
                                        class="u-item u-first"
                                        :class="{ active: selectMapItem.value == item.value }"
                                        v-for="item in mapList"
                                        :key="item.value"
                                        @click="selectMap(item, 1)"
                                    >
                                        <!-- <el-badge is-dot> {{ item.name }} </el-badge> -->
                                        <el-badge :value="selectMapNum(item)" class="u-badge-item">
                                            {{ item.label }}
                                        </el-badge>
                                    </div>
                                </div>
                                <!-- 地图分类二级区域 -->
                                <div class="u-dialog-main_custom_list u-common-list">
                                    <div
                                        class="u-item"
                                        :class="{ active: selectMapChildrenItem.value == item.value }"
                                        v-for="item in selectMapItem.children"
                                        :key="item.value"
                                        @click="selectMap(item)"
                                    >
                                        <el-badge :is-dot="isSelectMap(item)"> {{ item.label }} </el-badge>
                                    </div>
                                </div>
                                <!-- 成就区域 -->
                                <div class="u-dialog-main_custom_list u-common-list">
                                    <img
                                        src="../../../assets/img/wiki/leap/leap_empty.png"
                                        width="90%"
                                        v-if="achievements.length == 0"
                                    />
                                    <div class="u-item u-select-all" @click="selectAllAchievement()" v-else>全部</div>
                                    <div
                                        class="u-item u-select"
                                        :class="{ 'achievement-active': isSelectAchievement(item) }"
                                        v-for="item in achievements"
                                        :key="item.ID"
                                        @click="selectAchievement(item)"
                                    >
                                        <img src="../../../assets/img/wiki/leap/tick.svg" />

                                        <el-tooltip effect="dark" :content="item.Name" placement="top-start">
                                            <div>{{ item.Name }}</div>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="u-filter"><el-checkbox v-model="isFilter">过滤已完成成就</el-checkbox></div>
                <div class="u-dialog-footer">
                    <div class="u-dialog-footer_tips">
                        当前方案共
                        <span>{{ leapForm.all.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
                        资历，可为你提供
                        <span>{{ this.leapForm.diffNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
                        资历提升，距离目标还剩
                        <span>{{ leapForm.remaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span> 资历。
                    </div>
                    <div class="u-btn" @click="submitLeap()">生成方案</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getRoleGameAchievements,
    getMenuAchievements,
    getMenus,
    getAchievementPoints,
    getAchievements,
    getAchievementsPost,
    searchAchievements,
    getMapList,
} from "@/service/achievement";
import { getWikiAchievementLeapSchemaList, createdWikiAchievementLeapSchema } from "@/service/wiki";

import { cloneDeep, isEmpty } from "lodash";
export default {
    components: {},
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        currentRole: {
            type: Object,
            default: function () {
                return {};
            },
        },
        //成就ID及点数对应
        pointsData: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    watch: {
        show: {
            deep: true,
            handler(val) {
                if (val) this.createLeap(val);
            },
        },
        "leapForm.number": {
            deep: true,
            handler(val) {
                this.schemeCompute();
            },
        },
        customList: {
            deep: true,
            handler() {
                this.schemeCompute();
            },
        },
        dialogTableVisible: {
            handler(val) {
                if (!val) this.$emit("cancel", val);
            },
        },
        isFilter: {
            handler(val) {
                this.reloadCustom();
            },
        },
    },
    data() {
        return {
            dialogTableVisible: false,
            //是否过滤已有成就
            isFilter: true,
            leapForm: {
                title: "",
                all: 0,
                diffNum: 0,
                remaining: 0,
                number: 0,
            },

            //创建方案检索条件
            dialogQueryParams: {
                is_official: 1,
                _no_page: 1, //不分页
            },
            //推荐方案列表
            recommendList: [],
            selectRecommendItem: {}, //选择的推荐方案信息
            //自选方案配置列表
            isSelectType: 1, //1:总览 2:地图
            customList: [],
            //总览菜单列表
            menuList: [],
            selectMenuItem: {},
            selectMenuChildrenItem: {},

            //地图列表
            mapList: [],
            selectMapItem: {},
            selectMapChildrenItem: {},
            //成就列表，切换地图或总览时需重新赋值
            achievements: [],
            achievements_bak: [],
        };
    },
    created() {},
    mounted() {},
    methods: {
        //创建弹窗
        createLeap(val) {
            this.getMenuList();
            this.loadMapList();
            this.dialogTableVisible = val;
            this.leapForm = {
                title: "",
                all: 0,
                diffNum: 0,
                remaining: 0,
                number: 0,
            };
            this.dialogQueryParams = {
                is_official: 1,
                _no_page: 1,
            };
            this.customList = [];
            this.dialogQuery();
        },
        //弹窗方案方向切换
        changeCategory(value) {
            this.leapForm = {
                title: "",
                all: 0,
                diffNum: 0,
                remaining: 0,
                number: 0,
            };
            this.dialogQueryParams.is_official = value;
            value == 1 ? this.dialogQuery() : "";
        },
        //过滤选项切换，重载成就列表
        reloadCustom() {
            this.initCustomList();
        },
        //自选方案切换
        changeSelfCategory(value) {
            if (this.customList.length > 0 && this.isSelectType != value) {
                this.$confirm("切换分类将导致之前选择的数据失效，是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(() => {
                    this.isSelectType = value;
                    this.initCustomList();
                });
            } else {
                this.isSelectType = value;
                this.initCustomList();
            }
        },
        //初始化自选方案内容
        initCustomList() {
            this.customList = [];
            //根据value初始化不同内容,同时重载achievements
            if (this.isSelectType == 1) {
                this.selectMenu(this.menuList[1], 1);
            } else {
                this.selectMapItem = this.mapList[0];
                this.selectMapChildrenItem = this.selectMapItem.children[0];
                this.getMapAchievements(this.selectMapChildrenItem.value);
            }
        },
        //推荐方案查询
        dialogQuery() {
            getWikiAchievementLeapSchemaList(this.dialogQueryParams).then((res) => {
                this.recommendList = res.data?.data || [];
            });
        },
        //选择推荐方案
        selectRecommend(item) {
            this.selectRecommendItem = item;
            let info = this.getSchemePoints(this.selectRecommendItem.schema);
            let remaining = 0;
            if (this.leapForm.number > 0 && this.leapForm.number > info.diffNum) {
                remaining = this.leapForm.number - info.diffNum;
            }
            this.leapForm.all = info.all;
            this.leapForm.diffNum = info.diffNum;
            this.leapForm.remaining = remaining;
        },
        //自选-地图查询
        loadMapList() {
            const client = this.$store.state.client;
            const params = {
                client,
                _no_page: 1,
            };
            getMapList(params).then((res) => {
                const data = res.data.data || [];
                let regions = Object.values(
                    data.reduce((acc, cur) => {
                        if (!cur.RegionName) return acc;
                        if (!acc[cur.RegionName]) {
                            acc[cur.RegionName] = {
                                value: Number(cur.Region),
                                label: cur.RegionName,
                                children: [],
                            };
                        }
                        acc[cur.RegionName].children.push({
                            value: Number(cur.ID),
                            label: cur.MapName,
                            parent: Number(cur.Region),
                        });

                        return acc;
                    }, {})
                );
                this.mapList = regions;
            });
        },
        // 自选-总览获取成就菜单列表
        getMenuList() {
            getMenus({
                general: 1,
                client: "std",
            }).then((res) => {
                const data = res.data.data.menus;
                this.menuList = data;
                this.initCustomList(); //初始化自选方案内容
            });
        },
        //根据方案列表获取方案的成就ID及对应Point
        getSchemePoints(schema) {
            let pointsData = this.pointsData;
            let schemaArr = [];
            schema.forEach((item) => {
                schemaArr.push({ ID: item, Point: pointsData[item] });
            });
            let info = this.schemeCompute(schemaArr);
            return { all: info.all, diffNum: info.diffNum };
        },
        //总览菜单选择
        selectMenu(item, type) {
            if (type == 1) {
                this.selectMenuItem = item;
                this.selectMenuChildrenItem = {};
                item.achievements.length == 0 ? (this.selectMenuChildrenItem = item.children?.[0] || {}) : "";
                this.getMenuAchievements(
                    item.sub,
                    item.achievements.length == 0 ? this.selectMenuChildrenItem.detail : ""
                );
            } else {
                this.selectMenuChildrenItem = item;
                this.getMenuAchievements(item.sub, item.detail);
            }
        },
        // 获取成就列表
        getMenuAchievements(sub = 1, detail) {
            getMenuAchievements(sub, detail).then((data) => {
                let achievements = data.data.data.achievements || [];
                if (this.isFilter) {
                    // 根据角色已有成就过滤出未有的
                    let arr = [];
                    achievements.forEach((item) => {
                        if (this.currentRole.achievements.indexOf(item.ID) == -1) {
                            arr.push(item);
                        }
                    });
                    this.achievements = arr;
                } else {
                    this.achievements = data.data.data.achievements || [];
                }
            });
        },
        //一级菜单判断子集选中数量
        selectMenuNum(item) {
            let number = 0;
            this.customList.forEach((c) => {
                if (c.Sub == item.sub) {
                    number++;
                }
            });
            return number;
        },
        //总览分类菜单判断是否有选中值
        isSelectMenu(item, type) {
            let status = false;
            for (let i = 0; i < this.customList.length; i++) {
                if (type == 1) {
                    if (this.customList[i].Sub == item.sub && !this.customList[i].Detail) {
                        status = true;
                        break;
                    }
                } else {
                    if (this.customList[i].Detail == item.detail) {
                        status = true;
                        break;
                    }
                }
            }
            return status;
        },
        //总览菜单内单项是否选中判断
        isSelectAchievement(item) {
            let status = false;
            for (let i = 0; i < this.customList.length; i++) {
                if (this.customList[i].ID == item.ID) {
                    status = true;
                    break;
                }
            }
            return status;
        },
        selectMap(item, type) {
            if (type == 1) {
                this.selectMapItem = item;
                this.selectMapChildrenItem = item.children?.[0] || {};
            } else {
                this.selectMapChildrenItem = item;
            }
            this.getMapAchievements(this.selectMapChildrenItem.value);
        },
        //根据地图获取成就列表
        getMapAchievements(value) {
            let params = {
                scene: value,
                client: "std",
                _no_page: 1,
                limit: 99999,
            };
            searchAchievements(params).then((data) => {
                let achievements = data.data.data.achievements || [];
                if (this.isFilter) {
                    // 根据角色已有成就过滤出未有的
                    let arr = [];
                    achievements.forEach((item) => {
                        if (this.currentRole.achievements.indexOf(item.ID) == -1) {
                            arr.push(item);
                        }
                    });
                    this.achievements = arr;
                } else {
                    this.achievements = data.data.data.achievements || [];
                }
                this.$forceUpdate();
            });
        },
        selectMapNum(item) {
            let number = 0;
            item.children.forEach((c) => {
                this.customList.forEach((item2) => {
                    if (c.value == item2.SceneID) {
                        number++;
                    }
                });
            });
            return number;
        },
        isSelectMap(item) {
            let status = false;
            for (let i = 0; i < this.customList.length; i++) {
                if (this.customList[i].SceneID == item.value) {
                    status = true;
                    break;
                }
            }
            return status;
        },
        //选择全部成就
        selectAllAchievement() {
            //判断是总览还是地图
            if (this.isSelectType == 1) {
                //总览
                //判断当前二级菜单是否选中
                if (!isEmpty(this.selectMenuChildrenItem)) {
                    //判断是否有选中值，有则取消所有，没有则选中所有
                    if (this.isSelectMenu(this.selectMenuChildrenItem)) {
                        this.customList = this.customList.filter(
                            (item) => item.Detail != this.selectMenuChildrenItem.detail
                        );
                    } else {
                        this.customList = this.customList.concat(this.achievements);
                    }
                } else {
                    //判断一级
                    if (this.isSelectMenu(this.selectMenuItem, 1)) {
                        this.customList = this.customList.filter(
                            (item) =>
                                item.Sub != this.selectMenuItem.sub ||
                                (item.Sub == this.selectMenuItem.sub && item.Detail != null)
                        );
                    } else {
                        this.customList = this.customList.concat(this.achievements);
                    }
                }
            } else {
                // 地图
                this.customList = this.customList.concat(this.achievements);
            }
        },
        // 选择单个成就
        selectAchievement(item) {
            //根据ID判断选中状态,未选中加入数组,选中择从数组里移除
            if (this.isSelectAchievement(item)) {
                this.customList = this.customList.filter((e) => e.ID != item.ID);
            } else {
                this.customList.push(item);
            }
        },
        //总览方案计算
        schemeCompute(data) {
            let all = 0,
                diffNum = 0,
                remaining = 0;
            let _this = this;
            let customList = data || this.customList;

            //计算成就差值
            let arr = customList.filter(function (v) {
                all = all + v.Point;
                return _this.currentRole.achievements?.indexOf(v.ID) == -1 || false;
            });
            arr.forEach((item) => {
                diffNum = diffNum + item.Point;
            });
            if (!data) {
                remaining = Number(this.leapForm.number) - this.currentRole.total - diffNum;

                this.leapForm.all = all;
                this.leapForm.diffNum = diffNum;
                this.leapForm.remaining = remaining > 0 ? remaining : 0;
            } else {
                return {
                    all,
                    diffNum,
                };
            }
        },
        //提交方案
        submitLeap() {
            let schema = [];
            this.customList.forEach((item) => {
                schema.push(item.ID);
            });
            if (isEmpty(this.leapForm.title)) {
                return this.$message.warning("请输入方案名称");
            }
            if (!Number(this.leapForm.number)) {
                return this.$message.warning("请输入目标资历");
            }
            let meta = { createBy: "recommend" };
            if (this.dialogQueryParams.is_official == 0) {
                meta.createBy = this.isSelectType == 1 ? "overview" : "map";
            }
            let params = {
                title: isEmpty(this.leapForm.title) ? "未命名方案" : this.leapForm.title,
                schema,
                meta,
            };
            createdWikiAchievementLeapSchema(params).then((res) => {
                this.dialogTableVisible = false;
                this.$message.success("创建成功");
                //   this.getSchemaList();
                this.$emit("reloadList", res.data.data);
                let routeUrl = this.$router.resolve({
                    name: "leap",
                    query: {
                        id: res.data.data.id,
                    },
                });
                window.open(routeUrl.href, "_blank");
            });
        },
    },
};
</script>

<style lang="less">
.m-custom-dialog {
    background: rgba(0, 0, 0, 0.85);
    .el-dialog__title {
        color: #ffeccc;
    }
    .u-dialog-header {
        .flex;
        align-items: center;
        justify-content: space-between;
        .u-dialog-header_item {
            .flex;
            .flex(o);
            span {
                flex: 0 0 auto;
                color: #ffeccc;
                .fz(16px);
            }
            .el-input {
                input {
                    background: #544c41;
                    color: #fff;
                    height: 24px;
                }
            }
        }
    }
    .u-dialog-tips {
        .fz(12px);
        .bold(700);
        color: #ffeccc;
        margin: 24px 0 12px 0;
    }
    .u-dialog-main {
        .flex;
        .h(324px);
        border: 1px solid #ffffff;
        .u-dialog-main_title {
            .size(100%,24px);
            background-color: #fff;
            .fz(14px,24px);
            .bold(700);
            color: #000;
        }
        .u-dialog-main_left {
            .x;
            .size(64px,100%);
            flex-shrink: 0;
            background: linear-gradient(180deg, #332d24 0%, #000000 100%);
            border-right: 1px solid #ffffff;
            .u-dialog-main_category_item {
                .size(100%,48px);
                .flex;
                .flex(o);
                color: #ffeccc;
                .fz(14px);
                .bold(700);
                cursor: pointer;
                &:hover,
                &.active {
                    color: #fff;
                    background: linear-gradient(90deg, #3d342a 0%, #806241 52.78%, #3d342a 100%);
                }
            }
        }
        .u-dialog-main_right {
            .h(100%);
            .w(calc(100% - 64px));
            flex: 1;
            .x;
            //成就列表
            .u-common-list {
                background: linear-gradient(180deg, #000000 0%, #574938 100%);
                border-right: 1px solid #ffffff;
                overflow-y: auto;
                flex-shrink: 0;
                .pt(4px);
                box-sizing: border-box;
                /* 针对Webkit内核的浏览器 */
                &::-webkit-scrollbar {
                    /* 设置滚动条的宽度 */
                    width: 10px;
                }

                /* 滚动条轨道 - 背景颜色/白底 */
                &::-webkit-scrollbar-track {
                    background: #595958;
                    border-radius: 4px;
                }

                /* 滚动条的滑块部分 */
                &::-webkit-scrollbar-thumb {
                    background: #e2d3b9;
                    border-radius: 4px;
                }

                /* 当鼠标悬停在滚动条滑块上时改变颜色 */
                &::-webkit-scrollbar-thumb:hover {
                    background: #e2d3b9;
                }
                .u-item {
                    // padding: 10px 0;
                    .size(100%,24px);
                    .flex;
                    .flex(o);
                    cursor: pointer;
                    color: #ffeccc;
                    .fz(14px);
                    .bold(400);
                    box-sizing: border-box;
                    &:hover,
                    &.active {
                        color: #fff;
                        background: linear-gradient(90deg, #3d342a 0%, #806241 52.78%, #3d342a 100%);
                        border-bottom: 0.5px solid #706456;
                    }
                }
                .u-first {
                    height: 34px;
                }
            }
            //推荐模块展示
            .u-dialog-main_recommend {
                .flex;
                .h(calc(100% - 24px));
                .u-recommend-empty {
                    .w(100%);
                    flex-shrink: 0;
                    .flex;
                    .flex(o);
                }
                .u-recommend-list {
                    .size(120px,100%);
                }
                .u-recommend-desc {
                    .w(100% );
                    text-align: left;
                    padding: 50px 20px 0 20px;
                    box-sizing: border-box;
                    color: rgba(255, 255, 255, 0.75);
                    .fz(12px,20px);
                    .u-recommend-desc_title {
                        color: #fff;
                        .fz(14px);
                        .bold(700);
                        border-bottom: 2px solid #f5e0c9;
                        padding-bottom: 12px;
                        box-sizing: border-box;
                        .mb(12px);
                    }
                    .u-recommend-desc_text {
                        .flex;
                        span {
                            .dbi;
                            .w(auto);
                            flex-shrink: 0;
                        }
                    }
                }
            }
            //自选模块展示
            .u-dialog-main_custom {
                .flex;
                .h(calc(100% - 24px));
                flex: 1;
                .u-dialog-main_category {
                    .size(64px,100%);
                    flex-shrink: 0;
                    background: linear-gradient(180deg, #332d24 0%, #000000 100%);
                    border-right: 1px solid #ffffff;
                    .u-dialog-main_category_item {
                        .size(100%,48px);
                        .flex;
                        .flex(o);
                        color: #ffeccc;
                        .fz(14px);
                        .bold(700);
                        cursor: pointer;
                        &:hover,
                        &.active {
                            color: #fff;
                            background: linear-gradient(90deg, #3d342a 0%, #806241 52.78%, #3d342a 100%);
                        }
                    }
                }
                .u-dialog-main_box {
                    .flex;
                    flex: 1;
                    .x;
                }
                .u-dialog-main_custom_list {
                    // .w(calc(calc(100% / 2) - 100px));
                    .w(calc(calc(calc(100% - 120px) / 2) - 10px));
                    .h(100%);
                    overflow-y: auto;
                    &.u-first-box {
                        .w(140px);
                    }
                    .u-badge-item {
                        .el-badge__content {
                            .h(12px);
                            .fz(10px,12px);
                        }
                    }
                    .u-item {
                        .mb(8px);
                        img {
                            display: none;
                        }
                    }
                    .achievement-active {
                        img {
                            .dbi;
                            .mr(4px);
                        }
                        background: linear-gradient(90deg, rgba(173, 37, 16, 1) 0%, rgba(255, 72, 43, 0) 100%);
                    }
                }
            }
        }
    }
    .u-filter {
        text-align: right;
        .pt(10px);
        span {
            color: #fff;
        }
        .is-checked {
            span {
                color: #ffeccc;
            }
            .el-checkbox__inner {
                border-color: #ffeccc;
                background-color: #ffeccc;
                &::after {
                    border-color: #000;
                    border-right-width: 2px;
                    border-bottom-width: 2px;
                }
            }
        }
    }
    .u-dialog-footer {
        .u-dialog-footer_tips {
            color: rgba(245, 224, 201, 1);
            .fz(12px);
            .bold(400);
            .flex;
            .flex(o);
            margin: 24px auto 0 auto;
            span {
                .dbi;
                padding: 0 4px;
                color: #fff;
            }
        }
        .u-btn {
            background: linear-gradient(90deg, #806241 0%, #3d342a 50.69%, #806241 100%);
            border: 1px solid #ffffff;
            .r(4px);
            .fz(14px);
            .bold(700);
            .flex;
            .flex(o);
            color: #fff;
            .size(120px,48px);
            margin: 10px auto;
            cursor: pointer;
            &:hover {
                background: linear-gradient(0, rgba(173, 126, 16, 1) 0%, rgba(173, 126, 16, 0) 100%);

                border: 1px solid rgba(255, 255, 255, 0.88);
            }
        }
    }
}
</style>
