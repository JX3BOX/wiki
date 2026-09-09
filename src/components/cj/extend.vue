<template>
    <div class="m-right-side" :class="{ isHome: $route.name === 'home' }">
        <SideMsg />
        <Rank />
    </div>
</template>

<script>
import SideMsg from "@/components/common/side-msg.vue";
import Rank from "@/components/common/rank.vue";

export default {
    name: "Extend",
    components: { SideMsg, Rank },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/right-side.less";
</style>
