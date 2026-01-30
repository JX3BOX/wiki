<template>
    <div class="p-mini-leap_achievement">
        <div class="m-info-top" ref="infoTop">
            <!-- 头像列表 -->
            <div class="m-avatar-list">
                <div class="m-avatar-item" @click="handleClickCategory">
                    <div class="m-avatar-info">
                        <div class="u-avatar-name u-category-name">
                            <div v-for="(item, index) in setCategoryName" :key="index">{{ item }}</div>
                        </div>
                    </div>
                </div>
                <div class="m-avatar-item" v-for="(item, index) in compareRoles" :key="'role_' + index">
                    <RoleAvatar class="u-avatar-img" :mount="item.mount" :body_type="item.body_type" />
                    <div class="m-avatar-info">
                        <div class="u-avatar-name">{{ item.name }}</div>
                        <div class="u-avatar-server">{{ item.server }}</div>
                    </div>
                </div>

                <!-- 添加占位符 -->
                <div class="m-avatar-item m-avatar-item--add" v-for="index in 3 - compareRoles.length"
                    :key="'add_' + index">

                </div>
            </div>

            <!-- 搜索框 -->
            <Search :showFilter="true" :roles="compareRoles" @filterSubmit="handleFilterSubmit"
                @submit="handleSearchClick" />
        </div>
        <!-- 分类卡片 -->
        <div class="m-category-section"
            :style="{ height: categoryHeight + 'px', 'padding-bottom': isModeEnabled ? '90px' : '0px' }">
            <!-- 卡片 -->
            <div class="m-category-card" v-for="(item, index) in list" :key="'category_' + index">
                <div class="m-category-box" @click="handleClickCategory(item)">
                    <img class="u-category-icon-img" :src="iconLink(item?.IconID)" />
                    <div class="u-category-title">{{ item.Name }}</div>
                </div>
                <div class="m-category-box" v-for="(isFinish, roleIndex) in item.roles" :key="roleIndex">
                    <img :src="require(`@/assets/img/wiki_miniprogram/finish.svg`)" class="u-icon" v-if="isFinish" />
                    <img :src="require(`@/assets/img/wiki_miniprogram/unfinished.svg`)" class="u-icon" v-else />
                </div>

            </div>
        </div>
        <!-- 筛选悬浮框 -->
        <!-- 激活模式常驻显示 -->
        <div class="u-mode" v-if="isModeEnabled">
            <div class="u-mode-item">
                仅显示{{ isModeName }}的成就
            </div>
        </div>
        <!-- 分类卡片抽屉 -->
        <CataloguePop :visible.sync="drawerCatalogueVisible" :category="currentCategory" :compareRoles="compareRoles"
            :showDetailBtn="false" />
        <!-- 详细信息弹窗 -->
        <achievement_detail ref="achievementDetail" v-if="achievementDetailVisible"
            :visible.sync="achievementDetailVisible" :current.sync="current"></achievement_detail>
    </div>
</template>

