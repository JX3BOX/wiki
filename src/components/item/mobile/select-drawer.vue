<template>
    <div>
        <el-drawer
            v-model="visible"
            class="c-var select-drawer"
            direction="btt"
            :show-close="false"
            :with-header="false"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
            v-bind="$attrs"
        >
            <template #default>
                <div class="c-var m-select-drawer">
                    <div class="m-user-select__title">{{ title }}</div>
                    <div class="m-options-list">
                        <div
                            class="m-options-item"
                            v-for="(item, index) in options"
                            :key="index"
                            :class="{ 'is-active': item.value === value }"
                            @click="value = item.value"
                        >
                            {{ item.label }}
                            <div class="w-mp-checkbox__icon">
                                <div class="w-mp-checkbox__checkmark"></div>
                            </div>
                        </div>
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
export default {
    name: "SelectDrawer",
    components: {},
    props: ["menus"],
    data() {
        return {
            visible: false,
            title: "请选择",
            options: [],
            value: null,

            callback: {},
        };
    },
    computed: {},
    methods: {
        open({ options, title }) {
            this.visible = true;
            this.options = options || [];
            this.title = title || "请选择";
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        onClose() {
            this.visible = false;
            this.callback.reject();
        },
        onConfirm() {
            this.visible = false;
            this.callback.resolve(this.value);
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

.select-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
    max-height: 500px;
}

.m-select-drawer {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    min-height: 0;
    position: relative;
    gap: 12px;
    .m-user-select__title {
        color: rgba(255, 255, 255, 0.6);

        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }

    .m-options-list {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        gap: 12px;
        overflow: auto;
        margin-bottom: 86px;
    }

    .u-input .el-input__wrapper,
    .u-menu,
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

    .u-input .el-input__wrapper {
        box-shadow: none;
    }

    .u-input .el-input__inner {
        color: inherit;
        background-color: transparent;
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
