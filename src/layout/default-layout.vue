<template>
    <div :class="pageClass">
        <CommonHeader :overlay-enable="overlayEnable"></CommonHeader>
        <Breadcrumb
            :name="name || $t('ui.apps.achievement')"
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
                <div class="m-wiki-admin-drop" v-if="showAdmin">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <el-button type="primary" class="c-admin-button c-admin-drop__button"
                            ><LegacyIcon class="el-icon-setting u-left-icon" />
                            <span class="u-label">{{ $t("ui.common.actions.admin") }}</span>
                            <LegacyIcon class="el-icon-arrow-down u-right-icon" />
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item
                                    icon="Upload"
                                    command="designTask"
                                    v-if="hasPermission('push_banner')"
                                >
                                    <span>{{ $t("ui.common.actions.push") }}</span>
                                </el-dropdown-item>
                                <el-dropdown-item icon="Refresh" command="pictureTask">
                                    <span>{{ $t("ui.common.actions.generateImage") }}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
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
            <Footer class="m-wiki-footer"></Footer>
        </Main>
    </div>
</template>

<script>
import CommonHeader from "@jx3box/jx3box-ui/src/CommonHeader.vue";
import { __cdn } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";
import bus from "@/store/bus.js";
import { refreshQQBotImage } from "@/service/wiki";
export default {
    name: "DefaultLayout",
    components: {
        CommonHeader,
    },
    props: {
        name: {
            type: String,
            default: "",
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
            return !isMiniProgram() && !isApp() && this.$route.name === "view" && User.isEditor();
        },
        logo() {
            const key = this.icon || this.slug;
            return __cdn + "logo/logo-light/" + key + ".svg";
        },
        pageClass(){
            return `${"p-" + this.slug + '-' + this.$route.name + ' p-' + this.slug}`;
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
        pictureTask() {
            const pathname = location.pathname;
            const pattern = /\/([^/]+)\/view\/([\d_]+)/;
            const match = pathname.match(pattern);
            let task_type = "";
            let task_target_id = "";
            if (match) {
                task_type = match[1];
                task_target_id = match[2];
            }
            if (task_type && task_target_id) {
                refreshQQBotImage({
                    task_type,
                    task_target_id,
                }).then((res) => {
                    if (!res.data.code) {
                        this.$message.success(this.$t("ui.common.status.imageSubmitted"));
                    }
                });
            } else {
                this.$message.error(this.$t("ui.common.status.invalidParams"));
            }
        },
    },
};
</script>

<style lang="less">
.m-main {
    padding: 15px 0;
}
.c-sidebar-left {
    padding-left: 0;
    padding-top: 0;
}
.c-breadcrumb {
    .m-wiki-admin-drop {

        .c-admin-drop__button {
            display: inline-flex;
            align-items: center;
            gap: 0;

            .legacy-icon,
            [data-legacy-icon] {
                line-height: 1;
            }

            .u-left-icon {
                margin-right: 4px;
            }

            .u-right-icon {
                margin-left: 4px;
            }
        }
    }
}
</style>
