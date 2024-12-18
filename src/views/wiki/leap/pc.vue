<template>
    <div class="p-leap-pc">
        <div class="m-title">
            <div class="u-label-box">
                <div class="u-label">渡劫方案</div>
                <div class="u-btn-created" v-show="list.length > 0" @click="createLeap">
                    <i class="el-icon-circle-plus-outline u-add-icon"></i>定制方案
                </div>
            </div>

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
                <el-dropdown trigger="click">
                    <div class="u-toggle-btn">
                        <img src="@/assets/img/wiki/overview/toggle-user-icon.svg" alt="" />
                    </div>
                    <el-dropdown-menu class="m-role-dropdown" slot="dropdown">
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
                <div class="u-user-all_achievement">
                    当前资历：<span>{{ currentRole.total || 0 }}</span>
                </div>
            </div>
        </div>
        <!-- tabl 列表 -->

        <!-- 主要位置 -->
        <div class="m-main" v-if="!showDetail">
            <div class="m-tables">
                <el-table
                    :data="list"
                    style="width: 100%"
                    stripe
                    row-class-name="u-table-row"
                    cell-class-name="u-table-cell"
                    header-row-class-name="u-table-header_row"
                    header-cell-class-name="u-table-header_cell"
                >
                    <el-table-column prop="title" label="方案名称">
                        <template slot-scope="scope">
                            <router-link target="_blank" :to="{ name: 'leap', query: { id: scope.row.id } }">
                                {{ scope.row.title }}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="方案资历总点数" width="180">
                        <template slot-scope="scope"> {{ getSchemePoints(scope.row.schema)?.all || 0 }} </template>
                    </el-table-column>
                    <el-table-column label="可提升资历点数" width="180">
                        <template slot-scope="scope"> {{ getSchemePoints(scope.row.schema)?.diffNum || 0 }} </template>
                    </el-table-column>
                    <el-table-column label="来源" width="180">
                        <template slot-scope="scope"> {{ scope.row.is_official == 1 ? "魔盒" : "玩家" }} </template>
                    </el-table-column>
                </el-table>
                <div class="u-page">
                    <el-pagination background hide-on-single-page layout="prev, pager, next" :total="pageTotal">
                    </el-pagination>
                </div>
            </div>
            <!-- 定制按钮 -->
            <div class="u-btn" @click="createLeap" v-show="list.length == 0">
                <i class="el-icon-circle-plus-outline u-add-icon"></i>
                <div>定制方案</div>
            </div>
        </div>
        <!-- 详情区域 -->
        <div class="m-detail" v-if="showDetail">
            <!-- 左侧列表，右侧table -->
            <!-- 左侧根据成就信息判断是否显示菜单 -->
            <div class="u-detail-left">
                <ul class="u-detail-left_item">
                    <li
                        class="u-menu-parent u-menu-text"
                        :class="{ active: detailSelectMenu == null }"
                        @click="changeDetailMenu(null, 0)"
                    >
                        全部
                    </li>
                </ul>
                <div v-for="(item, index) in menuList" :key="index" @click="changeDetailMenu(item, 1)">
                    <ul v-if="item.show" class="u-detail-left_item">
                        <li class="u-menu-parent u-menu-text" :class="{ active: detailSelectMenu == item.id }">
                            {{ item.name }}
                        </li>
                        <div
                            v-for="(item2, index2) in item.children"
                            :key="index2"
                            @click.stop="changeDetailMenu(item2, 2)"
                        >
                            <li
                                v-if="item2.show"
                                class="u-menu-item_children u-menu-text"
                                :class="{ active: detailSelectMenu == item2.id }"
                            >
                                {{ item2.name }}
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
            <div class="u-detail-right">
                <el-table
                    :data="detail.achievements || []"
                    style="width: 100%"
                    stripe
                    height="100%"
                    row-class-name="u-table-row"
                    cell-class-name="u-table-cell"
                    header-row-class-name="u-table-header_row"
                    header-cell-class-name="u-table-header_cell"
                >
                    <el-table-column prop="Name" label="成就名称">
                        <template slot-scope="scope">
                            <a :href="getLink('achievement', scope.row.ID)" target="_blank">
                                <div class="u-achievement-name">
                                    <img class="u-icon" :src="iconLink(scope.row?.IconID)" />
                                    <span>{{ scope.row.Name }}</span>
                                </div></a
                            >
                        </template>
                    </el-table-column>
                    <el-table-column label="资历点数" width="100">
                        <template slot-scope="scope"> {{ scope.row.Point || 0 }} </template>
                    </el-table-column>

                    <el-table-column label="全服完成度" width="260">
                        <template slot-scope="scope">
                            <div class="u-process-box">
                                <div class="u-process-item" :style="{ width: scope.row.process }"></div>
                                <div class="u-process-text">{{ scope.row.process }}</div>
                            </div></template
                        >
                    </el-table-column>
                    <el-table-column label="难度" width="140">
                        <template slot-scope="scope">
                            <el-rate :value="scope.row.difficulty" disabled allow-half disabled-void-color="#574938">
                            </el-rate>
                        </template>
                    </el-table-column>
                    <el-table-column label="奖励" width="100">
                        <template slot-scope="scope">
                            <el-tooltip placement="top" v-if="scope.row.item">
                                <div slot="content"><jx3-item :item="scope.row.item" /></div>
                                <img class="u-icon" :src="iconLink(scope.row.item?.IconID)" />
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="u-page">
                    <el-pagination background hide-on-single-page layout="prev, pager, next" :total="detailPageTotal">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 定制方案弹出层 -->
        <el-dialog
            title="创建方案"
            :visible.sync="dialogTableVisible"
            lock-scroll
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
                            <el-empty description="暂无推荐" v-if="!recommendList.length"></el-empty>
                            <!-- 方案列表 -->
                            <div class="u-recommend-list u-common-list" v-if="recommendList.length">
                                <div
                                    class="u-item"
                                    :class="{ active: item.id == selectRecommendItem.id }"
                                    v-for="item in recommendList"
                                    :key="item.id"
                                    @click="selectRecommend(item)"
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
                            <div class="u-dialog-main_custom_list u-common-list">
                                <div
                                    class="u-item"
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
                                    @click="selectMenuChildren(item)"
                                >
                                    <el-badge :is-dot="isSelectMenuChildren(item)"> {{ item.name }} </el-badge>
                                    <!-- <el-badge :value="selectMenuChildrenNum(item)" class="u-badge-item">
                                        {{ item.name }}
                                    </el-badge> -->
                                </div>
                            </div>
                            <!-- 成就区域 -->
                            <div class="u-dialog-main_custom_list u-common-list">
                                <div class="u-item" @click="selectAllAchievement()">全部</div>
                                <div
                                    class="u-item"
                                    :class="{ 'achievement-active': isSelectAchievement(item) }"
                                    v-for="item in achievements"
                                    :key="item.ID"
                                    @click="selectAchievement(item)"
                                >
                                    <img src="../../../assets/img/wiki/leap/tick.svg" />
                                    {{ item.Name }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="u-dialog-footer">
                    <div class="u-dialog-footer_tips">
                        当前方案共 <span>{{ leapForm.all }}</span> 资历，可为你提供
                        <span>{{ this.leapForm.diffNum }}</span> 资历提升，距离目标还剩
                        <span>{{ leapForm.remaining }}</span> 资历。
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
} from "@/service/achievement";
import {
    getWikiAchievementLeapSchemaList,
    createdWikiAchievementLeapSchema,
    getWikiAchievementLeapSchema,
    deleteWikiAchievementLeapSchema,
    getWikiAchievementLeapSchemaProgress,
} from "@/service/wiki";
import Item from "@jx3box/jx3box-editor/src/Item";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getUserRoles } from "@/service/team";
import { cloneDeep, isEmpty } from "lodash";

