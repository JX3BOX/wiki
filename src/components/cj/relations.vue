<template>
    <WikiPanel
        class="m-relations-panel"
        scene="detail"
        v-if="(relations && relations.length) || npc"
    >
        <template #head-title>
            <LegacyIcon class="el-icon-link" />
            <span>{{ $t("ui.achievement.relations") }}</span>
            <em class="u-remark">{{ $t("ui.achievement.sameBoss") }}</em>
        </template>
        <template #head-actions>
            <el-button type="primary" class="u-boss" :class="{ on: show_npc }" @click="show_npc = !show_npc">{{
                $t("ui.achievement.bossReference")
            }}</el-button>
        </template>
        <template #body>
            <div class="m-section">
                <div class="u-empty" v-if="!relations || !relations.length">
                    <span v-if="relations === null">{{ $t("ui.common.status.loading") }}</span>
                    <span v-if="relations && !relations.length">{{ $t("ui.achievement.noRelations") }}</span>
                </div>
                <div class="m-relations" v-if="relations && relations.length">
                    <router-link class="u-title" v-for="(relation, key) in relations" :key="key" :to="{ name: 'view', params: { source_id: relation.ID } }">
                        <img
                            class="u-icon"
                            :src="icon_url(relation.IconID)"
                            @error.once="
                                () => {
                                    $event.target.src = icon_url();
                                }
                            "
                        />
                        <span class="u-text" v-text="relation.Name"></span>
                    </router-link>
                </div>
            </div>
            <div class="m-section m-bossinfos" v-show="show_npc" v-if="npc">
                <ul class="m-bossinfo">
                    <li class="u-id">
                        ID:
                        <em></em>
                        {{ npc.ID }}
                    </li>
                    <li class="u-name">
                        {{ $t("ui.achievement.boss") }}
                        <em></em>
                        {{ npc.Name }}
                    </li>
                    <li v-for="item in bossInfo.base" :key="item.key" class="u-desc" :title="item.title">
                        {{ item.zh }}
                        <em>{{ item.key }}</em>
                        {{ npc[item.key] }}
                    </li>
                </ul>

                <ul class="m-bossinfo">
                    <li v-for="item in bossInfo.shield" :key="item.key" class="u-desc" :title="item.title">
                        {{ item.zh }}
                        <em>{{ item.key }}</em>
                        {{ npc[item.key] }}
                    </li>
                </ul>

                <ul class="m-bossinfo">
                    <li v-for="item in bossInfo.strike" :key="item.key" class="u-desc" :title="item.title">
                        {{ item.zh }}
                        <em>{{ item.key }}</em>
                        {{ npc[item.key] }}
                    </li>
                </ul>

                <ul class="m-bossinfo">
                    <li v-for="item in bossInfo.hit" :key="item.key" class="u-desc" :title="item.title">
                        {{ item.zh }}
                        <em>{{ item.key }}</em>
                        {{ npc[item.key] }}
                    </li>
                </ul>

                <ul class="m-bossinfo">
                    <li v-for="item in bossInfo.other" :key="item.key" class="u-desc" :title="item.title">
                        {{ item.zh }}
                        <em>{{ item.key }}</em>
                        {{ npc[item.key] }}
                    </li>
                </ul>
            </div>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "@/components/common/wiki-panel.vue";
import { getRelationAchievements } from "@/service/achievement";
import { getBossInfo } from "@/service/relations";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import bossInfo from "@/assets/data/boss.json";

export default {
    name: "Relation",
    props: ["sourceId"],
    data() {
        return {
            relations: null,
            npc: null,
            show_npc: false,

            bossInfo,
        };
    },
    computed: {
        client: function() {
            return this.$store.state.client;
        },
    },
    methods: {
        icon_url: function(id) {
            return iconLink(id,this.client);
        },
        // 获取boss信息
        getBossInfo(npcid) {
            npcid &&
                getBossInfo(npcid)
                    .then((res) => {
                        const list = res?.data?.list;
                        if (list && list.length) this.npc = list[0];
                    })
                    .catch(() => {
                        this.npc = null;
                    });
        },
    },
    components: {
        WikiPanel,
    },
    watch: {
        sourceId: {
            immediate: true,
            handler() {
                if (this.sourceId) {
                    getRelationAchievements(this.sourceId)
                        .then((res) => {
                            const result = res?.data?.data;
                            if (!result) {
                                this.relations = false;
                                return;
                            }

                            this.relations = Array.isArray(result.relations) ? result.relations : [];

                            // 获取boss信息
                            this.getBossInfo(result.boss_id);
                        })
                        .catch(() => {
                            this.relations = false;
                        });
                }
            },
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/relation.less";
</style>
