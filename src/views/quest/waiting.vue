<template>
    <div class="m-waiting-quest">
        <el-alert
            v-if="old"
            :title="$t('ui.quest.oldGuides')"
            type="success"
        ></el-alert>
        <!-- 列表头部 -->
        <list-head></list-head>
        <!-- 任务列表 -->
        <div class="u-quest-list">
            <quest-card v-for="(item, key) in data" :key="key" :quest="item"></quest-card>
        </div>
        <el-pagination
            background
            layout="prev, pager, next, jumper"
            :total="total"
            :page-size="15"
            hide-on-single-page
            style="text-align: center"
            @current-change="getData"
        >
        </el-pagination>
    </div>
</template>

<script>
import { getWaiting, getQuests } from "@/service/quest";
import QuestCard from "@/components/quest/result/quest-card.vue";
import ListHead from "@/components/quest/result/list-head.vue";

export default {
    name: "QuestNewest",
    components: { QuestCard, ListHead },
    data: () => ({
        data: [],
        total: 0,
        old: false,
    }),
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        async getData(page = 1) {
            let params = {
                page,
                client: this.client,
            };
            let res = (await getWaiting(params)).data;
            this.total = res.data.total;
            this.old = res.data.old;
            if (!res.data.list) return;
            const ids = res.data.list?.map((q) => q.QuestID);
            const quests = await getQuests({
                ids: ids.join(","),
                client: this.client,
            });
            this.data = quests.data;
        },
    },
    mounted() {
        this.getData();
    },
};
</script>

<style lang="less" scoped></style>
