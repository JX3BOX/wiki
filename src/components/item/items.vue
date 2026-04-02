<template>
    <el-row class="m-items">
        <el-col :xs="24" :md="24" class="u-list-empty" v-if="items && !items.length">
            <slot name="empty-message">👻 暂无记录</slot>
        </el-col>
        <el-col :xs="24" :md="24" class="u-list-empty" v-if="items === null">
            <slot name="loading-message">🐷 搜索记录中</slot>
        </el-col>
        <template v-for="(item, key) in items">
            <el-col v-if="Object.keys(item).length" :key="key" :xs="24" :md="24" class="m-item-container">
                <router-link class="m-link" :target="target_filter()" :to="url_filter(item.id)">
                    <div class="m-left">
                        <ItemIcon :item="item" />
                    </div>
                    <div class="m-right">
                        <span class="u-uiid" v-html="`ID : ${item.id}`"></span>
                        <h6
                            class="u-name"
                            :class="{ white: item.Quality == 1 }"
                            v-text="item.Name"
                            :style="{ color: item_color(item.Quality === 1 ? -1 : item.Quality) }"
                        ></h6>
                        <game-text
                            class="u-description"
                            :client="client"
                            :text="item.DescHtml || item.Desc"
                        ></game-text>
                    </div>
                </router-link>
            </el-col>
        </template>
    </el-row>
</template>

<script>
import ItemIcon from "@/components/common/item-icon.vue";
import GameText from "@jx3box/jx3box-editor/src/GameText.vue";
import { item_color } from "@/filters";

export default {
    name: "Items",
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        target: {
            type: String,
            default: "",
        },
        jump: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        url_filter: function (item_id) {
            return this.jump === true || typeof this.jump === "undefined"
                ? { name: "view", params: { item_id: item_id } }
                : {};
        },
        target_filter: function () {
            return this.target || typeof this.target !== "undefined" ? this.target : "";
        },
        item_color,
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    components: {
        ItemIcon,
        GameText,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/items.less";
</style>
