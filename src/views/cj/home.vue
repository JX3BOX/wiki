<template>
    <div class="m-home-view m-wiki-home m-cj-home">
        <WikiPanel :border="false">
            <template #head-title>
                <LegacyIcon class="el-icon-location-information" />
                <span>{{ $t("ui.common.home.quickEntry") }}</span>
            </template>
            <template #body>
                <ul class="m-qlinks m-home-featured">
                    <li class="u-qlink">
                        <a class="u-feature" href="/pvx/achievements" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon class="el-icon-notebook-1" />
                            <span>{{ $t("ui.achievement.quick.handbook") }}</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <router-link class="u-feature" :to="{ name: 'groups' }">
                            <LegacyIcon class="el-icon-chat-dot-round" />
                            <span>{{ $t("ui.achievement.groups") }}</span>
                        </router-link>
                    </li>
                </ul>
            </template>
        </WikiPanel>
        <WikiPanel :border="false">
            <template #head-title>
                <LegacyIcon class="el-icon-collection" />
                <span>{{ $t("ui.achievement.collections") }}</span>
            </template>
            <template #body>
                <ul class="m-qlinks m-home-collections" :aria-label="$t('ui.achievement.collections')">
                    <li v-for="item in collections" :key="item.key" class="u-qlink">
                        <a :href="item.href" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon :class="item.icon" />
                            <span>{{ $t(`ui.achievement.quick.${item.key}`) }}</span>
                        </a>
                    </li>
                </ul>
            </template>
        </WikiPanel>
        <PostList />
    </div>
</template>

<script>
import WikiPanel from "@/components/common/wiki-panel.vue";
import PostList from "@/components/common/post-list.vue";

export default {
    name: "Home",
    components: { WikiPanel, PostList },
    data() {
        return {
            collections: [
                { key: "adventures", href: "/adventure", icon: "el-icon-ice-drink" },
                { key: "pets", href: "/pet", icon: "el-icon-grape" },
                { key: "mounts", href: "/horse", icon: "el-icon-watermelon" },
                { key: "furniture", href: "/furniture", icon: "el-icon-cherry" },
            ],
        };
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/home.less";
</style>
