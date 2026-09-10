<template>
    <div class="m-right-side" :class="{ isHome: $route.name === 'home' }">
        <SideMsg />
        <Rank />
        <div class="m-group-entry">
            <router-link class="u-directory-link" :to="{ name: 'groups' }">
                <img class="u-icon" svg-inline src="@/assets/img/cj/puzzle.svg" />
                <span>{{ $t("ui.achievement.groups") }}</span>
                <span class="u-arrow" aria-hidden="true">→</span>
            </router-link>
        </div>
    </div>
</template>

<script>
import SideMsg from "@/components/common/side-msg.vue";
import Rank from "@/components/common/rank.vue";

export default {
    name: "Extend",
    components: { SideMsg, Rank },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/right-side.less";
.m-right-side .m-group-entry {
    padding: 12px 15px 20px;

    .u-directory-link {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px;
        border: 1px solid #e8e1f6;
        border-radius: 10px;
        background: #f7f5fc;
        color: #7862ad;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        transition: background-color 0.18s, border-color 0.18s;
        &:hover { background: #eee8fb; border-color: #cdbfeb; color: @v4primary; }
        &:focus-visible { outline: 2px solid #aa98e0; outline-offset: 3px; }
    }
    .u-icon { width: 20px; height: 20px; flex-shrink: 0; }
    .u-arrow { margin-left: auto; font-size: 17px; }
}
</style>
