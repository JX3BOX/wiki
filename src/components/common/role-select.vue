<template>
    <div class="m-related-roles">
        <el-select
            v-if="isLogin"
            :value="role"
            value-key="ID"
            placeholder="请选择当前角色"
            :disabled="!isLogin"
            popper-class="m-related-roles-options"
            size="small"
            @change="$emit('change', $event)"
            v-bind="$attrs"
        >
            <span slot="prefix" class="u-prefix">
                角色
                <slot name="prefix"></slot>
            </span>
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
    model: {
        prop: "role",
        event: "change",
    },
    props: ["role"],
    data: () => ({
        roleList: [],

        isLogin: User.isLogin(),
        virtualRole: {
            ...User.getInfo(),
            jx3id: 0,
            ID: ~~User.getInfo().uid,
        },
    }),
    methods: {
        showSchoolIcon,
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

<style lang="less" scoped></style>
