<template>
    <div>
        <Header></Header>
        <div class="m-achievement-main">
            <SideBar />
            <div class="m-achievement-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import SideBar from "@/components/wiki/sidebar.vue";
export default {
    name: "WikiAchievementIndex",
    components: { SideBar },
    data() {
        return {};
    },
    computed: {},
    watch: {},
    methods: {},
    mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/wiki/index.less";
</style>
