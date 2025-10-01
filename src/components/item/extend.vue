<template>
    <div class="m-extend">
        <SideMsg></SideMsg>
        <!-- 贡献排行榜 -->
        <!-- <Rank type="item"></Rank> -->

        <MyItems />
        <MyPlans />
    </div>
</template>

<script>
import { __Links, __ossRoot } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user.js";
import MyPlans from "@/components/item/my-plans.vue";
import MyItems from "@/components/item/my-items.vue";
import SideMsg from "@/components/common/side-msg.vue";
// import Rank from "@/components/common/rank.vue";
export default {
    name: "Extend",
    components: {
        MyPlans,
        MyItems,
        SideMsg,
        // Rank,
    },
    props: [],
    data: function () {
        return {
            isHome: true,
            hot_items: null,
            user: User.getInfo(),
        };
    },
    methods: {
        checkIsHome: function () {
            this.isHome = this.$route.name == "home" || !this.$route.name;
        },
    },
    watch: {
        "$route.name": function (newpath) {
            this.checkIsHome();
        },
    },
    mounted: function () {
        this.checkIsHome();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/extend.less";
</style>
