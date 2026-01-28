<template>
    <div>
        <el-drawer
            :visible="visible"
            class="c-knowledge-drawer-mobile c-var"
            direction="btt"
            :show-close="false"
            :with-header="false"
            custom-class="knowledge-search-drawer"
            append-to-body
            size="500px"
            @close="onClose"
            style="width: 100%"
            v-bind="$attrs"
        >
            <template #default>
                <div class="m-knowledge-search-drawer">
                    <template v-if="!showMode">
                        <div class="m-title">关键词</div>
                        <el-input class="u-input" v-model="searchKey" placeholder="请输入关键词" clearable></el-input>

                        <div class="m-title">分类</div>
                        <div class="u-menu" @click="openMenu('type')">
                            {{ currentMenuLabel || "全部" }}
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </template>

                    <template v-if="showMode == 'type'">
                        <div class="m-header">
                            <i class="el-icon-arrow-left" @click="showMode = ''"></i>
                            <span class="m-title-center">选择分类</span>
                        </div>
                        <div class="m-options-list">
                            <div class="m-options-item" @click="changeType(null)" :class="{ 'is-active': !type }">
                                全部
                                <div class="w-checkbox__icon" v-if="!type">
                                    <div class="w-checkbox__checkmark"></div>
                                </div>
                            </div>
                            <div
                                class="m-options-item"
                                v-for="(item, index) in menus"
                                :key="index"
                                @click="changeType(item.name)"
                                :class="{ 'is-active': item.name == type }"
                            >
                                {{ item.label }}
                                <div class="w-checkbox__icon" v-if="item.name == type">
                                    <div class="w-checkbox__checkmark"></div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <div class="m-op" v-if="!showMode">
                        <button class="u-reset" @click="resetVal">重置</button>
                        <button class="u-confirm" @click="changeValue">确定</button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: "KnowledgeSearchDrawer",
    props: {
        menus: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            visible: false,
            showMode: "",

            searchKey: "",
            type: null,

            callback: {},
        };
    },
    computed: {
        currentMenuLabel() {
            if (!this.type) return "全部";
            return this.menus.find((item) => item.name == this.type)?.label || this.type;
        },
    },
    methods: {
        open(current) {
            this.visible = true;
            this.searchKey = current?.searchKey || "";
            this.type = current?.type || null;
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        onClose() {
            this.visible = false;
            if (this.callback.reject) this.callback.reject();
        },
        resetVal() {
            this.searchKey = "";
            this.type = null;
        },
        changeValue() {
            this.visible = false;
            if (this.callback.resolve) {
                this.callback.resolve({
                    searchKey: this.searchKey,
                    type: this.type,
                });
            }
        },
        openMenu(mode) {
            this.showMode = mode;
        },
        changeType(val) {
            this.type = val;
            this.showMode = "";
        },
    },
};
</script>

<style lang="less">
.knowledge-search-drawer {
    overflow: hidden;
    border-radius: 20px 20px 0 0;
    background: #24292e;

    .el-drawer__body {
        background: #24292e;
    }
}

.m-knowledge-search-drawer {
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    gap: 16px;
    color: var(--white-40);

    .m-title {
        color: rgba(255, 255, 255, 0.8);

        /* 14 Bold */
        font-family: "Microsoft YaHei UI";
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px; /* 142.857% */
    }

    .m-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: rgba(255, 255, 255, 0.8);
        .el-icon-arrow-left {
            font-size: 20px;
            padding: 10px;
            margin-left: -10px;
        }
        .m-title-center {
            flex: 1;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            margin-right: 20px;
        }
    }

    .u-input .el-input__inner,
    .u-menu,
    .m-options-item {
        display: flex;
        padding: var(--16, 16px) var(--20, 20px);
        justify-content: space-between;
        gap: 10px;
        align-items: center;

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

    .m-options-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 400px;
        overflow: auto;
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

            &.u-reset {
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 1);
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
