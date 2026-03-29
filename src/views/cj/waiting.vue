<template>
    <div class="m-waiting-view">
        <el-alert class="u-waiting-alert" v-if="old" title="所有成就都已经有了各自的攻略，以下是一些比较老旧的成就攻略" type="success"></el-alert>
        <span class="u-list-empty" v-if="isEmpty">👻 暂无记录</span>
        <Achievements :achievements="achievements" />
        <el-pagination
            background
            :total="achievements_count"
            hide-on-single-page
            layout="prev, pager, next"
            :current-page="page"
            :page-size="length"
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

import { get } from "lodash";

export default {
    name: "Waiting",
    data: function() {
        return {
            achievements: null,
            achievements_count: 0,
            old: false,
            page: 1,
            length: 15,
        };
    },
    computed: {
        isEmpty() {
            return !get(this.achievements, "length");
        },
    },
    methods: {
        // 获取成就列表
        get_achievements(page) {
            let that = this;
            getWaitingAchievements(page).then(
                (data) => {
                    data = data.data;
                    that.achievements = data.data.achievements;
                    that.achievements_count = data.data.total;
                    that.old = data.data.old;
                },
                () => {
                    that.achievements = false;
                }
            );
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
};
</script>

<style lang="less">
.m-waiting-view {
    .u-waiting-alert {
        margin-bottom: 20px;
    }
}
</style>
