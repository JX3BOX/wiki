<template>
    <div class="m-wiki-detail-notice" :class="{ 'has-robot-tip': showRobotTip }">
        <slot name="notice"><Notice :notice-key="noticeKey" /></slot>
        <WikiRobotTip v-if="showRobotTip" :type-name="typeName" :reply="reply" />
    </div>
</template>

<script>
import Notice from "@/components/cj/notice.vue";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";

export default {
    name: "WikiDetailNotice",
    components: { Notice, WikiRobotTip },
    props: {
        noticeKey: { type: String, default: "wiki_cj_ac" },
        typeName: { type: String, default: "" },
        reply: { type: String, default: "" },
        showRobotTip: { type: Boolean, default: false },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/wiki-detail-notice.less";
</style>
