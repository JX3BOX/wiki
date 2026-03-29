<template>
    <div>
        <el-drawer
            v-bind="$attrs"
            :visible="visible"
            class="c-var"
            direction="btt"
            :show-close="false"
            :with-header="false"
            custom-class="add-item-plan-drawer"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
        >
            <template #default>
                <div class="c-var m-add-item-plan-drawer" v-loading="loading">
                    <div class="m-drawer-content">
                        <div class="m-user-select__title">加入物品</div>
                        <ItemCardVue :item-id="item_id" :data="item"></ItemCardVue>
                        <div class="m-count-edit">
                            <LegacyIcon class="el-icon-minus" @click="current_count--" />
                            <el-input v-model.number="current_count"></el-input>
                            <LegacyIcon class="el-icon-plus" @click="current_count++" />
                        </div>
                        <div class="m-user-select__title" v-if="!fixed_plan">选择清单</div>
                        <div class="u-menu" @click="onSelectPlan" v-if="!fixed_plan">
                            {{ current_plan?.title || "请选择" }}
                        </div>
                        <template v-if="current_plan">
                            <div class="m-user-select__title">选择分组</div>
                            <div class="u-menu" @click="onSelectGroup">{{ current_group_title || "请选择" }}</div>
                        </template>
                    </div>
                    <div class="m-op">
                        <button class="u-confirm" @click="onConfirm">确定</button>
                    </div>
                </div>
            </template>
        </el-drawer>
        <SelectDrawer ref="plan-select"></SelectDrawer>
    </div>
</template>

<script>
import { getMyPlans, getItemPlanID, updatePlan } from "@/service/item-plan.js";
import SelectDrawer from "@/components/item/mobile/select-drawer.vue";
import ItemCardVue from "./item-card.vue";

export default {
    name: "AddItemPlanDrawer",
    components: { SelectDrawer, ItemCardVue },
    data() {
        return {
            visible: false,
            item_id: null,
            item: undefined,
            plan_list: [],
            loading: false,
            current_plan_id: null,
            current_plan: null,
            current_group_index: null,
            current_count: 1,

            fixed_plan: false,

            callback: {},
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        current_group_title() {
            if (this.current_group_index === null) return;
            let title = this.current_plan?.relation[this.current_group_index]?.title;
            return `(${this.current_group_index + 1}) ${title}`;
        },
    },
    watch: {
        current_plan_id(new_id) {
            if (new_id) this.loadPlan();
        },
        current_count(new_count) {
            if (new_count < 1 || isNaN(new_count)) this.current_count = 1;
        }
    },
    methods: {
        loadPlan() {
            this.loading = true;
            getItemPlanID(this.current_plan_id)
                .then((res) => {
                    this.current_plan = res || {};
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadPlans() {
            this.loading = true;
            getMyPlans({
                no_page: 1,
                _no_cache: 1,
            })
                .then((res) => {
                    this.plan_list = res || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onSelectPlan() {
            this.$refs["plan-select"]
                .open({
                    options: this.plan_list.map((p) => ({
                        value: p.id,
                        label: p.title,
                    })),
                    title: "请选择清单",
                })
                .then((res) => {
                    this.current_plan_id = res;
                })
                .catch(() => {});
        },
        onSelectGroup() {
            this.$refs["plan-select"]
                .open({
                    options: this.current_plan.relation.map((p, k) => ({
                        value: k,
                        label: `(${k + 1}) ${p.title}`,
                    })),
                    title: "请选择分组",
                })
                .then((res) => {
                    this.current_group_index = res;
                })
                .catch(() => {});
        },
        open({ item_id, item, plan }) {
            this.visible = true;
            this.item_id = item_id;
            if (item) this.item = item;
            if (plan) {
                this.current_plan_id = plan.id;
                this.current_plan = plan;
                this.fixed_plan = true;
            } else {
                this.loadPlans();
            }
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        onClose() {
            this.visible = false;
            this.current_plan_id = null;
            this.current_plan = null;
            this.current_group_index = null;
            this.current_count = 1;
        },
        onConfirm() {
            this.loading = true;
            updatePlan(this.current_plan_id, {
                relation: this.current_plan.relation.map((p, index) => {
                    if (index != this.current_group_index) return p;
                    return {
                        ...p,
                        data: [
                            ...p.data,
                            {
                                id: this.item_id,
                                count: this.current_count,
                            },
                        ],
                    };
                }),
            })
                .then(() => {
                    this.callback.resolve();
                    this.onClose();
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>

<style lang="less">
.add-item-plan-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
    max-height: 500px;
}

.m-add-item-plan-drawer {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    padding: 20px;
    max-height: 500px;
    position: relative;
    gap: 12px;

    .m-drawer-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: auto;
        flex-grow: 1;
        margin-bottom: 78px;
    }

    .w-mobile-item-card {
        background-color: transparent;
        flex-shrink: 0;
    }
    .m-user-select__title {
        color: rgba(255, 255, 255, 0.6);

        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }

    .m-count-edit {
        padding: 20px 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;

        color: #fff;

        font-size: 24px;
        font-weight: 700;
        line-height: 30px;
        .el-input__inner {
            border: none;
            box-shadow: none;
            background-color: transparent;
            text-align: center;
            color: #fff;

            font-size: 24px;
            font-weight: 700;
            line-height: 30px;
        }
    }

    .u-menu {
        display: flex;
        padding: var(--16, 16px) var(--20, 20px);
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        align-self: stretch;

        border-radius: var(--16, 16px);
        background: rgba(255, 255, 255, 0.1);

        color: rgba(255, 255, 255, 0.6);

        font-size: 14px;
        line-height: 20px; /* 142.857% */
        height: auto;
        box-shadow: none;
        border: none;
    }

    .m-op {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        padding: 20px 12px 30px;
        gap: 20px;
        background-color: #24292e;

        button {
            color: rgba(28, 28, 28, 0.4);

            /* 16 Bold */
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */

            border-radius: var(--12, 12px);
            padding: var(--12, 12px) var(--16, 16px);
            border: none;

            &.u-confirm {
                color: rgba(255, 255, 255, 0.4);

                /* 16 Bold */
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
                flex: 1;

                border-radius: var(--12, 12px);
                color: #000;
                background: #fedaa3;
            }
        }
    }
}
</style>
