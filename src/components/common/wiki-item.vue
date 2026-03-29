<template>
    <router-link
        class="u-item u-item-new"
        :to="{
            name: 'view',
            params: getViewParams(),
        }"
    >
        <div v-if="type !== 'quest'" class="u-icon">
            <img :src="iconUrl(item.IconID)" />
        </div>
        <div class="m-carousel-content">
            <div class="u-title">
                <LegacyIcon class="el-icon-medal" />
                <span v-text="`${type === 'quest' ? item.name : item.Name}`"></span>
            </div>
            <div class="u-desc">
                <LegacyIcon class="el-icon-mic" />
                <span v-html="`${type === 'quest' ? item.target : parseDesc(item.Desc)}`"></span>
            </div>
        </div>
    </router-link>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "WikiItem",
    props: {
        item: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            default: "achievement",
        },
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        iconUrl: function (id) {
            return iconLink(id, this.client);
        },
        getViewParams() {
            let params = {
                source_id: this.item.ID,
            };
            if (this.type === "item") {
                params = {
                    item_id: this.item.id,
                };
            }
            if (this.type === "quest") {
                params = {
                    quest_id: this.item.id,
                };
            }
            return params;
        },
        parseDesc(desc) {
            return desc
                ? desc
                      .replaceAll('<Text>text="', "")
                      .replace(/\".*?<\/text>/g, "")
                      .replaceAll("\\\\\\n", "")
                : "-";
        },
    },
};
</script>
<style lang="less">
.m-carousel-content {
    .u-title {
        i {
            margin-right: 4px;
        }
    }
    .u-desc {
        margin-top: 3px;
        .db;
        font-size: 12px;
        .lh(1.6em);
        color: #555555;
        cursor: pointer;
        opacity: 0.6;
        span {
            width: calc(100% - 20px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        i {
            .mr(6px);
        }
    }
}
</style>
