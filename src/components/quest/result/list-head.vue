<template>
    <div class="m-list-head">
        <div>{{ $t("ui.quest.startMap") }}</div>
        <div>{{ $t("ui.quest.name") }}</div>
        <div>{{ $t("ui.quest.level") }}</div>
        <div>{{ $t("ui.quest.target") }}</div>
        <div>{{ $t("ui.quest.reward") }}</div>
    </div>
</template>

<script>
export default {
    name: "ListHead",
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/result/list-head.less";
</style>
