<template>
    <div
        class="m-search-bar"
        :class="$route.name == 'plan_view' ? 'can-return' : ''"
    >
        <div class="m-return">
            <el-button class="u-return-btn" @click="return_handle"
                >返回</el-button
            >
        </div>
        <div class="m-search">
            <el-input
                class="u-search-input"
                v-model="keyword"
                @keydown.enter.native="search_handle"
                placeholder="输入物品清单名称「回车」进行搜索"
            >
                <span slot="prepend">关键词</span>
                <el-button
                    slot="append"
                    class="u-search-btn"
                    type="primary"
                    plain
                    @click="search_handle"
                    >搜索</el-button
                >
            </el-input>
        </div>
    </div>
</template>

<script>
import {__Links} from "@/utils/config";

export default {
    name: "PlanSearch",
    data() {
        return {
            keyword: "",
        };
    },
    methods: {
        return_handle() {
            if (history.length <= 1) {
                this.$router.push({ name: "plan_list" });
            } else {
                history.back();
            }
        },
        add_handle() {
            location.href = `${__Links.dashboard.publish}#/item/plan`;
        },
        search_handle() {
            this.$router.push({
                name: "plan_list",
                params: { keyword: this.keyword },
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/search.less";
</style>
