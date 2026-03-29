<template>
    <div class="m-search-bar m-cj-search" :class="$route.name == 'view' ? 'can-return' : ''">
        <div class="m-return">
            <el-button class="u-return-btn" @click="returnHandle"><LegacyIcon class="el-icon-arrow-left" />返回</el-button>
        </div>
        <div class="m-search">
            <el-input
                class="u-search-input"
                v-model="keyword"
                @keydown.enter="searchHandle"
                :placeholder="placeholder"
                clearable
                size="large"
            >
                <template #prepend>
                    <slot><LegacyIcon class="el-icon-search" /> <span class="u-text">关键词</span></slot>
                </template>
                <template #append>
                    <el-button class="u-search-btn" type="primary" plain @click="searchHandle"
                        ><LegacyIcon class="el-icon-position" /> <span class="u-text">搜索</span></el-button
                    >
                </template>
            </el-input>
            <slot name="filter"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: "CommonSearch",
        },
        placeholder: {
            type: String,
            default: "输入关键词「回车」进行搜索",
        },
    },
    data() {
        return {
            keyword: "",
        };
    },
    methods: {
        returnHandle() {
            if (history.length <= 1) {
                this.$router.push({
                    name: "home",
                });
            } else {
                history.back();
            }
        },
        searchHandle() {
            const keyword = this.keyword;
            this.$emit("search", keyword);
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/search.less";
</style>
