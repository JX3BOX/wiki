<template>
    <div class="m-search-view">
        <span class="u-list-empty" v-if="isEmpty">👻 暂无记录</span>
        <div v-if="isLogin && isVirtual && !isEmpty" class="m-normal-op">
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
        <el-pagination
            background
            :total="achievements_count"
            hide-on-single-page
            layout="prev, pager, next"
            :current-page="page"
            :page-size="length"
            prev-html="&laquo;"
            next-html="&raquo;"
            @current-change="page_change_handle"
        ></el-pagination>
    </div>
</template>

<script>
import Achievements from "@/components/cj/achievements.vue";
import { searchAchievements, setVirtualRoleAchievements, cancelVirtualRoleAchievements } from "@/service/achievement";

import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "SearchPage",
    components: {
        Achievements,
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
            async handler() {
                this.isAll = false;
                const scene = this.$route.query?.scene || "";
                const keyword = this.$route.params?.keyword || "";
                if ((scene && this.scene != scene) || (keyword && this.keyword != keyword)) {
                    this.page_change_handle(1);
                } else {
                    this.page = parseInt(this.$route.query.page) || 1;
                }
                this.scene = scene;
                this.keyword = keyword;
                let data = await this.get_achievements();
                const achievements =
                    data.achievements?.map((item) => {
                        return {
                            ...item,
                            checked: false,
                        };
                    }) || [];
                this.achievements = achievements;
                this.achievements_count = data.total;
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
        // 获取成就搜索列表
        get_achievements() {
            let data = { limit: this.length, page: this.page };
            if (this.scene) data["scene"] = this.scene;
            if (this.keyword) data["keyword"] = this.keyword;
            return new Promise((resolve, reject) => {
                searchAchievements(data).then(
                    (data) => {
                        data = data.data;
                        resolve(data.data);
                    },
                    () => {
                        resolve(false);
                    }
                );
            });
        },
        page_change_handle(page) {
            this.$router.push({
                name: "search",
                params: { keyword: this.$route.params.keyword },
                query: { ...this.$route.query, page: page },
            });
        },
        finishVirtual() {
            const ids = this.selectedAchievements?.map((item) => item.ID + "");
            if (!ids.length) return;
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
            const ids = this.selectedAchievements?.map((item) => item.ID + "");
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
