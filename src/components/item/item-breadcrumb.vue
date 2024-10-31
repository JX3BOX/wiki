<template>
    <div class="m-breadcrumb">
        <div class="u-stat">
            <span v-for="(value, key) in countDict" :key="key">
                <em>{{ value }}</em>
                <b>{{ count[key] }}</b>
            </span>
        </div>
    </div>
</template>
<script>
import { get_items_count } from "@/service/item.js";

export default {
    name: "ItemBreadcrumb",
    props: [],
    data: function () {
        return {
            count: {},
            countDict: {
                total: "物品总数",
                quality_0: "破败物品数",
                quality_1: "普通物品数",
                quality_2: "精巧物品数",
                quality_3: "卓越物品数",
                quality_4: "珍奇物品数",
                quality_5: "稀世物品数"
            },
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        }
    },
    methods: {},
    mounted: function () {
        // 输出物品总数统计
        get_items_count({client: this.client}).then((res) => {
            res = res.data;
            this.count = res.data;
        });
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/bread.less";
</style>
