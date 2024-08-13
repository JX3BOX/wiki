<template>
    <div>
        <Header></Header>

        <Main :withoutLeft="withoutLeft" :withoutRight="withoutRight">
            <div class="m-main" :class="'p-' + pageName">
                <slot></slot>
            </div>
        </Main>
    </div>
</template>

<script>
export default {
    name: "DefaultLayout",
    props: {
        name: {
            type: String,
            default: "Wiki",
        },
        slug: {
            type: String,
            default: "achievement",
        },
        root: {
            type: String,
            default: "",
        },
        withoutRight: {
            type: Boolean,
            default: false,
        },
        publishEnable: {
            type: Boolean,
            default: false,
        },
        adminEnable: {
            type: Boolean,
            default: false,
        },
        topicEnable: {
            type: Boolean,
            default: false,
        },
        feedbackEnable: {
            type: Boolean,
            default: false,
        },
        overlayEnable: {
            type: Boolean,
            default: false,
        },
        crumbEnable: {
            type: Boolean,
            default: true,
        },
        withoutLeft: {
            type: Boolean,
            default: false,
        },
        adminMarks: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        computedRoot: function () {
            return this.root ? this.root : this.slug;
        },
        pageName: function () {
            return this.$route.name;
        },
    },
};
</script>

<style lang="less">
.c-main {
    margin-top: @header-height;
}
</style>
