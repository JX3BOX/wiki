<template>
    <div class="c-var p-mobile-item">
        <div
            class="m-page-container"
            :class="{ 'is-center': !planList.length }"
            ref="pageContainer"
            v-loading="loading"
        >
            <div class="m-big-search" v-if="!planList.length" @click="onCreatePlan">
                <img class="u-search-icon" src="@/assets/img/add_plan.svg" svg-inline />
                <div class="u-info">
                    <span class="u-title">创建清单</span>
                    <span class="u-tip">加入自己想要的物品</span>
                </div>
            </div>
            <div class="m-plan-list" v-if="planList.length">
                <div class="m-plan-item" v-for="item in planList" :key="item.id" @click="toViewPlan(item.id)">
                    <span class="u-title">{{ item.title }}</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>

        <el-button class="m-to-top" @click="scrollToTop">
            <img svg-inline src="@/assets/img/totop.svg" alt="" />
        </el-button>
        <suspend-common
            class="u-suspend-common"
            :btn-options="{
                showHome: true,
                showIcon: false,
                showMore: true,
            }"
            :drawer-options="{
                hideType: ['collect', 'rss', 'laterOn', 'user', 'report', 'pin'],
                direction: 'btt',
            }"
            style="width: 100%"
            @search="onSearch"
            ref="suspendCommon"
        >
            <template #default>
                <div class="m-more-action">
                    <div class="u-action" @click="onCreatePlan">
                        <img src="@/assets/img/add_plan.svg" svg-inline />
                        创建清单
                    </div>
                </div>
            </template>
        </suspend-common>
        <CreatePlanDrawerVue ref="create-plan-drawer"></CreatePlanDrawerVue>
    </div>
</template>

<script>
import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import CreatePlanDrawerVue from "@/components/item/mobile/create-plan-drawer.vue";
import { getMyPlans, getItemPlanID, updatePlan } from "@/service/item-plan.js";

export default {
    name: "MobileItemPlanList",
    components: { SuspendCommon, CreatePlanDrawerVue },
    data() {
        return {
            planList: [],
            loading: false,
        };
    },
    computed: {},
    methods: {
        loadPlans() {
            this.loading = true;
            getMyPlans({
                no_page: 1,
                _no_cache: 1,
            })
                .then((res) => {
                    this.planList = res || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        toView(id) {
            this.$router.push({ name: "view", params: { item_id: id } });
        },
        toViewPlan(id) {
            this.$router.push({ name: "plan_view", params: { plan_id: id } });
        },
        scrollToTop() {
            this.$refs["pageContainer"].scrollTo({ top: 0, behavior: "smooth" });
        },
        onCreatePlan() {
            this.$refs["create-plan-drawer"]
                .open()
                .then((res) => {
                    const id = res.data.data.id;
                    this.toViewPlan(id);
                })
                .catch((e) => {});
        },
        onSearch() {
            this.$router.push({ name: "home" });
        },
    },
    mounted() {
        this.loadPlans();
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.p-mobile-item {
    background: #f1f1f1;
    @media (prefers-color-scheme: dark) {
        background: #000;
    }

    font-family: "Microsoft YaHei UI";
    font-style: normal;

    display: flex;
    flex-direction: column;
    .size(100vw, 100vh);

    .m-page-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 0;
        gap: 20px;
        padding: 20px;
        margin-bottom: 76px;

        overflow-y: auto;

        &.is-center {
            justify-content: center;
        }
    }

    .m-to-top {
        position: fixed;
        .size(40px);
        background-color: var(--primary-brand-2, #fedaa3);
        color: var(--primary-brand-3, #24292e);
        bottom: 90px;
        right: 20px;
        .r(100%);
        .flex;
        align-items: center;
        justify-content: center;
    }

    .m-big-search {
        display: flex;
        padding: 12px 20px;
        justify-content: center;
        align-items: center;
        gap: 12px;
        border-radius: 8px;
        background: var(--black-5, rgba(255, 255, 255, 0.1));
        color: var(--primary-brand-2, #24292e);

        .u-search-icon {
            width: 120px;
            height: 120px;
            flex-shrink: 0;
            aspect-ratio: 1/1;
        }

        .u-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .u-title {
            font-size: 24px;
            font-weight: 700;
            line-height: 30px; /* 125% */
        }

        .u-tip {
            font-size: 16px;
            font-weight: 700;
            line-height: 24px; /* 150% */
        }
    }

    .m-plan-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
    }

    .m-plan-item {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        padding: 17px 20px;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        background: var(--primary-brand-4, #fff);

        color: var(--black-100, #1c1c1c);
        text-align: center;

        font-family: "Microsoft YaHei UI";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
        gap: 12px;

        .u-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .u-suspend-common {
        padding-bottom: 2rem;
        margin: 0;
        .m-base {
            width: 100%;
            .m-more-action {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;

                .u-action {
                    display: flex;
                    height: 24px;
                    justify-content: center;
                    align-items: center;
                    flex: 1 0 0;
                    gap: 6px;

                    &.disabled {
                        img {
                            opacity: 0.5;
                        }
                    }
                }
            }
        }
        .m-more {
            .u-icon {
                display: none;
            }
        }
    }
}
</style>