<script>
import CataloguePop from '@/views/wiki_miniprogram/compare/catalogue_pop.vue'
import achievement_detail from "@/views/wiki_miniprogram/components/achievement_detail.vue"
import RoleAvatar from "@/components/wiki/RoleAvatar.vue";
import Search from "@/views/wiki_miniprogram/compare/search.vue";
import { cloneDeep } from "lodash";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";
import {
    getMenuAchievements,
} from "@/service/achievement";
export default {
    name: "CompareCatalogue",
    components: {
        RoleAvatar,
        CataloguePop,
        Search,
        achievement_detail,
    },
    data() {
        return {
            // 容器高度
            categoryHeight: 0,
            // 自己的角色列表
            roles: [],
            //对比角色列表
            compareRoles: [],
            //对比角色的成就数据
            roleAchievements: [],
            //成就点数据
            pointsData: {},
            //列表
            list: [],
            //备份列表，用于筛选操作
            list_bak: [],
            category: null,
            //当前点击的分类
            currentCategory: null,
            //分类卡片抽屉是否可见
            drawerCatalogueVisible: false,
            //是否启用了搜索功能
            isSearchEnabled: false,
            //详细信息弹窗是否可见
            achievementDetailVisible: false,
            //当前点击的成就
            current: null,
            //是否启用了常驻提示功能
            isModeEnabled: false,
            //当前常驻提示的名称
            isModeName: '',
        };
    },
    computed: {
        /**
         * 是否为暗黑模式
         * @returns {boolean} - 是否为暗黑模式
         */
        isDark() {
            const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
            return mediaQueryList.matches;
        },
        /**
         * 设置分类名称
         * @returns {string} - 分类名称
         */
        setCategoryName() {
            if (this.isSearchEnabled) return []
            let name = this.category?.name || null
            if (!name) return []
            //使用-分割分类名字为数组
            return name.split('-') || []
        },
    },
    created() {
        document.title = '亲友对比'
        this.init()
    },
    mounted() {
        // 计算分类卡片的高度,通过获取整个body高度减去m-info-top即info-top的高度
        this.categoryHeight = document.querySelector('body').offsetHeight - document.querySelector('.m-info-top').offsetHeight
    },
    methods: {
        iconLink,
        //点击了成就执行弹出详细信息弹窗
        handleClickCategory(item) {
            this.current = cloneDeep(item)
            this.achievementDetailVisible = true
        },

        //筛选点击事
        handleFilterSubmit(res) {
            if (!res.filterId) {
                this.isModeEnabled = false
                this.list = cloneDeep(this.list_bak)
                return;
            }
            this.isModeEnabled = true
            this.isModeName = res.filterLabel
            //filterId格式为id_completed或id_uncompleted
            let filter = res.filterId.split('_')
            let index = this.compareRoles.findIndex((item) => item.ID == filter[0])

            if (filter[1] == 'completed') {
                //筛选指定ID已完成的成就 roles下标为true的数据
                this.list = this.list_bak.filter((item) => item.roles[index]);
            } else {
                //筛选指定ID未完成的成就 roles下标为false的数据
                this.list = this.list_bak.filter((item) => !item.roles[index]);
            }

        },
        //搜索点击事件
        handleSearchClick(arr) {
            this.isSearchEnabled = true;
            this.handleRoleAchievements(cloneDeep(arr))
        },
        //初始化操作
        async init() {
            try {
                //获取缓存的成就点数据
                this.pointsData = JSON.parse(sessionStorage.getItem("points_data")) || {};
                //获取缓存的对比角色列表
                this.compareRoles = JSON.parse(sessionStorage.getItem("compare_roles")) || [];
                if (this.$route.query.source == 1) {
                    //如果是从搜索页面跳转过来的，则从sessionStorage中获取搜索结果
                    let list = JSON.parse(sessionStorage.getItem("search_achievements")) || [];
                    this.isSearchEnabled = true;
                    this.handleRoleAchievements(cloneDeep(list))
                } else {
                    //获取缓存的当前点击的分类
                    this.category = JSON.parse(sessionStorage.getItem("compare_achievement")) || {};
                    this.roleAchievements = this.category.roleAchievements || []
                    this.getMenuAchievements()
                }

            } catch (error) {
                console.error("初始化对比角色数据失败:", error);
            }
        },
        // 获取成就列表
        getMenuAchievements() {
            let sub = this.category.sub, detail = this.category.detail
            getMenuAchievements(sub, detail)
                .then((data) => {
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
                    // this.list = arr
                    this.handleRoleAchievements(arr)
                })
        },
        //处理对比角色完成数据
        handleRoleAchievements(arr) {
            let roleAchievements = this.roleAchievements || []
            let isSearchEnabled = this.isSearchEnabled
            let compareRoles = this.compareRoles
            arr.map((item) => {
                let roles = []
                //如果启用了搜索，则判断finishAchievements是否包含item.ID
                if (isSearchEnabled) {
                    compareRoles.map((role) => {
                        //判断item.ID是否在role.finishAchievements中
                        if (role.finishAchievements.includes(String(item.ID))) {
                            roles.push(true)
                        } else {
                            roles.push(false)
                        }
                    })
                } else {
                    //循环对比角色，判断完成数据
                    roleAchievements.map((role) => {

                        //判断item.ID是否在role.ownAchievements中
                        if (role.ownAchievements.includes(item.ID)) {
                            roles.push(true)
                        } else {
                            roles.push(false)
                        }
                    })
                }
                item.roles = roles
            })
            this.list = arr
            this.list_bak = cloneDeep(arr)
        }
    }
};
</script>

