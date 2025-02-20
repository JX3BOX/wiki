<template>
    <div>
        <Header></Header>
        <Breadcrumb
            :name="name"
            :slug="slug"
            :root="computedRoot"
            :publishEnable="publishEnable"
            :adminEnable="adminEnable"
            :topicEnable="topicEnable"
            :feedbackEnable="feedbackEnable"
            :overlayEnable="overlayEnable"
            :crumbEnable="crumbEnable"
            :withoutLeft="withoutLeft"
            :adminMarks="adminMarks"
        >
            <template #logo>
                <img svg-inline :src="logo" />
            </template>
            <slot name="breadcrumb"></slot>
            <template #op-append>
                <el-button class="u-wiki-push" size="small" v-if="showPush" type="warning" @click="onPush">
                    <i class="el-icon-position"></i>
                    推送</el-button
                >
            </template>
        </Breadcrumb>
        <LeftSidebar>
            <slot name="left"></slot>
        </LeftSidebar>

        <Main :withoutRight="withoutRight">
            <div class="m-main" :class="'p-' + pageName">
                <slot></slot>
            </div>

            <RightSidebar class="m-wiki-right-side" :show-toggle="true">
                <slot name="right"></slot>
            </RightSidebar>
            <Footer></Footer>
        </Main>
    </div>
</template>

<script>
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import bus from "@/store/bus.js";
export default {
    name: "DefaultLayout",
    props: {
        name: {
            type: String,
            default: "成就百科",
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
        showPush() {
            return this.$route.name === "view" && User.isEditor();
        },
    },
    data() {
        return {
            logo: __cdn + "logo/logo-light/cj.svg",
        };
    },
    methods: {
        onPush() {
            bus.emit("openWikiPush", true);
        },
    },
    mounted() {
        console.log(this.$route);
    },
};
</script>

<style lang="less">
.m-main {
    padding: 15px;
}
.c-sidebar-left {
    padding-left: 0;
    padding-top: 0;
}
.c-breadcrumb .u-op {
    .u-wiki-push {
        position: absolute;
        top: -2px;
        right: 95px;
        height: 32px;
    }
}
</style>
