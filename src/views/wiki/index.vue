<template>
    <div>
        <!-- <Header></Header> -->
        <div class="m-achievement-main" :class="{ is_mobile: mobile }">
            <SideBar />
            <div class="m-achievement-content" :class="{ is_mobile: mobile }">
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
    computed: {
        mobile() {
            const userAgent = navigator.userAgent.toLowerCase();
            const mobileKeywords = ["android", "iphone", "ipad", "ipod", "windows phone"];
            return mobileKeywords.some((keyword) => userAgent.includes(keyword));
        },
    },
    watch: {},
    methods: {},
    mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/wiki/index.less";
</style>
