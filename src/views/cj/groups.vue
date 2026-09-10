<template>
    <article class="p-cj-groups">
        <router-link class="u-back" :to="{ name: 'home' }">← {{ $t("ui.achievement.groupsBack") }}</router-link>
        <header class="m-groups-header">
            <div class="m-groups-heading">
                <span class="u-symbol"><LegacyIcon class="el-icon-chat-dot-round" /></span>
                <div>
                    <h1>{{ $t("ui.achievement.groups") }}</h1>
                    <p>{{ $t("ui.achievement.groupsIntro") }}</p>
                </div>
            </div>
            <a class="u-apply" href="/tool/13659/" target="_blank" rel="noopener noreferrer">{{ $t("ui.achievement.applyDisplay") }}</a>
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
    padding: 4px 15px 24px;
    color: #535c6a;
    font-size: 14px;
    line-height: 1.6;
    .u-back { display: inline-flex; padding: 6px 0; margin-bottom: 12px; color: #939aa7; font-size: 12px; text-decoration: none; &:hover { color: @v4primary; } }
    a:focus-visible { outline: 2px solid #aa98e0; outline-offset: 3px; }
}
.m-groups-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
    .m-groups-heading { display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1 1 280px; }
    .u-symbol { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: #f0ebfc; color: @v4primary; font-size: 22px; flex-shrink: 0; }
    h1 { margin: 0 0 5px; color: #454d5a; font-size: 20px; font-weight: 600; }
    p { margin: 0; color: #939aa7; font-size: 12px; overflow-wrap: anywhere; }
    .u-apply { padding: 7px 12px; border: 1px solid #e7e0f6; border-radius: 7px; background: #f8f6fd; color: #8068bc; font-size: 12px; text-decoration: none; &:hover { background: #eee8fb; } }
}
@media (max-width: @phone) {
    .p-cj-groups { padding: 0 0 16px; }
    .m-groups-header h1 { font-size: 18px; }
}
</style>