export default {
    components: { "jx3-item": Item },
    data() {
        return {
            currentRole: {}, //当前角色
            roleList: [],
            showDetail: false, //是否显示详情
            //方案列表
            list: [],
            queryParams: { page: 1, per: 20 },
            pageTotal: 0, //总条数
            //创建方案配置
            dialogTableVisible: false,
            leapForm: {
                title: "",
                all: 0,
                diffNum: 0,
                remaining: 0,
                number: 0,
            },
            pointsData: [], //成就ID及点数对应
            //创建方案检索条件
            dialogQueryParams: {
                is_official: 1,
                _no_page: 1,
            },
            //推荐方案列表
            recommendList: [],
            selectRecommendItem: {},
            //自选方案配置列表
            customList: [],

            menuList: [],
            selectMenuItem: {},
            selectMenuChildrenItem: {},
            achievements: [],

            //详情相关
            detail: {},
            detailSelectMenu: null,
            detailPageTotal: 0,
        };
    },
    watch: {
        customList: {
            deep: true,
            handler() {
                this.schemeCompute();
            },
        },
        "leapForm.number": {
            deep: true,
            handler() {
                this.schemeCompute();
            },
        },
    },
    created() {
        if (this.$route.query.id) this.showDetail = true;
        this.loadUserRoles();
        this.getMenuList();
    },
    mounted() {},
    methods: {
        iconLink,
        getLink,
        // 获取当前用户角色列表
        loadUserRoles() {
            User.isLogin() &&
                getUserRoles().then((res) => {
                    this.roleList = res.data?.data?.list || [];
                    this.currentRole = res.data?.data?.list[0] || {};

                    this.getPoints();
                });
        },
        // 获取成就对应点数
        getPoints() {
            return getAchievementPoints().then((res) => {
                const data = res.data.data.points;
                this.pointsData = data;
                if (this.$route.query.id) {
                    this.getRoleGameAchievements(); //获取当前角色成就
                } else {
                    //获取方案列表
                    this.getSchemaList();
                }
            });
        },
        onChangeRole(val) {
            this.currentRole = val;
            this.getRoleGameAchievements();
        },
        //获取当前角色成就
        getRoleGameAchievements() {
            getRoleGameAchievements(this.currentRole.jx3id).then((res) => {
                this.currentRole.achievements = res.data?.data?.achievements || [];
                //计算角色总资历
                let total = 0,
                    arr = cloneDeep(this.currentRole.achievements).split(",") || [];
                arr.forEach((item) => {
                    total = total + (this.pointsData[item] || 0);
                });
                this.$set(this.currentRole, "total", total);
            });
        },
        //获取方案列表
        getSchemaList() {
            getWikiAchievementLeapSchemaList(this.queryParams).then((res) => {
                this.list = res.data?.data?.list || [];
                this.pageTotal = res.data?.data?.total || 0;
                this.getRoleGameAchievements(); //获取当前角色成就
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
        //获取方案详情
        getSchemaDetail() {
            getWikiAchievementLeapSchema(this.$route.query.id).then((res) => {
                this.detail = res.data?.data || {};
                this.getAchievements(res.data?.data?.schema);
                this.getAchievementProgress(res.data?.data?.schema);
            });
        },
        //根据成就ID获取成就列表,同时配置分类菜单
        getAchievements(data) {
            getAchievementsPost({ ids: data.toString(), attributes: "Name,Sub,Detail,IconID,Item,Point" }).then(
                (res) => {
                    this.detail.achievements = res.data?.data || [];
                    this.detail.achievementsBak = cloneDeep(this.detail.achievements);
                    //筛选可显示的分类

                    let menu = cloneDeep(this.menuList);
                    Object.keys(menu).map((key) => {
                        menu[key].children.forEach((item_c) => {
                            this.detail.achievements.forEach((item2) => {
                                if (menu[key].sub == item2.Sub) {
                                    menu[key].show = true;
                                }
                                if (item2.Detail == item_c.detail) {
                                    item_c.show = true;
                                }
                            });
                        });
                    });

                    this.$set(this, "menuList", menu);
                }
            );
        },
        //全服完成进度及难度
        getAchievementProgress(data) {
            getWikiAchievementLeapSchemaProgress(data).then((res) => {
                this.detail.progressAndDifficulty = res.data?.data || [];
                this.getDifficulty();
            });
        },
        getDifficulty() {
            let arr = [];
            this.detail.achievementsBak.forEach((item) => {
                let findInfo = this.detail.progressAndDifficulty.find((item2) => item2.achievement_id == item.ID);
                item.difficulty = (findInfo?.difficulty || 0) / 10;

                item.process =
                    ((findInfo.completed_role_count / findInfo.total_role_count) * 100).toFixed(2) || 0 + "%";
                arr.push(item);
            });
            this.detail.achievements = arr;
        },

        //详情界面时菜单分类切换
        changeDetailMenu(item, type) {
            if (type == 0) {
                this.detailSelectMenu = null;
                this.detail.achievements = cloneDeep(this.detail.achievementsBak);
                return;
            }
            this.detailSelectMenu = item.id;
            let arr = [];
            this.detail.achievementsBak.forEach((item2) => {
                if (type == 1 && item2.Sub == item.sub) {
                    arr.push(item2);
                }
                if (type == 2 && item2.Detail == item.detail) {
                    arr.push(item2);
                }
            });
            this.detail.achievements = arr;
        },
        createLeap() {
            this.dialogTableVisible = true;
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
        //推荐方案查询
        dialogQuery() {
            getWikiAchievementLeapSchemaList(this.dialogQueryParams).then((res) => {
                this.recommendList = res.data?.data || [];
            });
        },
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
        // 获取成就菜单列表
        getMenuList() {
            getMenus({
                general: 1,
                client: "std",
            }).then((res) => {
                const data = res.data.data.menus;
                this.menuList = data;
                if (this.$route.query.id) {
                    this.getSchemaDetail();
                    return;
                }
                this.selectMenuItem = data[1];
                // this.selectMenuChildrenItem = data[1]?.children?.[0] || {};
                this.selectMenuChildrenItem = {};
                this.getMenuAchievements();
            });
        },
        selectMenu(item) {
            this.selectMenuItem = item;
            this.selectMenuChildrenItem = {};
            item.achievements.length == 0 ? (this.selectMenuChildrenItem = item.children?.[0] || {}) : "";
            this.getMenuAchievements(item.sub, item.achievements.length == 0 ? this.selectMenuChildrenItem.detail : "");
        },
        selectMenuChildren(item) {
            this.selectMenuChildrenItem = item;
            this.getMenuAchievements(item.sub, item.detail);
        },
        // 获取成就列表
        getMenuAchievements(sub = 1, detail) {
            getMenuAchievements(sub, detail).then((data) => {
                this.achievements = data.data.data.achievements || [];
            });
        },
        //一级菜单判断子集选中数量
        selectMenuNum(item) {
            let number = 0;
            for (let i = 0; i < this.customList.length; i++) {
                if (this.customList[i].Sub == item.sub) {
                    number++;
                }
            }
            return number;
        },
        //一级菜单判断是否有选中值
        isSelectMenu(item) {
            let status = false;
            for (let i = 0; i < this.customList.length; i++) {
                if (this.customList[i].Sub == item.sub && !this.customList[i].Detail) {
                    status = true;
                    break;
                }
            }
            return status;
        },
        //二级菜单判断是否有选中值
        isSelectMenuChildren(item) {
            let status = false;
            for (let i = 0; i < this.customList.length; i++) {
                if (this.customList[i].Detail == item.detail) {
                    status = true;
                    break;
                }
            }
            return status;
        },
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
        //选择全部成就
        selectAllAchievement() {
            //判断当前二级菜单是否选中
            if (!isEmpty(this.selectMenuChildrenItem)) {
                //判断是否有选中值，有则取消所有，没有则选中所有
                if (this.isSelectMenuChildren(this.selectMenuChildrenItem)) {
                    this.customList = this.customList.filter(
                        (item) => item.Detail != this.selectMenuChildrenItem.detail
                    );
                } else {
                    this.customList = this.customList.concat(this.achievements);
                }
            } else {
                //判断一级
                if (this.isSelectMenu(this.selectMenuItem)) {
                    this.customList = this.customList.filter(
                        (item) =>
                            item.Sub != this.selectMenuItem.sub ||
                            (item.Sub == this.selectMenuItem.sub && item.Detail != null)
                    );
                } else {
                    this.customList = this.customList.concat(this.achievements);
                }
            }
        },
        // 选择单个成就
        selectAchievement(item) {
            //根据ID判断选中状态
            this.customList.push(item);
        },
        //方案计算
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
                if (this.leapForm.number > 0 && this.leapForm.number > diffNum) {
                    remaining = this.leapForm.number - diffNum;
                }
                this.leapForm.all = all;
                this.leapForm.diffNum = diffNum;
                this.leapForm.remaining = remaining;
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
                // schema.push({
                //     ID: item.ID,
                //     Sub: item.Sub,
                //     Detail: item.Detail,
                // });
                schema.push(item.ID);
            });
            let params = {
                title: this.leapForm.title,
                schema,
            };

            createdWikiAchievementLeapSchema(params).then((res) => {
                this.dialogTableVisible = false;
                this.getSchemaList();
                this.$message.success("创建成功");
            });
        },
    },
};
</script>

<style lang="less">
.p-leap-pc {
    padding-top: 65px;
    width: 960px;
    height: 100%;
    box-sizing: border-box;
    .m-info-user {
        .flex;
        .h(35px);
        transition: 0.5s;
        align-items: center;

        .u-name {
            .fz(16px,25px);
            .mr(8px );
            .bold;
            color: #fff;
        }
        .u-toggle-btn {
            .flex;
            .flex(o);
            .size(28px);
            color: #ffeccc;
            cursor: pointer;
        }
        .u-user-all_achievement {
            .fz(16px,25px);
            .ml(8px );
            color: #ffeccc;
            span {
                color: #fff;
            }
        }
    }
    .m-title {
        .flex;
        align-items: center;
        justify-content: space-between;
        .mb(8px);
        .u-label-box {
            .flex;
            align-items: center;
            .w(130px);
            flex-shrink: 0;
        }
        .u-label {
            .w(115px);
            flex-shrink: 0;
            mask-image: linear-gradient(180deg, rgba(255, 255, 255, 1) 43.06%, rgba(255, 255, 255, 0) 100%);
            .fz(26px);
            .bold(900);
            color: #fff;
        }
        .u-btn-created {
            .size(120px,20px);
            flex-shrink: 0;
            border: 1px solid #ffeccc;
            .r(10px);
            .flex;
            .flex(o);
            padding: 4px 0;
            color: #e2d3b9;
            cursor: pointer;
            .fz(14px);
            .u-add-icon {
                .fz(16px);
            }
        }
        .u-tip {
            flex: 1;
            color: rgba(255, 236, 204, 1);
            .fz(14px);
            .bold(400);
        }
    }
    .m-tables,
    .m-detail {
        .mb(8px);
        .el-table,
        .u-table-header_row,
        .u-table-header_cell {
            background-color: transparent;
        }

        .u-table-header_cell {
            .x;
            color: rgba(245, 224, 201, 1);
        }
        .u-table-cell {
            .x;
            color: rgba(112, 83, 45, 1);
            a {
                color: rgba(112, 83, 45, 1);
            }
        }
        .u-table-row {
            //奇偶选择器
            &:nth-child(odd) {
                background: #ebe5df;
            }
            &:nth-child(even) {
                background: #fff;
            }
        }
        .u-page {
            .mt(6px);
            text-align: right;

            .el-pagination.is-background .el-pager li:not(.disabled):hover {
                color: rgba(112, 83, 45, 1);
            }
            .el-pagination.is-background .el-pager li:not(.disabled).active {
                background-color: #ffeccc;
                color: rgba(112, 83, 45, 1);
            }
        }
    }
    .m-main {
        .u-btn {
            border: 1px solid #ffeccc;
            .r(10px);
            .size(960px,360px);
            .flex;
            .flex(o);
            flex-direction: column;
            color: #e2d3b9;
            cursor: pointer;
            .u-add-icon {
                .fz(42px);
            }
        }
    }
    // 详情
    .m-detail {
        .h(100%);
        .flex;
        border-top: 2px solid #ffeccc;
        .u-detail-left,
        .u-detail-right .el-table__body-wrapper {
            /* 针对Webkit内核的浏览器 */
            &::-webkit-scrollbar {
                /* 设置滚动条的宽度 */
                width: 2px;
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
        }
        .u-detail-left {
            .h(100%);
            .w(120px);
            .fz(14px);
            .bold(400);
            overflow-y: auto;
            padding: 6px;
            box-sizing: border-box;
            color: rgba(255, 236, 204, 1);
            flex-shrink: 0;
            background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(87, 73, 56, 1) 100%);

            .u-detail-left_item {
                margin: 0;
                padding: 0;
                list-style-type: none;
                .u-menu-text {
                    .mb(8px);
                    padding: 2px;
                    box-sizing: border-box;
                    cursor: pointer;
                    &:hover {
                        color: #fff;
                        .bold(700);
                        background: linear-gradient(90deg, #3d342a 0%, #806241 52.78%, #3d342a 100%);
                    }
                    &.active {
                        color: #fff;
                        .bold(700);
                        background: linear-gradient(90deg, #3d342a 0%, #806241 52.78%, #3d342a 100%);
                    }
                }
            }
            .u-menu-parent_name {
                .mb(8px);
            }
            .u-menu-item_children {
                .ml(10px);
            }
        }
        .u-detail-right {
            .w(calc(100% - 120px));
            .u-table-header_row {
                .gutter {
                    display: none !important;
                }
            }
            .u-achievement-name {
                .flex;
                align-items: center;
                span {
                    color: #70532d;
                }
            }
            .u-icon {
                .size(24px);
                .mr(4px );
            }
            .u-process-box {
                background-color: #574938;
                .h(18px);
                .pr;
                .u-process-text {
                    .pa;
                    .lt(0);
                    .size(100%,100%);
                    color: #fff;
                    .fz(16px,18px);

                    .x;
                    .bold(700);
                    z-index: 3;
                }
                .u-process-item {
                    .h(100%);

                    background: linear-gradient(90deg, #3d342a 0%, #cbb79a 100%);
                }
            }
        }
    }
    .m-custom-dialog {
        background: rgba(0, 0, 0, 0.5);
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
                flex: 1;
                .x;
                .u-common-list {
                    background: linear-gradient(180deg, #000000 0%, #574938 100%);
                    border-right: 1px solid #ffffff;
                    overflow-y: auto;
                    flex-shrink: 0;
                    /* 针对Webkit内核的浏览器 */
                    &::-webkit-scrollbar {
                        /* 设置滚动条的宽度 */
                        width: 2px;
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
                        padding: 10px 0;
                        .size(100%,24px);
                        .flex;
                        .flex(o);
                        cursor: pointer;
                        color: #ffeccc;
                        .fz(14px);
                        .bold(400);
                        &:hover,
                        &.active {
                            color: #fff;
                            background: linear-gradient(90deg, #3d342a 0%, #806241 52.78%, #3d342a 100%);

                            border-bottom: 0.5px solid #706456;
                        }
                    }
                }
                .u-dialog-main_recommend {
                    .flex;
                    .u-recommend-list {
                        .size(120px,300px);
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
                .u-dialog-main_custom {
                    .flex;
                    .u-dialog-main_custom_list {
                        .w(calc(100% / 3));
                        .h(300px);
                        overflow-y: auto;
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
                    background: linear-gradient(180deg, rgba(173, 126, 16, 1) 0%, rgba(173, 126, 16, 0) 100%);

                    border: 1px solid rgba(255, 255, 255, 0.88);
                }
            }
        }
    }
}
</style>
