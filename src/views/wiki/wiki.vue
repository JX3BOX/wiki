<template>
    <wikiLayout without-left without-right>
        <router-view></router-view>
    </wikiLayout>
</template>

<script>
import wikiLayout from "@/layout/wiki-layout.vue";
export default {
    name: "App",
    components: { wikiLayout },
    props: [],
    data: function () {
        return {};
    },
    computed: {},
    methods: {
        onSearchKey(keyword) {
            let query = { page: 1 };

            this.$router.push({
                name: "search",
                params: { keyword: keyword },
                query: query,
            });
        },
    },
    mounted: function () {},
};
</script>

<style lang="less">
@import "~@/assets/css/app.less";
</style>
