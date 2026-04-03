<template>
    <div class="m-search-bar m-cj-search" :class="$route.name == 'view' ? 'can-return' : ''">
        <div class="m-return">
            <el-button class="u-return-btn" @click="returnHandle">
                <LegacyIcon class="el-icon-arrow-left" />返回
            </el-button>
        </div>
        <div class="m-search">
            <el-input
                class="u-search-input"
                :model-value="keyword"
                @update:modelValue="updateKeyword"
                @keydown.enter="searchHandle"
                :placeholder="placeholder"
                clearable
            >
                <template #prepend>
                    <slot><LegacyIcon class="el-icon-search" /> <span class="u-text">关键词</span></slot>
                </template>
                <template #append>
                    <el-button v-if="!hideAppendSearch" class="u-search-btn" type="primary" plain @click="searchHandle"
                        ><LegacyIcon class="el-icon-position" /> <span class="u-text">搜索</span></el-button
                    >
                    <slot name="append"></slot>
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
        hideAppendSearch: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            keyword: "",
            syncingFromRoute: false,
        };
    },
    watch: {
        "$route.fullPath": {
            immediate: true,
            handler() {
                this.syncingFromRoute = true;
                this.keyword = this.$route.params?.keyword || "";
                this.$nextTick(() => {
                    this.syncingFromRoute = false;
                });
            },
        },
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
        updateKeyword(val) {
            const oldVal = this.keyword;
            this.keyword = val || "";
            if (this.syncingFromRoute) return;
            if (oldVal && !this.keyword) {
                this.$emit("search", "");
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/search.less";
</style>
