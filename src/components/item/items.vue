<template>
    <el-row class="m-items">
        <el-col :xs="24" :md="24" class="m-list-empty" v-if="error">
            <slot name="error-message">
                <span>{{ $t("ui.common.status.loadFailed") }}</span>
                <el-button link type="primary" @click="$emit('retry')">{{ $t("ui.common.actions.retry") }}</el-button>
            </slot>
        </el-col>
        <el-col :xs="24" :md="24" class="m-list-empty" v-else-if="items && !items.length">
            <slot name="empty-message">{{ $t("ui.common.status.noRecords") }}</slot>
        </el-col>
        <el-col :xs="24" :md="24" class="m-list-empty" v-else-if="items === null">
            <slot name="loading-message">{{ $t("ui.item.searching") }}</slot>
        </el-col>
        <template v-for="(item, key) in visibleItems" :key="itemKey(item, key)">
            <el-col :xs="24" :md="24" class="m-item-container">
                <router-link class="m-link" :target="target_filter()" :to="url_filter(item.id)">
                    <div class="m-left">
                        <ItemIcon :item="item" />
                    </div>
                    <div class="m-right">
                        <span class="u-uiid">ID : {{ item.id }}</span>
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
        error: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["retry"],
    methods: {
        url_filter: function (item_id) {
            return this.jump === true || typeof this.jump === "undefined"
                ? { name: "view", params: { item_id: item_id } }
                : {};
        },
        target_filter: function () {
            return this.target;
        },
        itemKey(item, fallback) {
            return item.idKey ?? item.id ?? item.ID ?? fallback;
        },
        item_color,
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        visibleItems() {
            return (this.items || []).filter((item) => item && Object.keys(item).length);
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
