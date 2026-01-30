<template>
    <div class="p-mini-leap_catalogue">
        <div class="m-info-top" ref="infoTop">
            <!-- 头像列表 -->
            <div class="m-avatar-list">
                <div class="m-avatar-item" @click="handleClickCategory">
                    <div class="u-avatar-placeholder">
                        <img :src="getIconPath(category.sub)" class="u-category-icon-img" v-if="category.sub" />
                    </div>
                    <div class="m-avatar-info">
                        <div class="u-avatar-name">{{ category?.name }}</div>
                    </div>
                </div>
                <div class="m-avatar-item" v-for="item in compareRoles" :key="item.jx3id"
                    @click="handleDeleteRole(item)">
                    <RoleAvatar class="u-avatar-img" :mount="item.mount" :body_type="item.body_type" />
                    <div class="m-avatar-info">
                        <div class="u-avatar-name">{{ item.name }}</div>
                        <div class="u-avatar-server">{{ item.server }}</div>
                    </div>
                </div>

                <!-- 添加占位符 -->
                <div class="m-avatar-item m-avatar-item--add" v-for="index in 3 - compareRoles.length" :key="index">
                </div>
            </div>

            <!-- 搜索框 -->
            <Search @submit="handleSearchClick" />
        </div>
        <!-- 分类卡片 -->
        <div class="m-category-section" :style="{ height: categoryHeight + 'px' }">
            <!-- 杂闻卡片 -->
            <div class="m-category-card" v-for="(item, index) in list" :key="index" @click="handleCategoryClick(item)">
                <div class="m-category-box">
                    <div class="u-category-title">{{ item.name }}</div>
                </div>
                <div class="m-category-box" v-for="(role, roleIndex) in category.roleAchievements" :key="roleIndex">
                    <span class="u-value-text">{{ getUserProgress(role, item) }}</span>
                    <span class="u-percent-symbol">%</span>
                </div>

            </div>
        </div>
        <!-- 分类卡片抽屉 -->
        <CataloguePop :visible.sync="drawerCatalogueVisible" :category="currentCategory" :compareRoles="compareRoles"
            @handleDetailClick="handleDetailClick" :showDetailBtn="showDetailBtn" />
    </div>
</template>

