<template>
    <div>
        <el-drawer
            :visible="visible"
            class="c-var"
            direction="btt"
            :show-close="false"
            :with-header="false"
            custom-class="item-count-input-drawer"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
            v-bind="$attrs"
        >
            <template #default>
                <div class="c-var m-item-count-input-drawer">
                    <div class="m-drawer-content">
                        <div class="m-user-select__title">修改数量</div>
                        <ItemCardVue :item-id="item_id" :data="item"></ItemCardVue>
                        <div class="m-count-edit">
                            <i class="el-icon-minus" @click="current_count--"></i>
                            <el-input v-model.number="current_count"></el-input>
                            <i class="el-icon-plus" @click="current_count++"></i>
                        </div>
                    </div>
                    <div class="m-op">
                        <button class="u-delete" @click="onDelete">删除物品</button>
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
            current_count: 1,

            callback: {},
        };
    },
    watch: {
        count(new_count) {
            if (new_count < 1 || isNaN(new_count)) this.current_count = 1;
        },
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        open({ item_id, item, count }) {
            this.visible = true;
            this.item_id = item_id;
            if (item) this.item = item;
            if (count) this.current_count = count;
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        onClose() {
            this.visible = false;
            this.callback.reject();
        },
        onDelete() {
            this.visible = false;
            this.callback.resolve({
                type: "delete",
            });
        },
        onConfirm() {
            this.visible = false;
            this.callback.resolve({
                type: "change",
                count: this.current_count,
            });
        },
    },
};
</script>

<style lang="less">
.item-count-input-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
}

.m-item-count-input-drawer {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    padding: 20px;
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

            &.u-delete {
                border-radius: var(--12, 12px);
                background: var(--secondary-red, #ff3b30);

                display: flex;
                padding: var(--12, 12px) var(--16, 16px);
                justify-content: center;
                align-items: center;
                gap: var(--8, 8px);
                color: #fff;

                /* 16 Bold */
                font-family: "Microsoft YaHei UI";
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }

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
