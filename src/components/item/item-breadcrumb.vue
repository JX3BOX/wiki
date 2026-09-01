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
        };
    },
    computed: {
        countDict() {
            return {
                total: this.$t("ui.item.stats.total"),
                quality_0: this.$t("ui.item.stats.quality0"),
                quality_1: this.$t("ui.item.stats.quality1"),
                quality_2: this.$t("ui.item.stats.quality2"),
                quality_3: this.$t("ui.item.stats.quality3"),
                quality_4: this.$t("ui.item.stats.quality4"),
                quality_5: this.$t("ui.item.stats.quality5"),
            };
        },
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
