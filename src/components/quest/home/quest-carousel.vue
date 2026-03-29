<template>
    <div class="m-quest-carousel">
        <el-carousel height="66px" direction="vertical" :interval="3500" indicator-position="none">
            <el-carousel-item
                v-for="(items, key) in chunkedQuests"
                :key="key"
                class="m-carousel"
                :class="{ 'm-hot': hot }"
            >
                <el-row :gutter="20">
                    <el-col :md="8" v-for="(item, k) in items" :key="k">
                        <WikiItem type="quest" :class="`u-item-${k}`" :item="item" />
                        <!-- <router-link
                            class="u-item"
                            :class="{
                                [`u-item-${k}`]: true,
                                'u-item-new': !hot,
                            }"
                            :to="{
                                name: 'view',
                                params: { quest_id: item.id },
                            }"
                        >
                            <div class="m-carousel-content">
                                <span class="u-title">
                                    <LegacyIcon class="el-icon-aim" />
                                    <span v-text="` ${item.name}`"></span>
                                </span>
                                <span class="u-desc">
                                    <LegacyIcon class="el-icon-mic" />
                                    <span v-html="` ${item.target}`"></span>
                                </span>
                                <span class="u-rank" v-if="views && views[item.id]">
                                    <LegacyIcon class="el-icon-watermelon" />
                                    <span v-text="`昨日 - ${views[item.id]['yesterday']}`"></span>
                                    <LegacyIcon class="el-icon-grape" />
                                    <span v-text="`七天 - ${views[item.id]['7days']}`"></span>
                                    <LegacyIcon class="el-icon-pear" />
                                    <span v-text="`三十天 - ${views[item.id]['30days']}`"></span>
                                </span>
                            </div>
                        </router-link> -->
                    </el-col>
                </el-row>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import { chunk } from "lodash";
import WikiItem from "@/components/common/wiki-item.vue";
export default {
    name: "QuestCarousel",
    components: {
        WikiItem,
    },
    props: {
        quests: {
            type: Array,
            default: () => [],
        },
        views: {
            type: Object,
            default: () => {},
        },
        hot: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        chunkedQuests: [],
    }),
    watch: {
        quests: {
            immediate: true,
            handler() {
                this.chunkedQuests = chunk(this.quests, 3);
            },
        },
    },
};
</script>

<style lang="less" scoped>
.m-quest-carousel {
    .u-item {
        position: relative;
        .db;
        .w(100%);
        padding-left: 15px;
        padding-right: 10px;
        box-sizing: border-box;
        border: 1px solid #d7dae1;
        border-left: none;
        background-color: #f5f7fa;
        border-radius: 5px;
        color: #3d454d;
        overflow: hidden;
        .h(66px);

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            border-left: 5px solid #3a97eb;
        }
    }

    .u-item-new {
        padding-top: 8px;

        .u-title {
            .lh(24px);
        }
    }
}
</style>
