<template>
    <div class="m-normal-view">
        <div v-if="isLogin && isVirtual" class="m-normal-op">
            <el-checkbox v-model="isAll" border @change="switchAll" size="small">全选</el-checkbox>
            <template v-if="selectedAchievements.length">
                <el-button plain icon="el-icon-check" @click.stop="finishVirtual" size="small">
                    批量设为完成({{ selectedAchievements.length }})
                </el-button>
                <el-button type="info" icon="el-icon-close" @click.stop="cancelVirtual" size="small">
                    批量取消完成({{ selectedAchievements.length }})
                </el-button>
            </template>
        </div>
        <Achievements :achievements="achievements" />
    </div>
</template>

<script>
import Achievements from "@/components/cj/achievements.vue";
import { getMenuAchievements, setVirtualRoleAchievements, cancelVirtualRoleAchievements } from "@/service/achievement";

import { get, flattenDeep } from "lodash";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "Normal",
    components: {
        Achievements,
    },
    data() {
        return {
            achievements: [],
            isAll: false,
        };
    },
    computed: {
        isLogin() {
            return User.isLogin();
        },
        currentRole() {
            return this.$store.state.role;
        },
        selectedAchievements() {
            return flattenDeep(
                this.achievements
                    .filter((item) => item.checked)
                    .map((item) => {
                        if (item.SeriesAchievementList) {
                            return item.SeriesAchievementList;
                        }
                        return item;
                    })
            );
        },
        isVirtual() {
            // 是否是虚拟角色 - 魔盒账号
            return !this.currentRole?.jx3id;
        },
        achievementsVirtual() {
            return this.$store.state.achievementsVirtual;
        },
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                this.isAll = false;
                // 获取成就列表
                this.get_achievements(this.$route.params.sub, this.$route.params.detail);
            },
        },
    },
    methods: {
        switchAll(bol) {
            this.achievements = this.achievements.map((item) => {
                return {
                    ...item,
                    checked: bol,
                };
            });
        },
        // 获取成就列表
        get_achievements(sub, detail) {
            if (!sub) return [];
            const params = {};

            if (this.$route.query.scene) params.scene = this.$route.query.scene;

            getMenuAchievements(sub, detail, params).then(
                (data) => {
                    data = data.data;
                    const achievements =
                        data.data.achievements &&
                        data.data.achievements.length &&
                        data.data.achievements.sort((a, b) => {
                            let a_level = get(a.post, "level", 1);
                            let b_level = get(b.post, "level", 1);
                            return a_level - b_level;
                        });
                    this.achievements = achievements.map((item) => {
                        return {
                            ...item,
                            checked: false,
                        };
                    });
                },
                () => {
                    this.achievements = [];
                }
            );
        },
        finishVirtual() {
            const ids = this.selectedAchievements.map((item) => item.ID + "");
            const data = {
                achievements: ids.join(),
            };
            setVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将选中成就标记为已完成",
                    type: "success",
                });
                const list = Array.from(new Set(this.achievementsVirtual.concat(ids)));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },
        cancelVirtual() {
            const ids = this.selectedAchievements.map((item) => item.ID + "");
            const data = {
                achievements: ids.join(),
            };
            cancelVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将选中成就标记为待完成",
                    type: "success",
                });
                const list = this.achievementsVirtual.filter((item) => !ids.includes(item));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },
    },
};
</script>
<style lang="less">
.m-normal-op {
    padding-bottom: 10px;
    .el-checkbox {
        display: inline-flex;
        align-items: center;
        margin-right: 10px;
    }
}
</style>
