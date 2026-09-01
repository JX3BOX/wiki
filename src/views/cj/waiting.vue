<template>
    <div class="m-waiting-view m-waiting-view--cj" v-loading="loading">
        <el-alert class="u-waiting-alert" v-if="old" :title="$t('ui.achievement.oldGuides')" type="success"></el-alert>
        <AsyncState :loading="loading" :error="loadError" :empty="isEmpty" @retry="get_achievements(page)" />
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
import { getWaitingAchievements } from "@/service/achievement";

import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";

export default {
    name: "Waiting",
    data: function() {
        return {
            achievements: null,
            achievements_count: 0,
            old: false,
            page: 1,
            length: 15,
            loading: false,
            loadError: false,
            requestGuard: createLatestRequestGuard(),
        };
    },
    computed: {
        isEmpty() {
            return Array.isArray(this.achievements) && !this.achievements.length;
        },
    },
    methods: {
        // 获取成就列表
        get_achievements(page) {
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
            getWaitingAchievements(page)
                .then((data) => {
                    if (!this.requestGuard.isCurrent(token)) return;
                    data = data.data;
                    this.achievements = data.data.achievements || [];
                    this.achievements_count = data.data.total || 0;
                    this.old = !!data.data.old;
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
            this.$router.push({
                name: "waiting",
                params: { keyword: this.$route.params.keyword },
                query: { page: page },
            });
        },
    },
    components: {
        Achievements,
        AsyncState,
    },
    watch: {
        $route: {
            immediate: true,
            handler() {
                this.page = parseInt(this.$route.query.page) || 1;
                // 获取成就列表
                this.get_achievements(this.page || 1);
            },
        },
    },
    beforeUnmount() {
        this.requestGuard.invalidate();
    },
};
</script>

<style lang="less">
.m-waiting-view {
    .u-waiting-alert {
        margin-bottom: 20px;
    }
}
</style>
