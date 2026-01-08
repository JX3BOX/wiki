<template>
    <div>
        <el-drawer
            :visible="visible"
            class="c-var"
            direction="btt"
            :show-close="false"
            :with-header="false"
            custom-class="server-select-drawer"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
            v-bind="$attrs"
        >
            <template #default>
                <div class="c-var m-server-select-drawer">
                    <div class="m-user-select__title">请选择服务器</div>
                    <div class="m-options-list">
                        <div
                            class="m-options-item"
                            v-for="(item, index) in servers"
                            :key="index"
                            @click="server = item"
                            :class="{ 'is-active': item == server }"
                        >
                            {{ item }}
                            <div class="w-mp-checkbox__icon">
                                <div class="w-mp-checkbox__checkmark"></div>
                            </div>
                        </div>
                    </div>

                    <div class="m-op">
                        <button class="u-confirm" @click="changeValue">确定</button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
import std_servers from "@jx3box/jx3box-data/data/server/server_std.json";
import origin_servers from "@jx3box/jx3box-data/data/server/server_origin.json";
import { uniq } from "lodash";

export default {
    name: "SearchDrawer",
    components: {},
    props: ["menus"],
    data() {
        return {
            visible: false,
            server: "梦江南",

            callback: {},
        };
    },
    computed: {
        servers: function () {
            return uniq(this.client == "origin" ? origin_servers : std_servers);
        },
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        open(current) {
            this.visible = true;
            this.server = current || "梦江南";
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        onClose() {
            this.visible = false;
            this.callback.reject();
        },
        resetVal() {
            this.server = "梦江南";
        },
        changeValue() {
            this.visible = false;
            this.callback.resolve(this.server);
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

.server-select-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
    min-height: 500px;
}

.m-server-select-drawer {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    padding: 20px;
    min-height: 500px;
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
        gap: 12px;
        overflow: auto;
        margin-bottom: 79px;
        height: 340px;
    }

    .u-input .el-input__inner,
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
