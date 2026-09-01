<template>
    <div
        class="m-search-bar"
        :class="$route.name == 'plan_view' ? 'can-return' : ''"
    >
        <div class="m-return">
            <el-button size="large" class="u-return-btn" @click="return_handle">{{ $t("ui.common.actions.back") }}</el-button>
        </div>
        <div class="m-search">
            <el-input
                class="u-search-input"
                v-model="keyword"
                @keydown.enter="search_handle"
                :placeholder="$t('ui.item.planSearchPlaceholder')"
            >
                <template #prepend><span>{{ $t("ui.common.labels.keyword") }}</span></template>
                <template #append><el-button
                    class="u-search-btn"
                    type="primary"
                    plain
                    @click="search_handle"
                    >{{ $t("ui.common.actions.search") }}</el-button></template>
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
