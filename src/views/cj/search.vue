<template>
    <div class="m-search-view m-search-view--cj" v-loading="loading">
        <AsyncState :loading="loading" :error="loadError" :empty="isEmpty" @retry="loadAchievements" />
        <div v-if="isLogin && isVirtual && !isEmpty" class="m-normal-op">
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
        <Achievements v-if="!loadError" :achievements="achievements" />
        <el-pagination
            background
            :total="achievements_count"
            hide-on-single-page
            layout="prev, pager, next, jumper"
            :current-page="page"
            :page-size="length"
            v-if="!loadError"
            @current-change="page_change_handle"
        >
            <template #prev-icon>&laquo;</template>
            <template #next-icon>&raquo;</template>
        </el-pagination>
    </div>
</template>

<script>
import Achievements from "@/components/cj/achievements.vue";
import { searchAchievements, setVirtualRoleAchievements, cancelVirtualRoleAchievements } from "@/service/achievement";

import User from "@jx3box/jx3box-common/js/user";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";
export default {
    name: "SearchPage",
    components: {
        Achievements,
        AsyncState,
    },
    props: [],
    data() {
        return {
            achievements: [],
            achievements_count: 0,
            page: 1,
            length: 15,
            isAll: false,
            keyword: "",
            scene: "",
            loading: false,
            loadError: false,
            saving: false,
            routeSyncReady: false,
            requestGuard: createLatestRequestGuard(),
        };
    },
    computed: {
        isEmpty() {
            return !this.achievements?.length;
        },
        isLogin() {
            return User.isLogin();
        },
        currentRole() {
            return this.$store.state.role;
        },
        selectedAchievements() {
            return this.achievements.filter((item) => item.checked);
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
                const scene = this.$route.query?.scene || "";
                const keyword = this.$route.params?.keyword || "";
                const page = parseInt(this.$route.query.page) || 1;
                const queryChanged = this.routeSyncReady && (scene !== this.scene || keyword !== this.keyword);
                this.scene = scene;
                this.keyword = keyword;
                this.routeSyncReady = true;
                if (queryChanged && page !== 1) {
                    this.page_change_handle(1);
                    return;
                }
                this.page = page;
                this.loadAchievements();
            },
        },
    },
    methods: {
        buildSearchRoute(keyword = this.$route.params.keyword, query = this.$route.query) {
            const normalizedKeyword = keyword || "";
            return {
                path: normalizedKeyword ? `/search/${encodeURIComponent(normalizedKeyword)}` : "/search",
                query,
            };
        },
        switchAll(bol) {
            this.achievements = this.achievements.map((item) => {
                return {
                    ...item,
                    checked: bol,
                };
            });
        },
        // 获取成就搜索列表
        loadAchievements() {
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
            let data = { limit: this.length, page: this.page };
            if (this.scene) data["scene"] = this.scene;
            if (this.keyword) data["keyword"] = this.keyword;
            searchAchievements(data)
                .then((response) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    const result = response.data?.data || {};
                    this.achievements = (result.achievements || []).map((item) => ({ ...item, checked: false }));
                    this.achievements_count = result.total || 0;
                })
                .catch(() => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    this.achievements = [];
                    this.achievements_count = 0;
                    this.loadError = true;
                })
                .finally(() => {
                    if (this.requestGuard.isCurrent(token)) this.loading = false;
                });
        },
        page_change_handle(page) {
            this.$router.push(this.buildSearchRoute(this.$route.params.keyword, { ...this.$route.query, page: page }));
        },
        finishVirtual() {
            if (this.saving) return;
            const ids = this.selectedAchievements?.map((item) => item.ID + "");
            if (!ids.length) return;
            const data = {
                achievements: ids.join(),
            };
            this.saving = true;
            setVirtualRoleAchievements(data).then(() => {
                this.$notify({
                    title: this.$t("ui.common.status.operationSuccess"),
                    message: this.$t("ui.achievement.markedComplete"),
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
            }).catch(() => this.$message.error(this.$t("ui.common.status.networkError"))).finally(() => {
                this.saving = false;
            });
        },
        cancelVirtual() {
            if (this.saving) return;
            const ids = this.selectedAchievements?.map((item) => item.ID + "");
            if (!ids.length) return;
            const data = {
                achievements: ids.join(),
            };
            this.saving = true;
            cancelVirtualRoleAchievements(data).then(() => {
                this.$notify({
                    title: this.$t("ui.common.status.operationSuccess"),
                    message: this.$t("ui.achievement.markedIncomplete"),
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
            }).catch(() => this.$message.error(this.$t("ui.common.status.networkError"))).finally(() => {
                this.saving = false;
            });
        },
    },
    beforeUnmount() {
        this.requestGuard.invalidate();
    },
};
</script>

<style lang="less">
.m-search-view {
    .m-normal-op {
        .mb(20px);
    }

    .m-search-op {
        padding-bottom: 10px;
        .el-checkbox {
            margin-right: 10px;
        }
    }
}
</style>
