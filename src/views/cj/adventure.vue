<template>
    <div class="m-adventure-view">
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
import { getAdventureAchievements } from "@/service/achievement";
import { get } from "lodash";

export default {
    name: "Adventure",
    data() {
        return {
            achievements: null,
            achievements_count: 0,
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
            getAdventureAchievements(page).then(
                (data) => {
                    data = data.data;
                    this.achievements = data.data.achievements;
                    this.achievements_count = data.data.total;
                },
                () => {
                    this.achievements = false;
                }
            );
        },
        page_change_handle(page) {
            this.$router.push({
                name: "adventure",
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
                this.get_achievements(this.page);
            },
        },
    },
};
</script>
