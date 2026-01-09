<template>
    <div>
        <el-drawer
            :visible="visible"
            class="c-var"
            direction="btt"
            :show-close="false"
            :with-header="false"
            custom-class="create-plan-drawer"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
            v-bind="$attrs"
        >
            <template #default>
                <div class="c-var m-create-plan-drawer">
                    <div class="m-drawer-content">
                        <div class="m-user-select__title">清单名称</div>
                        <el-input class="u-input" v-model="form.title"></el-input>
                        <div class="m-options-list">
                            <div
                                class="m-options-item"
                                :class="{ 'is-active': form.public == 1 }"
                                @click="form.public = 1"
                            >
                                所有人可见
                                <div class="w-mp-checkbox__icon">
                                    <div class="w-mp-checkbox__checkmark"></div>
                                </div>
                            </div>
                            <div
                                class="m-options-item"
                                :class="{ 'is-active': form.public == 0 }"
                                @click="form.public = 0"
                            >
                                仅自己可见
                                <div class="w-mp-checkbox__icon">
                                    <div class="w-mp-checkbox__checkmark"></div>
                                </div>
                            </div>
                        </div>
                        <div class="m-user-select__title">描述</div>
                        <el-input
                            class="u-input"
                            v-model="form.description"
                            placeholder="简单描述一下你的物品清单"
                            type="textarea"
                            :rows="4"
                            :autosize="false"
                            resize="none"
                        ></el-input>
                    </div>
                    <div class="m-op">
                        <button class="u-confirm" @click="onConfirm">确定</button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
import {  addMyPlan } from "@/service/item-plan.js";

const defaultForm = {
    title: "",
    public: 1,
    description: "",
    type: 1,
};

export default {
    name: "CreatePlanDrawer",
    components: {},
    props: ["menus"],
    data() {
        return {
            visible: false,

            form: { ...defaultForm },

            callback: {},
        };
    },
    methods: {
        open() {
            this.visible = true;
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        onClose() {
            this.visible = false;
            this.callback.reject && this.callback.reject();
        },
        onConfirm() {
            this.loading = true;
            const payload = {
                title: this.form.title,
                relation: [
                    {
                        title: "默认分组",
                        data: [],
                    },
                ],
                public: this.form.public,
                type: 1,
                description: this.form.description,
            };
            addMyPlan(payload)
                .then((res) => {
                    this.callback.resolve && this.callback.resolve(res);
                })
                .finally(() => {
                    this.visible = false;
                });
        },
    },
};
</script>

<style lang="less">
.w-mp-checkbox__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    .size(20px);
    box-sizing: border-box;
    .r(100%);
    padding: 2.5px;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.w-mp-checkbox__checkmark {
    .size(0px);
    .r(100%);
    background-color: #fedaa3;
    transition: all 0.2s ease-in-out;
}

.create-plan-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
}

.m-create-plan-drawer {
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

    .m-options-list {
        display: flex;
        gap: 12px;
        max-height: 400px;
        overflow: auto;
    }

    .m-options-item {
        flex-grow: 1;
    }

    .u-input .el-input__inner,
    .u-input .el-textarea__inner,
    .m-options-item {
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

        &.is-active {
            color: #fedaa3;

            .w-mp-checkbox__icon {
                .w-mp-checkbox__checkmark {
                    .size(8px);
                }
            }
        }
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