<script>
import CataloguePop from '@/views/wiki_miniprogram/compare/catalogue_pop.vue'
import RoleAvatar from "@/components/wiki/RoleAvatar.vue";
import Search from "@/views/wiki_miniprogram/compare/search.vue";
import { cloneDeep } from "lodash";
import { mobileOpen } from "@/utils/minprogram";
export default {
    name: "CompareCatalogue",
    components: {
        RoleAvatar,
        CataloguePop,
        Search,
    },
    data() {
        return {
            // 容器高度
            categoryHeight: 0,
            // 自己的角色列表
            roles: [],
            //对比角色列表
            compareRoles: [],
            //成就菜单列表
            menuList: [],
            //成就点数据
            pointsData: {},
            //需要运算角色的成就ID数组，用于getAllAchievementsData
            compareAchievements: [],
            //列表
            list: [],
            category: null,
            //当前点击的分类
            currentCategory: null,
            //分类卡片抽屉是否可见
            drawerCatalogueVisible: false,
            //是否显示查看详情按钮
            showDetailBtn: true,
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
        }
    },
    created() {
        this.init()
    },
    mounted() {
        // 计算分类卡片的高度,通过获取整个body高度减去m-info-top即info-top的高度
        this.categoryHeight = document.querySelector('body').offsetHeight - document.querySelector('.m-info-top').offsetHeight
    },
    methods: {
        //点击了分类执行弹出对比抽屉（使用分类抽屉隐藏详情按钮）
        handleClickCategory() {
            this.showDetailBtn = false
            //设置当前点击的分类
            this.currentCategory = cloneDeep(this.category)
            this.drawerCatalogueVisible = true
        },
        //搜索点击事件
        handleSearchClick() {
            //跳转到compare/achievement
            mobileOpen(this.$router.resolve({
                name: "compare/achievement",
                query: {
                    //来源
                    source: 1, //1 非achievement当前页面，需要执行另一套list检索
                }
            }).href);
        },
        //初始化操作
        async init() {
            try {
                //获取缓存的成就点数据
                this.pointsData = JSON.parse(sessionStorage.getItem("points_data")) || {};
                //获取缓存的对比角色列表
                this.compareRoles = JSON.parse(sessionStorage.getItem("compare_roles")) || [];
                //获取缓存的当前点击的分类
                this.category = JSON.parse(sessionStorage.getItem("compare_category")) || {};
                this.list = this.category.children || []
            } catch (error) {
                console.error("初始化对比角色数据失败:", error);
            }
        },
        /**
         * 获取图标路径
         * @param {string} sub - 分类子项
         * @returns {string} - 图标路径
         */
        getIconPath(sub) {
            return require(`@/assets/img/wiki_miniprogram/${!this.isDark ? 'Dark' : 'Light'}/tog_${sub}.svg`);
        },
        setNumber(num, type) {
            if (!num) return ''
            const pointsStr = num.toString();
            if (type == 'w') {
                // 截取数字万字位以上内容
                return pointsStr.length > 4 ? pointsStr.slice(0, -4) : '';
            } else {
                // 截取数字万字位以下内容
                return pointsStr.length > 4 ? pointsStr.slice(-4) : pointsStr;
            }
        },
        // 分类卡片点击事件
        handleCategoryClick(item) {
            //设置是否显示查看详情按钮
            this.showDetailBtn = true
            this.currentCategory = cloneDeep(item);
            this.currentCategory.name = this.category.name + '-' + this.currentCategory.name
            let roleAchievements = []
            this.category.roleAchievements.forEach(role => {
                //运算信息
                let progressInfo = this.getUserProgress(role, item, 2)
                roleAchievements.push({
                    ...role,
                    progress: progressInfo.progress,
                    achievementCount: progressInfo.achievementCount,
                    allPoints: progressInfo.allPoints,
                    ownPoints: progressInfo.ownPoints
                })
            });
            this.currentCategory.roleAchievements = roleAchievements
            this.drawerCatalogueVisible = true;
        },
        // 分类抽屉查看详情点击事件
        handleDetailClick() {
            this.drawerCatalogueVisible = false;
            //准备进行路由跳转，进入compare_catalogue界面，需缓存当前界面部分数据以便于在下个界面使用
            sessionStorage.setItem("compare_roles", JSON.stringify(this.compareRoles || []));
            sessionStorage.setItem("compare_achievement", JSON.stringify(this.currentCategory || {}));
            mobileOpen(this.$router.resolve({
                name: "compare/achievement",
                query: {}
            }).href);
        },
        /*******************************成就点数及计算相关函数*****************************/
        /**
         * 获取用户进度
         * @param {object} role - 角色对象
         * @param {object} item - 分类子项
         * @param {number} type - 进度类型，1为界面渲染，2为详情弹窗，需要输出进度、成就数、总资历
         * @returns {string} - 用户进度
         */
        getUserProgress(role, item, type = 1) {
            if (!role || !item || !this.pointsData) {
                return '0.00';
            }

            let allPoints = 0;
            let ownPoints = 0;
            let achievementCount = 0;
            const calculateAchievements = (achievements) => {
                achievements.forEach(achievement => {
                    if (Array.isArray(achievement)) {
                        calculateAchievements(achievement);
                    } else {
                        const points = this.pointsData[achievement] || 0;
                        allPoints += points;
                        achievementCount++;
                        if (role.ownAchievements && role.ownAchievements.includes(achievement)) {
                            ownPoints += points;
                        }
                    }
                });
            };

            calculateAchievements(item.achievements);

            if (allPoints === 0) {
                return '0.00';
            }

            return type == 1 ? (ownPoints / allPoints * 100).toFixed(2) : {
                progress: (ownPoints / allPoints * 100).toFixed(2),
                achievementCount: achievementCount,
                allPoints: allPoints,
                ownPoints: ownPoints
            };
        },
    }
};
</script>

<style lang="less" scoped>
.p-mini-leap_catalogue {
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

            &.m-avatar-item--add {
                position: relative;

                .u-avatar-add-quan,
                .u-avatar-add-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .u-avatar-add-icon {
                    z-index: 2;
                }
            }

            .u-category-icon-img {
                width: 80px;
                height: 80px;
                margin-bottom: 4px;
            }

            .u-avatar-img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                margin-bottom: 8px;
            }

            .m-avatar-info {
                text-align: center;

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

        .m-category-card {
            background-color: #FFFFFF;

            box-sizing: border-box;
            margin-bottom: 12px;
            display: flex;
            justify-content: flex-start;
            // &:last-child {
            //     margin-bottom: 0;
            // }

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
                width: 100%;
            }

            .u-category-title {
                // color: rgba(28, 28, 28, 0.40);
                color: #24292E;
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 20px;
            }

            .u-value-text,
            .u-percent-symbol {
                color: rgba(28, 28, 28, 0.80);
                font-style: normal;
                font-weight: 700;
            }

            .u-value-text {
                font-size: 24px;
                line-height: 30px;
            }

            .u-percent-symbol {
                font-size: 12px;
                line-height: 18px;
            }
        }
    }
}

/**
 * 暗黑模式样式@media screen and (width: 390px)
 */
// @media (prefers-color-scheme: dark)

@media (prefers-color-scheme: dark) {
    .p-mini-leap_catalogue {
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
