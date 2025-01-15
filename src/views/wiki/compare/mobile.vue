<template>
    <div class="p-compare-mobile" :class="{ fold: isFold }">
        <!-- 用户信息及切换筛选位置、 -->
        <div class="m-overview-header_mobile">
            <div class="u-name">
                <!-- 折叠侧栏按钮 -->
                <!-- el-icon-s-fold -->
                <i :class="!isFold ? 'el-icon-s-fold ' : 'el-icon-s-unfold'" @click="changeFold" />&nbsp;
            </div>

            <div class="u-select">
                <!-- <el-dropdown trigger="click">
                    <div class="u-select-btn">
                        <span>{{ selectTabName }}</span>
                        <img src="@/assets/img/wiki/overview/toggle-user-icon.svg" alt="" width="16px" height="16px" />
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in selectOptions" :key="item.value">
                            <div
                                @click="selectTabChange(item)"
                                class="m-role-item"
                                :class="{
                                    active: item.value == selectTab,
                                }"
                            >
                                <span>{{ item.name }}</span>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <el-select
                    v-model="selectTab"
                    placeholder="请选择"
                    multiple
                    collapse-tags
                    clearable
                    @change="selectTabChange"
                >
                    <el-option v-for="item in selectOptions" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <!--成就分类 -->
        <div class="m-achievement-tab" v-show="!isFold">
            <ul
                class="u-zl-item"
                :class="{ active: item.sub == activeIndex, show: item.sub == activeIndex && !activeShow }"
                v-for="(item, index) in menuList"
                :key="index"
                @click="setActiveIndex(item.sub)"
            >
                <div class="u-zl-item_title">
                    {{ item.name }}&nbsp;<i
                        :class="item.sub == activeIndex && activeShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
                        @click.stop="setActiveShow(item.sub)"
                    ></i>
                </div>
                <li
                    class="u-zl-item_children"
                    :class="{ active: item2.detail == activeIndexChildren }"
                    v-for="(item2, index2) in item.children"
                    :key="index2"
                    @click.stop="setActiveIndex(item.sub, item2.detail)"
                >
                    {{ item2.name }}
                </li>
            </ul>
        </div>
        <!-- 对比主要位置，左侧收缩后展开为最宽调整p-compare-mobile类包裹的宽度 -->
        <div class="m-compare-main">
            <!-- 竖向布局 -->
            <div class="u-zl-box">
                <div class="u-zl_table" :style="'max-width:' + (contrastKith.length + 1) * 60 + 120 + 'px'">
                    <div class="u-table_label ps">
                        <span class="u-compare-title">亲友对比</span>
                    </div>
                    <!-- 对比亲友及自身 -->
                    <div class="u-table_label kith" v-for="(item, index) in contrastKith" :key="index">
                        <!-- <div class="u-name" v-if="index == 0">{{ item.name.slice(0, 1) }}</div> -->
                        <el-dropdown trigger="click">
                            <div class="u-name">{{ item.name.slice(0, 1) }}</div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <div @click="delRole(item, index)">删除</div>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="u-table_label add" @click="addRole">
                        <i class="el-icon-circle-plus-outline u-add-icon"></i>
                    </div>
                </div>
                <div class="u-zl_cell" :style="'max-width:' + (contrastKith.length + 1) * 60 + 120 + 'px'">
                    <div class="u-zl-list ps">
                        <div class="u-zl-list_item" v-for="(item, index) in achievements" :key="index">
                            <span class="u-name">[{{ item?.Name }}]</span>
                        </div>
                    </div>
                    <div class="u-zl-list" v-for="(item, index) in contrastKith" :key="index">
                        <div class="u-zl-list_item kith" v-for="(item2, index2) in item.achievements" :key="index2">
                            <div class="u-self-checked" :class="{ finish: item2.value != '-1' }">
                                <i class="el-icon-check" />
                            </div>
                        </div>
                    </div>
                    <div class="u-zl-list add">
                        <div class="u-zl-list_item kith" v-for="(item2, index2) in achievements" :key="index2"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 添加角色弹窗 -->
        <el-dialog title="添加角色" :visible.sync="showAddRole" width="400px" draggable :close-on-click-modal="false">
            <el-form :model="kithForm" :rules="rules" ref="roleRef">
                <el-form-item label="角色类型" prop="roleType">
                    <el-radio-group
                        v-model="kithForm.roleType"
                        @input="
                            kithForm.userId = '';
                            kithForm.jx3Id = '';
                        "
                    >
                        <el-radio label="1">自身</el-radio>
                        <el-radio label="2">亲友</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="我的亲友" prop="uid" v-if="kithForm.roleType == 2">
                    <el-select v-model="kithForm.uid" placeholder="请选择" @change="getKithRolesList">
                        <el-option
                            :label="item?.kith_info?.display_name || '-'"
                            :value="item.kith_id"
                            v-for="(item, index) in myKith"
                            :key="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="对应角色" prop="jx3Id">
                    <el-select v-model="kithForm.jx3Id" placeholder="请选择对应角色" @change="setRoleInfo">
                        <el-option
                            :label="item.name"
                            :value="item.jx3id"
                            v-for="(item, index) in kithForm.roleType == 1 ? roleList : myKithRoles"
                            :key="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showAddRole = false">取 消</el-button>
                <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getRoleGameAchievements,
    getMenuAchievements,
    getMenus,
    getVirtualRoleAchievements,
} from "@/service/achievement";
import { getMyKith, getMyKithRoles } from "@/service/wiki";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import { getUserRoles } from "@/service/team";
import { cloneDeep } from "lodash";
export default {
    components: {},
    data() {
        return {
            isFold: false, //侧栏是否隐藏
            currentRole: {}, //当前角色
            menuList: [],
            selectTab: "",
            selectTabName: "请选择筛选条件",
            selectOptions: [
                // {
                //     name: "请选择筛选条件",
                //     value: "",
                // },
                {
                    name: "共同未完成的",
                    value: 1,
                },
                // {
                //     name: "我未完成的",
                //     value: 2,
                // },
            ],
            activeIndex: 1,
            activeShow: true,
            activeIndexChildren: null,
            achievements: [],
            achievements_bak: [],
            showAddRole: false,
            myKith: [],
            myKithRoles: [],
            roleList: [],
            kithForm: {
                uid: "",
                jx3Id: "",
            },
            rules: {
                roleType: { required: true, message: "请选择类型", trigger: "change" },
                uid: { required: true, message: "请选择亲友", trigger: "change" },
                jx3Id: { required: true, message: "请选择角色", trigger: "change" },
            },
            contrastKith: [], //对比的亲友及自身
            contrastKith_bak: [], //对比的亲友及自身
        };
    },
    created() {
        this.getList();

        this.loadUserRoles();
    },
    mounted() {},
    methods: {
        changeFold() {
            this.isFold = !this.isFold;
            this.$store.commit("SET_STATE", { key: "is_fold", value: this.isFold });
        },
        icon_url: function (id) {
            return iconLink(id);
        },
        setActiveShow(sub) {
            if (this.activeIndex == sub) {
                this.activeShow = !this.activeShow;
                return;
            }
            this.setActiveIndex(sub);
        },
        setActiveIndex(sub, detail) {
            if (this.activeIndex != sub && !detail) {
                this.activeShow = true;
            }

            this.activeIndex = sub;
            if (detail) {
                this.activeIndexChildren = detail;
            } else {
                this.activeIndexChildren = null;
            }
            // this.selectTab = "";
            this.getMenuAchievements(sub, detail);
        },
        // 获取成就菜单列表
        getList() {
            getMenus({
                general: 1,
                client: "std",
            }).then((res) => {
                const data = res.data.data.menus;
                this.menuList = data;
                this.getMenuAchievements();
            });
        },
        // 获取成就列表
        getMenuAchievements(sub = 1, detail) {
            getMenuAchievements(sub, detail).then((data) => {
                let list = data.data.data.achievements || [];
                let arr = [];
                list.forEach((item) => {
                    arr.push(item);
                    if (item.SeriesAchievementList) {
                        item.SeriesAchievementList.forEach((sub, index) => {
                            if (index > 0) {
                                arr.push(sub);
                            }
                        });
                    }
                });
                this.achievements = arr;
                this.achievements_bak = cloneDeep(this.achievements);
                this.queryFinish(1); //查询完成情况
                this.selectTabChange();
            });
        },
        addRole() {
            this.kithForm = {
                roleType: "1",
                userId: "",
                jx3Id: "",
            };
            this.showAddRole = true;
            this.$nextTick(() => {
                this.$refs.roleRef.clearValidate(); // 清除表单验证
            });
        },
        //获取我的亲友
        getMyKith() {
            getMyKith().then((res) => {
                this.myKith = res.data.data;
            });
        },
        // 获取当前用户角色列表
        loadUserRoles() {
            if (!User.isLogin()) {
                this.$confirm("请先登录").then((_) => {
                    User.toLogin(window.location.href);
                });
                return;
            }

            getUserRoles().then((res) => {
                this.roleList = res.data?.data?.list || [];
                this.currentRole = res.data?.data?.list[0] || {};

                if (this.currentRole?.jx3id) this.addRoleConfirm(this.currentRole.jx3id, 1);
                this.getMyKith(); //获取我的亲友
            });
        },
        onChangeRole(role) {
            this.currentRole = role;
            this.selectTab = "";
            this.addRoleConfirm(this.currentRole.jx3id, 1);
        },
        getKithRolesList() {
            getMyKithRoles(this.kithForm.uid).then((res) => {
                this.myKithRoles = res.data.data;
                this.kithForm.jx3Id = "";
            });
        },
        //删除角色
        delRole(role, index) {
            this.contrastKith.splice(index, 1);
            this.selectTab = "";
            let arr = [],
                selectOptions = cloneDeep(this.selectOptions);
            selectOptions.forEach((item, index) => {
                if (item.value !== role.jx3id) {
                    arr.push(item);
                }
            });
            this.selectOptions = arr;
            this.selectTabChange();
        },
        setRoleInfo(value) {
            // if (this.kithForm.roleType == 1) {
            //     let info = this.roleList.find((item) => item.jx3id == value);
            //     this.kithForm.info = info;
            // } else {
            //     let info = this.myKithRoles.find((item) => item.jx3id == value);
            //     this.kithForm.info = info;
            // }
            let info = this.myKithRoles.find((item) => item.jx3id == value);
            this.kithForm.info = info;
        },
        //获取对应角色成就列表
        addRoleConfirm(jx3Id, type) {
            getRoleGameAchievements(type == 1 ? jx3Id : this.kithForm.jx3Id).then((res) => {
                const achievements = res.data?.data?.achievements || "";
                let contrastKith = {};
                if (type) {
                    contrastKith = {
                        ...this.currentRole,
                        my_achievements: achievements.split(","),
                        achievements: [],
                    };
                } else {
                    contrastKith = {
                        ...this.kithForm.info,
                        my_achievements: achievements.split(","),
                        achievements: [],
                    };
                }
                //同时向select内追加个人选择
                this.selectOptions.push({
                    value: contrastKith.jx3id,
                    name: contrastKith.name + "未完成",
                });
                if (type == 1 && this.contrastKith[0]) {
                    this.$set(this.contrastKith, 0, contrastKith);
                } else {
                    this.contrastKith.push(contrastKith);
                }

                this.showAddRole = false;
                this.queryFinish();
            });
        },
        //判断成就是否完成
        queryFinish(type) {
            let kith = this.contrastKith,
                achievements = this.achievements;
            kith.forEach((item, index) => {
                this.contrastKith[index].achievements = [];
                achievements.forEach((achievement, index2) => {
                    if (item.my_achievements.includes(achievement.ID.toString())) {
                        this.contrastKith[index].achievements.push({ key: index2, value: achievement.ID.toString() });
                    } else {
                        this.contrastKith[index].achievements.push({ key: index2, value: "-1" });
                    }
                });
            });
            if ((!this.selectTab && this.selectTab.length == 0) || type) {
                this.contrastKith_bak = cloneDeep(this.contrastKith);
            }
        },
        //多数组取交集
        getIntersectionByKey(arrays, key) {
            if (arrays.length === 0) {
                return [];
            }
            // 将每个对象数组映射为只包含指定键值的数组
            const mappedArrays = arrays.map((array) => array.map((obj) => obj[key]));
            if (typeof this.selectTab == "object" && this.selectTab instanceof Array) {
                return [...new Set(mappedArrays.flat())];
            }
            // 使用 reduce 方法进行交集操作
            return mappedArrays.reduce((acc, curr) => {
                return acc.filter((value) => curr.includes(value));
            });
        },
        //根据条件筛选
        selectTabChange() {
            let selectTab = this.selectTab,
                value = "";
            let achievements = cloneDeep(this.achievements_bak);
            let contrastKith = cloneDeep(this.contrastKith_bak);
            if (!selectTab || selectTab.length == 0) {
                this.achievements = achievements;
                this.queryFinish();
                return;
            }
            if (selectTab[selectTab.length - 1] == 1) {
                value = 1;
                this.selectTab = [value];
            }
            if (selectTab.length > 1 && selectTab[0] == 1) {
                value = selectTab[selectTab.length - 1];
                this.selectTab = [value];
            }
            if (selectTab.length == 1 && selectTab[0] != 1) value = selectTab[0];
            if (selectTab.length > 1 && (selectTab[0] != 1 || selectTab[selectTab.length - 1] != 1)) value = selectTab;
            let arr = [];
            contrastKith.forEach((item, index) => {
                let a = [];
                const ach_filter = function (array) {
                    array.forEach((item2, index2) => {
                        if (item2.value == "-1") {
                            a.push({ key: item2.key, value: item2.value });
                        }
                    });
                    arr.push(a);
                };
                if (value == 2 && index == 0) {
                    ach_filter(item.achievements);
                } else if (value == 1) {
                    ach_filter(item.achievements);
                } else if (item.jx3id == value) {
                    ach_filter(item.achievements);
                } else if (typeof value == "object" && value instanceof Array && value.includes(item.jx3id)) {
                    ach_filter(item.achievements);
                }
            });
            let keys = this.getIntersectionByKey(arr, "key");
            let achievementsFilter = [];
            keys.map((item) => {
                this.achievements_bak[item] ? achievementsFilter.push(this.achievements_bak[item]) : "";
            });
            this.achievements = achievementsFilter;
            this.queryFinish();
        },
    },
};
</script>

