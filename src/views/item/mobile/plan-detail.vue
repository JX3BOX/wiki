<template>
    <div class="c-var p-mobile-plan-view">
        <div class="m-page-container" ref="pageContainer" v-loading="loading">
            <div class="m-section" v-for="(group, index) in plan.relation" :key="index">
                <div class="m-section-title">
                    {{ group.title || `分组${index + 1}` }}
                    <i class="u-edit-title el-icon-edit" v-if="group.editing" @click="onEditGroupTitle(group)"></i>
                    <div
                        class="u-edit"
                        @click="$set(group, 'editing', !group.editing)"
                        :class="{ 'is-editing': group.editing }"
                    >
                        {{ group.editing ? "退出编辑" : "编辑" }}
                    </div>
                </div>
                <div class="m-item-list">
                    <item-card
                        v-for="(item, index) in group.data"
                        :key="index"
                        :item-id="item.id"
                        :count="item.count"
                        :show-edit-count="group.editing"
                        @click="toView(item.id)"
                        @edit="onEditCount(group, index)"
                    />
                </div>
            </div>
            <div class="m-add-group" @click="onAddGroup">
                新增分组
                <i class="el-icon-plus"></i>
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
                    <div class="u-action" @click="onAddItem">加入物品</div>
                    <div class="u-action with-lb" @click="onAddGroup">新增分组</div>
                </div>
            </template>
        </suspend-common>
        <InputDrawerVue ref="input-drawer"></InputDrawerVue>
        <AddItemSearchDrawerVue ref="add-item-search-drawer" @plan-change="loadPlan"></AddItemSearchDrawerVue>
        <ItemCountInputDrawerVue ref="item-count-input-drawer"></ItemCountInputDrawerVue>
    </div>
</template>

<script>
import SuspendCommon from "@jx3box/jx3box-common-ui/src/SuspendCommon.vue";
import { getItemPlanID, updatePlan } from "@/service/item-plan.js";
import ItemCard from "@/components/item/mobile/item-card.vue";
import InputDrawerVue from "@/components/item/mobile/input-drawer.vue";
import AddItemSearchDrawerVue from "@/components/item/mobile/add-item-search-drawer.vue";
import ItemCountInputDrawerVue from "@/components/item/mobile/item-count-input-drawer.vue";
import { cloneDeep } from "lodash";

export default {
    name: "MobileItemPlanList",
    components: { SuspendCommon, ItemCard, InputDrawerVue, AddItemSearchDrawerVue, ItemCountInputDrawerVue },
    data() {
        return {
            plan: {},
            loading: false,
        };
    },
    computed: {
        id() {
            return this.$route.params.plan_id;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler(newVal) {
                if (!newVal) return;
                this.loadPlan();
            },
        },
    },
    methods: {
        loadPlan() {
            this.loading = true;
            getItemPlanID(this.id)
                .then((res) => {
                    this.plan = res || {};
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        toView(id) {
            this.$router.push({ name: "view", params: { item_id: id } });
        },
        scrollToTop() {
            this.$refs["pageContainer"].scrollTo({ top: 0, behavior: "smooth" });
        },
        onCreatePlan() {
            this.$refs["create-plan-drawer"]
                .open()
                .then((res) => {
                    this.$message({
                        message: "创建成功",
                        type: "success",
                    });
                })
                .catch((e) => {});
        },
        onSearch() {
            this.$router.push({ name: "home" });
        },
        onEditGroupTitle(group) {
            this.$refs["input-drawer"]
                .open({
                    title: "修改分组名，当前：" + (group.title || `分组${index + 1}`),
                    value: group.title || `分组${index + 1}`,
                })
                .then((res) => {
                    group.title = res;
                    this.savePlan();
                });
        },
        onAddItem() {
            this.$refs["add-item-search-drawer"].open(this.plan);
        },
        onAddGroup() {
            this.$refs["input-drawer"]
                .open({
                    title: "新增分组",
                    value: `分组${(this.plan.relation?.length || 0) + 1}`,
                })
                .then((res) => {
                    this.plan.relation.push({
                        title: res,
                        data: [],
                    });
                    this.savePlan();
                });
        },
        onEditCount(group, index) {
            const item = group.data[index];
            this.$refs["item-count-input-drawer"]
                .open({
                    item_id: item.id,
                    count: item.count,
                })
                .then((res) => {
                    const { type, count } = res;
                    if (type == "change") {
                        item.count = count;
                        this.savePlan();
                    } else if (type == "delete") {
                        group.data.splice(index, 1);
                        this.savePlan();
                    }
                })
                .catch(() => {});
        },
        savePlan() {
            const payload = {
                relation: cloneDeep(this.plan.relation),
            };
            for (const r of payload.relation) {
                delete r.editing;
            }
            updatePlan(this.id, payload);
        },
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.p-mobile-plan-view {
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

    .m-section {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .m-section-title {
            color: var(--black-100, #1c1c1c);

            /* 16 Bold */
            font-family: "Microsoft YaHei UI";
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */

            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 4px;

            .u-edit {
                color: var(--black-40, rgba(28, 28, 28, 0.4));
                flex-grow: 1;
                display: flex;
                justify-content: flex-end;

                /* 16 Bold */
                font-family: "Microsoft YaHei UI";
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }

            .u-edit.is-editing,
            .u-edit-title {
                color: var(--secondary-blue, #1886fe);
            }

            .u-edit-title {
                transform: scaleX(1.1);
            }
        }
    }

    .m-item-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .m-add-group {
        display: flex;
        padding: 17px 20px;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px;
        background: var(--black-10, rgba(28, 28, 28, 0.1));

        color: var(--black-100, #1c1c1c);
        text-align: center;

        /* 16 Bold */
        font-family: "Microsoft YaHei UI";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
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
                box-sizing: border-box;

                .u-action {
                    display: flex;
                    height: 24px;
                    justify-content: center;
                    align-items: center;
                    flex: 1 0 0;
                    gap: 6px;

                    &.with-lb {
                        border-left: 0.5px solid rgba(254, 218, 163, 0.2);
                    }

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