<style lang="less" scoped>
.p-mini-leap_achievement {
    height: 100vh;
    background-color: #F5F5F5;
    overflow: hidden;


    // 头像列表
    .m-avatar-list {
        display: flex;
        justify-content: space-between;
        background-color: #24292e;
        margin-bottom: 4px;
        padding: 12px 0;

        .m-avatar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            //一行4个
            width: calc(100% / 4);

            .u-avatar-img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-bottom: 8px;
            }

            .m-avatar-info {
                text-align: center;
                width: 100%;

                .u-category-name {
                    text-align: left;
                    padding: 0 12px;
                    box-sizing: border-box;
                }

                .u-avatar-name {
                    color: #FEDAA3;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 20px;
                }

                .u-avatar-server {
                    color: rgba(255, 255, 255, 0.40);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                }
            }
        }
    }

    // 分类卡片区域
    .m-category-section {
        overflow-y: auto;
        box-sizing: border-box;

        .m-category-card {
            background-color: #FFFFFF;
            box-sizing: border-box;
            margin-bottom: 12px;
            display: flex;
            justify-content: flex-start;

            .m-category-box {
                padding: 12px;
                box-sizing: border-box;
                width: calc(100% / 4);
                min-height: 100px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-right: 0.5px solid rgba(28, 28, 28, 0.05);
                border-left: 1px solid rgba(28, 28, 28, 0.05);

                &:first-child {
                    border-left: none;
                }

                &:last-child {
                    border-right: none;
                }
            }

            .u-category-icon-img {
                width: 30px;
                margin-bottom: 4px;
            }



            .u-category-title,
            .u-value-text {
                color: rgba(28, 28, 28, 0.80);
                font-style: normal;
                font-weight: 700;
            }

            .u-category-title {
                font-size: 14px;
                line-height: 20px;
            }

            .u-value-text {
                font-size: 24px;
                line-height: 30px;
            }
        }
    }

    //激活常驻模式
    .u-mode {
        position: fixed;
        bottom: 0;
        left: 0;
        border-radius: 20px 20px 0 0;
        background: #24292E;
        width: 100%;
        display: flex;
        padding: 20px 0 36px 0;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;

        .u-mode-item {
            color: #FEDAA3;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
        }
    }
}

.not-on-bottom {
    &::after {
        bottom: 60px !important;
    }
}

/**
 * 暗黑模式样式@media screen and (width: 390px)
 */
// @media (prefers-color-scheme: dark)

@media (prefers-color-scheme: dark) {
    .p-mini-leap_achievement {
        background-color: #000;

        .m-avatar-list {
            background-color: #fedaa3;

            .m-avatar-item {
                .m-avatar-info {
                    .u-avatar-name {
                        color: #24292e;
                    }

                    .u-avatar-server {
                        color: rgba(28, 28, 28, 0.40);
                    }
                }
            }

        }

        .m-progress-section {
            background-color: #fedaa3;

            .u-progress-label,
            .m-progress-value {
                color: #24292e;
            }
        }

        .m-category-section {
            .m-category-card {

                background: #282828;

                .m-category-box {
                    border: 0.5px solid rgba(255, 255, 255, 0.10);

                }

                .u-category-title {
                    color: rgba(255, 255, 255, 0.40);
                }

                .u-value-text,
                .u-percent-symbol {
                    color: rgba(255, 255, 255, 0.80);
                }
            }
        }
    }
}
</style>
