<template>
    <div class="m-home-view m-wiki-home m-cj-home">
        <WikiPanel :border="false">
            <template #head-title>
                <LegacyIcon class="el-icon-location-information" />
                <span>{{ $t("ui.common.home.quickEntry") }}</span>
            </template>
            <template #body>
                <ul class="m-qlinks">
                    <li class="u-qlink">
                        <a class="u-qlink--red" href="/tool/9126" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon class="el-icon-trophy" />
                            <span>{{ $t("ui.common.home.inGameWiki") }}</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a href="/tool/74559" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon class="el-icon-refresh" />
                            <span>{{ $t("ui.achievement.quick.sync") }}</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a class="u-qlink--yellow u-qlink--sparkle" href="/pvx/achievements" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon class="el-icon-medal" />
                            <span>{{ $t("ui.achievement.quick.handbook") }}</span>
                            <span class="u-sparkles" aria-hidden="true"><i></i><i></i><i></i></span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a class="u-qlink--yellow u-qlink--sparkle" href="/pvx/adventure" target="_blank" rel="noopener noreferrer">
                            <el-icon><Reading /></el-icon>
                            <span>{{ $t("ui.achievement.quick.adventureScroll") }}</span>
                            <span class="u-sparkles" aria-hidden="true"><i></i><i></i><i></i></span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a href="/adventure" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon class="el-icon-ice-drink" />
                            <span>{{ $t("ui.achievement.quick.adventures") }}</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a href="/pet" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon class="el-icon-grape" />
                            <span>{{ $t("ui.achievement.quick.pets") }}</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a href="/pvx/partner" target="_blank" rel="noopener noreferrer">
                            <LegacyIcon class="el-icon-user" />
                            <span>{{ $t("ui.achievement.quick.partners") }}</span>
                        </a>
                    </li>
                </ul>
            </template>
        </WikiPanel>
        <WikiPanel :border="false">
            <template #head-title>
                <LegacyIcon class="el-icon-notebook-1" />
                <span>{{ $t("ui.achievement.hot") }}</span>
            </template>
            <template #body>
                <div class="m-achievement-slider">
                    <el-carousel height="66px" direction="vertical" indicator-position="none">
                        <el-carousel-item v-for="(items, key) in hot_achievements" :key="key" class="m-carousel m-hot">
                            <el-row :gutter="20">
                                <template v-for="(item, k) in items" :key="k">
                                    <el-col :md="8" v-if="item">
                                        <WikiItem :class="`u-item-${k}`" :item="item"></WikiItem>
                                    </el-col>
                                </template>
                            </el-row>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </template>
        </WikiPanel>

        <WikiPanel :border="false">
            <template #head-title>
                <LegacyIcon class="el-icon-notebook-2" />
                <span>{{ $t("ui.achievement.newest") }}</span>
            </template>
            <template #head-actions>
                <router-link class="u-wiki-more" :to="{ name: 'newest' }">{{ $t("ui.common.actions.more") }}</router-link>
            </template>
            <template #body>
                <el-carousel height="66px" direction="vertical" :interval="3500" indicator-position="none">
                    <el-carousel-item v-for="(items, key) in newest_achievements" :key="key" class="m-carousel">
                        <el-row :gutter="20">
                            <el-col :md="8" v-for="(item, k) in items" :key="k">
                                <WikiItem :class="`u-item-${k}`" :item="item"></WikiItem>
                            </el-col>
                        </el-row>
                    </el-carousel-item>
                </el-carousel>
            </template>
        </WikiPanel>

        <PostList />
    </div>
</template>

<script>
import { Reading } from "@element-plus/icons-vue";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import chunk from "lodash/chunk";
import WikiItem from "@/components/common/wiki-item.vue";
import WikiPanel from "@/components/common/wiki-panel.vue";
import PostList from "@/components/common/post-list.vue";

export default {
    name: "Home",
    components: { WikiPanel, PostList, WikiItem, Reading },
    data() {
        return {
            hot_achievements: [],
            newest_achievements: [],
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        async loadHotAchievements() {
            try {
                const key = this.client === "origin" ? "origin_cj" : "cj";
                const ranking = await getStatRank(key, "views", 9);
                const ids = [...new Set((ranking.data || []).map((item) => String(item.name).split("-").pop()).filter((id) => /^\d+$/.test(id)))];
                if (!ids.length) return;
                const response = await wiki.achievements({ ids: ids.join(","), limit: ids.length, client: this.client });
                const items = Object.values(response.data?.data?.achievements || {});
                const byId = new Map(items.map((item) => [String(item.ID), item]));
                this.hot_achievements = chunk(ids.map((id) => byId.get(id)).filter(Boolean), 3);
            } catch {
                this.hot_achievements = [];
            }
        },
        async loadNewestAchievements() {
            try {
                const response = await wiki.achievements({ per: 9, client: this.client });
                this.newest_achievements = chunk(Object.values(response.data?.data?.achievements || {}), 3);
            } catch {
                this.newest_achievements = [];
            }
        },
    },
    created() {
        this.loadHotAchievements();
        this.loadNewestAchievements();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/home.less";
</style>
