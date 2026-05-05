<template>
    <div>
        <el-drawer
            v-model="show"
            :class="['user-select-drawer', customClass]"
            direction="btt"
            :show-close="false"
            :with-header="false"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
        >
            <template #default>
                <div class="c-var m-user-select">
                    <div class="m-user-select__title">选择角色</div>
                    <div class="m-user-list">
                        <div
                            v-for="item in list"
                            :key="item.ID"
                            class="m-user-item"
                            :class="[item.ID === tmpVal.ID ? 'active' : '']"
                            @click="() => selectRole(item)"
                        >
                            <div class="u-user-info">
                                <div class="u-avatar">
                                    <img :src="getMountAvatar(item.mount || 0, item.body_type || 1)" />
                                </div>
                                <div class="u-name">
                                    {{ item.name || "虚拟角色" }}
                                </div>
                            </div>
                            <div class="u-area">
                                {{ item.server }}
                            </div>
                        </div>
                    </div>

                    <div class="m-op">
                        <button class="u-reset" :class="{ active: !isEmptyVal }" @click="resetVal">重置</button>
                        <button class="u-confirm" :class="{ active: changeTmp }" @click="changeValue">确定</button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
import { cloneDeep, isEmpty, pick } from "lodash";
import User from "@jx3box/jx3box-common/js/user";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import { getUserRoles } from "@/service/team";
import { getMountAvatar } from "@/utils/common";

export default {
    name: "UserSelectDrawer",
    components: {},
    emits: ["update:visible"],
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        currentRole: {
            default: () => ({}),
        },
        customClass: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            tmpVal: null,

            roleList: [],

            isLogin: User.isLogin(),
            virtualRole: {
                name: "虚拟角色",
                ...User.getInfo(),
                jx3id: 0,
                ID: ~~User.getInfo().uid,
                server: "虚拟角色",
            },
        };
    },
    watch: {
        currentRole: {
            handler(newVal) {
                this.tmpVal = cloneDeep(newVal);
            },
            immediate: true,
        },
    },
    computed: {
        show: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            },
        },
        list() {
            if (this.roleList.length > 0) {
                return [
                    ...this.roleList.map((role) => {
                        return {
                            ...role,
                            avatar: showSchoolIcon(role.mount),
                        };
                    }),
                    this.virtualRole,
                ];
            } else {
                return [this.virtualRole];
            }
        },
        changeTmp() {
            return this.tmpVal !== this.currentRole;
        },
        isEmptyVal() {
            return this.tmpVal === null;
        },
    },
    mounted() {
        this.loadRoles();
    },
    methods: {
        getMountAvatar,
        onClose() {
            this.show = false;
        },
        resetVal() {
            if (this.roleList) {
                this.tmpVal = this.roleList[0];
            } else {
                this.tmpVal = this.virtualRole;
            }
        },
        changeValue() {
            this.$emit("change", this.tmpVal);
        },
        selectRole(val) {
            this.tmpVal = cloneDeep(val);
        },
        showSchoolIcon,
        loadRoles() {
            if (!this.isLogin) return;
            getUserRoles().then((res) => {
                this.roleList = res.data?.data?.list || [];
                console.log(this.roleList);
                if (isEmpty(this.currentRole)) {
                    if (this.roleList) {
                        this.$emit("change", this.roleList[0]);
                    } else {
                        this.$emit("change", this.virtualRole);
                    }
                }
            });
        },
    },
};
</script>

<style lang="less">
.user-select-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;

    .el-drawer__body {
        padding: 0;
        overflow: hidden;
        background: #24292e;
    }
}

.m-user-select {
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

    .m-user-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        min-height: 0;
        gap: 12px;
        overflow: auto;
        margin-bottom: 86px;

        .m-user-item {
            display: flex;
            min-height: 80px;
            padding: 0 24px 0 12px;
            align-items: center;
            gap: 12px;
            width: 100%;
            box-sizing: border-box;
            color: white;
            
            .u-user-info {
                display: flex;
                gap: 12px;
                align-items: center;
                flex: 1;

                .u-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    //background-color: #E0E0E0; /* Placeholder for avatar */
                    flex-shrink: 0;
                }

                .u-name {
                    flex: 1;
                }
            }

            .u-area {
                display: flex;
                align-items: center;
                /* 12 Regular */
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }

            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);

            &.active {
                border: 4px solid #fedaa3;
                padding: 0 20px 0 8px;

                .u-user-info {
                    color: #fedaa3;
                }

                .u-area {
                    color: #fedaa3;
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

            &.u-reset {
                display: flex;
                justify-content: center;
                align-items: center;
                color: rgba(255, 255, 255, 0.4);
                background: rgba(255, 255, 255, 0.05);

                &.active {
                    color: rgba(255, 255, 255, 1);
                }
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
                background: rgba(255, 255, 255, 0.05);

                &.active {
                    color: #000;
                    background: #fedaa3;
                }
            }
        }
    }
}
</style>
