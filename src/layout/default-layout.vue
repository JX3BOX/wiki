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
            <img svg-inline slot="logo" :src="logo" />
            <slot name="breadcrumb"></slot>
            <template #op-append>
                <div class="m-wiki-admin-drop" v-if="showAdmin">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <el-button type="primary" class="c-admin-button c-admin-drop__button" size="medium"
                            ><i class="el-icon-setting"></i> 管理<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                                icon="el-icon-upload"
                                command="designTask"
                                v-if="hasPermission('push_banner')"
                            >
                                <span>推送</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
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
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";
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
        icon: {
            type: String,
            default: "",
        },
    },
    computed: {
        computedRoot: function () {
            return this.root ? this.root : this.slug;
        },
        pageName: function () {
            return this.$route.name;
        },
        showAdmin() {
            return !isMiniProgram() && this.$route.name === "view" && User.isEditor();
        },
        logo() {
            const key = this.icon || this.slug;
            return __cdn + "logo/logo-light/" + key + ".svg";
        }
    },
    methods: {
        hasPermission(permission) {
            return User.hasPermission(permission);
        },
        handleCommand(command) {
            this[command]();
        },
        designTask() {
            bus.emit("openWikiPush", true);
        },
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
.c-breadcrumb {
    .m-wiki-admin-drop {
        position: absolute;
        top: -2px;
        right: 95px;
        height: 32px;
    }
}
</style>
