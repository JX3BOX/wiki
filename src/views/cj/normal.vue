<template>
    <div class="m-normal-view" v-loading="loading">
        <div v-if="isLogin && isVirtual" class="m-normal-op">
            <el-checkbox v-model="isAll" border @change="switchAll" size="small">{{ $t("ui.achievement.all") }}</el-checkbox>
            <template v-if="selectedAchievements.length">
                <el-button plain icon="Check" @click.stop="finishVirtual" size="small" :loading="saving">
                    {{ $t("ui.achievement.batchComplete", { count: selectedAchievements.length }) }}
                </el-button>
                <el-button type="info" icon="Close" @click.stop="cancelVirtual" size="small" :loading="saving">
                    {{ $t("ui.achievement.batchIncomplete", { count: selectedAchievements.length }) }}
                </el-button>
            </template>
        </div>
        <AsyncState :loading="loading" :error="loadError" :empty="!achievements.length" @retry="loadAchievements" />
        <Achievements v-if="!loadError" :achievements="achievements" />
    </div>
</template>

<script>
import Achievements from "@/components/cj/achievements.vue";
import { getMenuAchievements, setVirtualRoleAchievements, cancelVirtualRoleAchievements } from "@/service/achievement";

import get from "lodash/get";
import flattenDeep from "lodash/flattenDeep";
import User from "@jx3box/jx3box-common/js/user";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";

export default {
    name: "Normal",
    components: {
        Achievements,
        AsyncState,
    },
    data() {
        return {
            achievements: [],
            isAll: false,
            loading: false,
            loadError: false,
            saving: false,
            requestGuard: createLatestRequestGuard(),
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
                this.loadAchievements();
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
        loadAchievements() {
            const sub = this.$route.params.sub;
            const detail = this.$route.params.detail;
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
            if (!sub) {
                this.achievements = [];
                this.loading = false;
                return;
            }
            const params = {};

            if (this.$route.query.scene) params.scene = this.$route.query.scene;

            getMenuAchievements(sub, detail, params)
                .then((data) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    data = data.data;
                    const achievements = Array.isArray(data?.data?.achievements) ? data.data.achievements : [];
                    const sortedAchievements = achievements.sort((a, b) => {
                        let a_level = get(a.post, "level", 1);
                        let b_level = get(b.post, "level", 1);
                        return a_level - b_level;
                    });
                    this.achievements = sortedAchievements.map((item) => {
                        return {
                            ...item,
                            checked: false,
                        };
                    });
                })
                .catch(() => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.achievements = [];
                    this.loadError = true;
                })
                .finally(() => {
                    if (this.requestGuard.isCurrent(token)) this.loading = false;
                });
        },
        finishVirtual() {
            if (this.saving) return;
            const ids = this.selectedAchievements.map((item) => item.ID + "");
            if (!ids.length) return;
            const data = {
                achievements: ids.join(),
            };
            this.saving = true;
            setVirtualRoleAchievements(data)
                .then(() => {
                    this.$notify({
                        title: this.$t("ui.common.status.operationSuccess"),
                        message: this.$t("ui.achievement.markedComplete"),
                        type: "success",
                    });
                    const list = Array.from(new Set(this.achievementsVirtual.concat(ids)));
                    this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                    this.clearSelection();
                })
                .catch(() => this.$message.error(this.$t("ui.common.status.networkError")))
                .finally(() => {
                    this.saving = false;
                });
        },
        cancelVirtual() {
            if (this.saving) return;
            const ids = this.selectedAchievements.map((item) => item.ID + "");
            if (!ids.length) return;
            const data = {
                achievements: ids.join(),
            };
            this.saving = true;
            cancelVirtualRoleAchievements(data)
                .then(() => {
                    this.$notify({
                        title: this.$t("ui.common.status.operationSuccess"),
                        message: this.$t("ui.achievement.markedIncomplete"),
                        type: "success",
                    });
                    const list = this.achievementsVirtual.filter((item) => !ids.includes(item));
                    this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                    this.clearSelection();
                })
                .catch(() => this.$message.error(this.$t("ui.common.status.networkError")))
                .finally(() => {
                    this.saving = false;
                });
        },
        clearSelection() {
            this.isAll = false;
            this.achievements = this.achievements.map((item) => ({ ...item, checked: false }));
        },
    },
    beforeUnmount() {
        this.requestGuard.invalidate();
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
