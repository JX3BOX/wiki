<template>
    <article class="p-cj-groups">
        <header class="m-groups-header">
            <router-link class="u-back" :to="{ name: 'home' }">← {{ $t("ui.achievement.groupsBack") }}</router-link>
            <h1>{{ $t("ui.achievement.groups") }}</h1>
            <p>{{ $t("ui.achievement.groupsIntro") }}</p>
            <a class="u-apply" href="https://www.jx3box.com/tool/13659/" target="_blank" rel="noopener noreferrer">{{
                $t("ui.achievement.applyDisplay")
            }}</a>
        </header>
        <GroupDirectory />
    </article>
</template>

<script>
import GroupDirectory from "@/components/cj/group-directory.vue";
export default {
    name: "AchievementGroups",
    components: { GroupDirectory },
};
</script>

<style lang="less" scoped>
.p-cj-groups {
    padding: 12px 15px;
    color: #3d454d;
    font-size: 14px;
    line-height: 1.6;
    .u-back {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 4px;
        background: mix(@v4primary, #fff, 8%);
        color: @v4primary;
        border: 1px solid mix(@v4primary, #fff, 40%);
        font-size: 13px;
        &:hover {
            background: mix(@v4primary, #fff, 14%);
            border-color: @v4primary;
        }
    }
    a:focus-visible {
        outline: 2px solid @v4primary;
        outline-offset: 3px;
    }
}
.m-groups-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px 16px;
    margin: 0 0 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
    .u-back,
    h1,
    .u-apply {
        flex-shrink: 0;
    }
    h1 {
        margin: 0;
        color: #6c645c;
        font-size: 18px;
        font-weight: 500;
    }
    p {
        flex: 1;
        min-width: 240px;
        margin: 0;
        color: #888;
        font-size: 13px;
    }
    .u-apply {
        margin-left: auto;
        color: @v4primary;
        font-size: 12px;
        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
