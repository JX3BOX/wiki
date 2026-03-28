<template>
    <div class="m-related-roles">
        <el-select
            v-if="isLogin"
            v-bind="$attrs"
            :model-value="currentRole"
            value-key="ID"
            placeholder="请选择当前角色"
            :disabled="!isLogin"
            popper-class="m-related-roles-options"
            size="small"
            @change="handleChange"
        >
            <template #prefix>
                <span class="u-prefix">
                角色
                <slot name="tip"></slot>
                </span>
            </template>
            <el-option v-if="isLogin" :value="virtualRole" :label="virtualRole.name + '<虚拟角色>'">
                <span class="u-role">
                    <span class="u-role-name"
                        ><img class="u-role-icon" :src="virtualRole.avatar" />{{ virtualRole.name }}</span
                    >
                    <span class="u-role-server"> &lt;虚拟角色&gt;</span>
                </span>
            </el-option>
            <el-option v-for="role in roleList" :key="role.ID" :value="role" :label="role.name">
                <span class="u-role">
                    <span class="u-role-name"
                        ><img class="u-role-icon" :src="showSchoolIcon(role.mount)" />{{ role.name }}</span
                    >
                    <span class="u-role-server">{{ role.server }}</span>
                </span>
            </el-option>
        </el-select>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import { getUserRoles } from "@/service/team";

export default {
    name: "RoleSelect",
    emits: ["update:modelValue", "change", "list-loaded"],
    props: {
        modelValue: {
            type: Object,
            default: null,
        },
        role: {
            type: Object,
            default: null,
        },
    },
    data: () => ({
        roleList: [],

        isLogin: User.isLogin(),
        virtualRole: {
            ...User.getInfo(),
            jx3id: 0,
            ID: ~~User.getInfo().uid,
        },
    }),
    computed: {
        currentRole() {
            return this.modelValue ?? this.role;
        },
    },
    methods: {
        showSchoolIcon,
        handleChange(role) {
            this.$emit("update:modelValue", role);
            this.$emit("change", role);
        },
        loadRoles() {
            if (!this.isLogin) return;
            getUserRoles().then((res) => {
                this.roleList = res.data?.data?.list || [];
                this.$emit("list-loaded", this.roleList, this.virtualRole);
            });
        },
    },
    mounted() {
        this.loadRoles();
    },
};
</script>

<style lang="less">
.m-related-roles {
    .fz(12px);
    .u-tip {
        .mb(10px);
        i {
            .fz(16px);
            .mr(3px);
        }
        a {
            padding: 0 2px;
            box-shadow: 0 1px 0 @color-link;
        }
    }

    .el-input__prefix {
        left: 1px;
        top: 1px;
        .r(5px);
    }

    .u-prefix {
        .db;
        .h(30px);
        .lh(30px);

        background-color: #f5f7fa;
        color: #909399;

        border-right: 1px solid #dcdfe6;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;

        padding: 0 10px;
        white-space: nowrap;
    }

    .el-input--prefix .el-input__inner {
        padding-left: 75px;
    }
}

.m-related-roles-options {
    .u-role {
        display: flex;
        justify-content: space-between;
    }
    .u-role-name {
        .flex;
        align-items: center;
    }
    .u-role-icon {
        .size(20px);
        .y;
        .mr(3px);
        .r(50%);
    }
    .u-role-server {
        color: #999;
        .fz(12px);
    }
}
</style>
