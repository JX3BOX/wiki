<template>
    <div>
        <!-- 搜索结果 -->
        <div class="m-knowledge" v-if="list">
            <template v-if="list.length">
                <knowledgeItem v-for="(item, index) in list" :key="index" :data="item" />
            </template>
        </div>

        <!-- 翻页 -->
        <el-pagination
            class="m-archive-pages"
            background
            layout="total, prev, pager, next, jumper"
            :hide-on-single-page="true"
            :page-size="pagination.per"
            :total="pagination.total"
            :current-page="pagination.page"
            @current-change="changePage"
        ></el-pagination>
    </div>
</template>
<script>
import knowledgeItem from "@/components/knowledge/list-item.vue";
export default {
    name: "list",
    props: ["list", "pagination"],
    components: {
        knowledgeItem,
    },
    methods: {
        changePage(i) {
            this.$emit("onPageKey", i);
        },
    },
};
</script>
<style lang="less">
.v-knowledge-list .m-noKnowledge,
.v-knowledge-list .m-archive-pages {
    .mt(20px);
}

@media screen and (max-width: @phone) {
    .v-knowledge-list .m-knowledge {
        display: grid;
        gap: 12px;
    }

    .v-knowledge-list .m-archive-pages {
        margin-top: 16px;
    }
}
</style>
