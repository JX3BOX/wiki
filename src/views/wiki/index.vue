<template>
    <div>
        <Header></Header>
        <div class="m-achievement-main" :class="{ is_mobile: mobile }">
            <SideBar v-if="!is_fold" />
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
        return {
            is_fold: false,
        };
    },
    computed: {
        mobile() {
            const userAgent = navigator.userAgent.toLowerCase();
            const mobileKeywords = ["android", "iphone", "ipad", "ipod", "windows phone"];
            return mobileKeywords.some((keyword) => userAgent.includes(keyword));
        },
    },
    watch: {
        "$store.state.is_fold": {
            deep: true,
            immediate: true,
            handler(val) {
                this.is_fold = val;
            },
        },
    },
    methods: {},
    mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/wiki/index.less";
</style>
