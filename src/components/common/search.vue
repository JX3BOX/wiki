<template>
    <div class="m-search-bar m-cj-search" :class="$route.name == 'view' ? 'can-return' : ''">
        <div class="m-return">
            <el-button class="u-return-btn" @click="returnHandle">
                <LegacyIcon class="el-icon-arrow-left" />{{ $t("ui.common.actions.back") }}
            </el-button>
        </div>
        <div class="m-search">
            <el-input
                class="u-search-input"
                :model-value="keyword"
                @update:modelValue="updateKeyword"
                @keydown.enter="searchHandle"
                :placeholder="displayPlaceholder"
                clearable
            >
                <template #prepend>
                    <slot
                        ><LegacyIcon class="el-icon-search" />
                        <span class="u-text">{{ $t("ui.common.labels.keyword") }}</span></slot
                    >
                </template>
                <template #append>
                    <el-button v-if="!hideAppendSearch" class="u-search-btn" type="primary" plain @click="searchHandle"
                        ><LegacyIcon class="el-icon-position" />
                        <span class="u-text">{{ $t("ui.common.actions.search") }}</span></el-button
                    >
                    <slot name="append"></slot>
                </template>
            </el-input>
            <slot name="filter"></slot>
        </div>
    </div>
</template>

<script>
import debounce from "lodash/debounce";

export default {
    props: {
        name: {
            type: String,
            default: "CommonSearch",
        },
        placeholder: {
            type: String,
            default: "",
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
    computed: {
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        },
        displayPlaceholder() {
            return this.isMobile
                ? this.$t("ui.common.placeholders.keywordMobile")
                : this.placeholder || this.$t("ui.common.placeholders.keyword");
        },
    },
    created() {
        this.debouncedSearch = debounce((keyword) => {
            this.$emit("search", keyword);
        }, 500);
    },
    beforeUnmount() {
        if (this.debouncedSearch) {
            this.debouncedSearch.cancel();
        }
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
            if (this.debouncedSearch) this.debouncedSearch.cancel();
            const keyword = this.keyword;
            this.$emit("search", keyword);
        },
        updateKeyword(val) {
            const oldVal = this.keyword;
            this.keyword = val || "";
            if (this.syncingFromRoute) return;
            
            if (this.isMobile) {
                this.debouncedSearch(this.keyword);
            } else if (oldVal && !this.keyword) {
                this.$emit("search", "");
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/search.less";
</style>
