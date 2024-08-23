<template>
    <router-view></router-view>
</template>

<script>
import Search from "@/components/common/search.vue";
import DefaultLayout from "@/layout/default-layout.vue";
import CommonNav from "@/components/common/nav.vue";
import KnowledgeNav from "@/components/knowledge/nav";
export default {
    name: "App",
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    methods: {},
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
@import "~@/assets/css/knowledge/index.less";
</style>
