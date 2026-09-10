<template>
    <div class="m-wiki-top">
        <div class="m-wiki-top__header">
            <h3 class="u-title"><LegacyIcon class="el-icon-news" />{{ $t("ui.common.robot.notice") }}</h3>
        </div>
        <div class="m-wiki-top__content" v-html="data"></div>
    </div>
</template>

<script>
import { getBreadcrumb } from "@/service/achievement";
export default {
    name: "WikiNotice",
    props: {
        noticeKey: { type: String, default: "wiki_cj_ac" },
    },
    data() {
        return {
            data: "",
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async loadData() {
            try {
                // 公告由后台随时更新，每次进入页面重新读取，避免会话缓存长期显示旧内容。
                this.data = await getBreadcrumb(this.noticeKey);
            } catch (e) {
                this.data = "";
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/notice.less";
</style>