<style lang="less" scoped>
.p-compare-mobile {
    height: calc(100vh - 40px);
    width: calc(100vw - 137px);
    &.fold {
        width: 100vw;
    }
    padding-top: 40px;
    .m-overview-header_mobile {
        position: fixed;
        .z(21);
        width: 100vw;
        .lt(0);
        background-color: #fff;
        .h(40px);
        padding: 8px 24px;
        box-sizing: border-box;
        .flex;
        align-items: center;
        justify-content: space-between;
        .u-name {
            .fz(16px,24px);
            .bold(400);
            color: rgba(181, 148, 87, 1);
            .flex;
            .flex(o);
        }
        .u-toggle-btn {
            .size(60px,18px);
            .r(4px);
            border: 1px solid #bfb8ac;
            .flex;
            .flex(o);
            .fz(12px);
            .bold(400);
            color: rgba(191, 184, 172, 1);
        }
        .u-select {
            // border: 1px solid #bfb8ac;
            .h(32px);
            box-sizing: border-box;
            min-width: 140px;
            .el-select {
                .h(100%);
                :deep(.el-input),
                :deep(.el-input__inner) {
                    .h(100%);
                }
                :deep(.el-input__suffix) {
                    .flex;
                    .flex(o);
                }
                :deep(.el-select__tags) {
                    max-width: 100% !important;
                }
            }
            .u-select-btn {
                .flex;
                .flex(o);
                .fz(12px);
                .bold(400);
                color: rgba(191, 184, 172, 1);
            }
        }
        .u-add-btn {
            .size(24px);
            color: #e2d3b9;
            .u-add-icon {
                .fz(24px);
            }
        }
    }
    // 成就分类
    .m-achievement-tab {
        position: fixed;
        left: 10px;
        bottom: 10px;
        height: calc(100vh - 360px);
        .w(127px);
        overflow: auto;
        background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
        padding: 0 14px;
        box-sizing: border-box;
        .u-zl-item {
            color: #ffeccc;
            padding: 0;
            &.active {
                .u-zl-item_title {
                    color: #fff;
                    background: #3d342a;
                }
                .u-zl-item_children {
                    transition: display 0.5s ease-out;
                    display: block;
                }
            }
            &.show {
                .u-zl-item_children {
                    display: none;
                    transition: display 0.5s ease-out;
                }
            }
            .u-zl-item_title {
                .fz(14px);
                padding: 4px;
                .bold(700);
            }
            .u-zl-item_children {
                .bold(400);
                .fz(12px);
                display: none;
                color: rgba(255, 236, 204, 1);
                padding: 4px 0 4px 10px;
                .pr;
                &.active {
                    background: #3d342a;
                    color: #fff;
                    &::before {
                        content: "";
                        .ps;
                        .lt(0,50%);
                        .size(4px);
                        transform: translateY(-50%);
                        background-color: #fff;
                        .r(50%);
                        .dbi;
                    }
                }
            }
        }
    }
    .m-compare-main {
        .size(100%,100%);
        .flex;
        .u-zl-box {
            .h(100%);
            max-width: 642px;
            overflow: auto;
            .pr;
            .fz(14px);
            .bold(400);
        }
        // 表格顶部
        .u-zl_table {
            .flex;
            .w(100%);
            position: sticky;
            top: 0;
            .z(3);
            .u-table_label {
                // .size(120px,50px);
                .h(50px);
                flex-shrink: 0;
                background-color: #12100e;
                padding: 0px 12px 0px 12px;
                box-sizing: border-box;
                color: #ffeccc;
                .flex;
                .flex(o);
                .u-name {
                    color: #fff;
                    .size(28px);
                    border-radius: 14px;
                    background: rgba(181, 148, 87, 1);
                    .flex;
                    .flex(o);
                }

                &.kith,
                &.add {
                    .w(60px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    justify-content: center;
                }
                &.add {
                    .fz(24px);
                }
                &.ps {
                    .w(120px);
                    position: sticky;
                    left: 0;
                    .z(2);
                    .u-compare-title {
                        .fz(20px);
                        color: #fff;
                        mask-image: linear-gradient(180deg, rgba(255, 255, 255, 1) 43.06%, rgba(255, 255, 255, 0) 100%);
                    }
                }
                i {
                    cursor: pointer;
                }
            }
        }
        .u-zl_cell {
            .h(calc(100% - 50px));
            .flex;
            .w(100%);
        }

        .u-zl-list {
            .size(60px,100%);
            flex-shrink: 0;
            &.ps {
                .w(120px);
                position: sticky;
                left: 0;

                .z(2);
                .u-zl-list_item {
                    .pl(12px);
                    align-items: center;
                }
            }
            &.add {
            }
            .u-zl-list_item {
                color: #ffeccc;
                .w(100%);
                min-height: 36px;
                .flex;

                &:nth-child(odd) {
                    background: #ebe5df;
                }
                &:nth-child(even) {
                    background: #fff;
                }
                &.kith {
                    .flex(o);
                }

                .u-self-checked {
                    .size(24px);
                    background: #fff;
                    border: 1px solid #6e6e6d;
                    .r(4px);
                    i {
                        .fz(24px);
                        .bold(600);
                        color: #000;
                        display: none;
                    }
                    &.finish {
                        background: linear-gradient(180deg, rgba(181, 148, 87, 1) 0%, rgba(227, 211, 191, 1) 100%);
                        i {
                            display: block;
                        }
                    }
                }
            }

            .u-name {
                color: #846b4b;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 140px;
            }
        }
    }
}
</style>
