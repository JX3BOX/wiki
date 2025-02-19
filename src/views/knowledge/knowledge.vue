<template>
    <DefaultLayout
        name="通识百科"
        slug="knowledge"
        root="/knowledge"
        without-right
        :publishEnable="true"
        :feedbackEnable="true"
    >
        <template #left>
            <CommonNav>
                <KnowledgeNav> </KnowledgeNav>
            </CommonNav>
        </template>

        <!-- 搜索 -->
        <Search class="u-knowledge-search" @search="onSearchKey"></Search>

        <router-view></router-view>
    </DefaultLayout>
</template>

<script>
import Search from "@/components/common/search.vue";
import DefaultLayout from "@/layout/default-layout.vue";
import CommonNav from "@/components/common/nav.vue";
import KnowledgeNav from "@/components/knowledge/nav";
export default {
    name: "App",
    components: { CommonNav, KnowledgeNav, DefaultLayout, Search },
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
@import "~@/assets/css/knowledge/index.less";
</style>
