<template>
    <el-popover
        v-if="source"
        placement="right-start"
        :trigger="click_trigger ? 'click' : 'hover'"
        :disabled="dishoverable"
        popper-class="m-item-icon-popup"
        :visible-arrow="false"
        transition="none"
        :close-delay="0"
        @show="show"
    >
        <template slot="reference">
            <div class="m-item-icon">
                <div class="u-item-icon" :style="`height:${size}px; width:${size}px`">
                    <a
                        target="_blank"
                        class="u-item-link"
                        :style="`height:${size}px; width:${size}px`"
                        :href="getLink('item', source.id)"
                        ><div
                            class="u-border"
                            :style="{ backgroundImage: item_border(source), opacity: source.Quality == 5 ? 0.9 : 1 }"
                        ></div>
                        <div class="u-border-quest" :style="{ backgroundImage: item_border_quest(source) }"></div>
                        <img class="u-item-icon" :src="icon_url(source.IconID)" />
                    </a>
                </div>
                <div class="u-name" v-if="has_title" :class="`quality-${source.Quality}`">{{ source.Name }}</div>
            </div>
        </template>

        <jx3-item :item="source" />
    </el-popover>
</template>

<script>
import Item from "@jx3box/jx3box-editor/src/Item";
import { get_item } from "@/service/item";
import { __imgPath } from "@/utils/config";
import { iconLink, getLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "CommonItemIcon",
    props: {
        item: {
            type: Object,
            default: () => {},
        },
        size: {
            type: Number,
            default: 36,
        },
        item_id: {
            type: String,
            default: null,
        },
        amount: {
            type: Number,
            default: 1,
        },
        dishoverable: {
            type: Boolean,
            default: false,
        },
        click_trigger: {
            type: Boolean,
            default: false,
        },
        has_title: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            source: null,
            real_id: null,
            maybeBook: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        cache_key() {
            return `item-${this.client}-${this.real_id}`;
        },
        display_amount() {
            if (this.maybeBook === false) {
                return this.amount;
            } else {
                return 1;
            }
        },
    },
    components: {
        "jx3-item": Item,
    },
    methods: {
        getLink,
        get_data(item_id) {
            if (item_id) {
                get_item(item_id, this.client)
                    .then((res) => {
                        let data = res.data;
                        let item = data.data.item;
                        if (Object.keys(item).length) {
                            this.source = item;
                            sessionStorage.setItem(this.cache_key, JSON.stringify(item));
                        }
                    })
                    .catch((e) => {
                        //书籍类物品id为 type_id_recipe， 其中recipe记录在物品的count里面
                        if (e?.data?.code == 400) {
                            if (this.maybeBook === false) {
                                this.maybeBook = true;
                                this.real_id = `${this.item_id}_${this.amount}`;
                            }
                        }
                    });
            }
        },
        show() {
            if (!this.source || typeof this.source.Genre === "undefined") {
                this.get_data(this.source.id);
            }
        },
        item_border(item) {
            switch (item.Quality) {
                case 3:
                    return `url(${__imgPath}image/item/blue.png)`;
                case 4:
                    return `url(${__imgPath}image/item/purple.png)`;
                case 5:
                    return `url(${__imgPath}image/item/orange.gif)`;
                default:
                    return "";
            }
        },
        item_border_quest(item) {
            if (item.IsQuest > 0) return `url(${__imgPath}image/item/renwu.png)`;
            return "";
        },
        icon_url: function (id) {
            // return iconLink(id, this.client);
            return iconLink(id); //收藏跨重制/缘起
        },
    },
    watch: {
        real_id: {
            immediate: true,
            handler() {
                let _cache = sessionStorage.getItem(this.cache_key);
                if (_cache) {
                    try {
                        this.source = JSON.parse(_cache);
                    } catch (e) {
                        console.log(e, "[Item]无法解析本地缓存");
                        this.get_data(this.real_id);
                    }
                } else {
                    this.get_data(this.real_id);
                }
            },
        },
        item: {
            immediate: true,
            handler() {
                this.source = this.item;
            },
        },
        item_id: {
            immediate: true,
            handler() {
                this.get_data(this.item_id);
            },
        },
    },
    mounted() {
        this.real_id = this.item_id;
    },
};
</script>

<style lang="less">
.m-item-icon-popup {
    min-width: 0 !important;
    padding: 0 !important;
    border: none;
    box-shadow: none;
    background-color: transparent;
    transform: translateY(-10px);
}
</style>
<style lang="less" scoped>
.m-item-icon {
    .flex;
    align-items: center;
    .u-name {
        .ml(10px);
    }
    .u-item-link {
        display: inline-flex;
        cursor: pointer;
        overflow: hidden;
    }
}
.u-item-icon {
    .pr;
    .dbi;

    .u-border,
    .u-border-quest {
        .pa;
        top: 0;
        left: 0;
        .w(100%);
        .h(100%);
        box-sizing: border-box;
        background-size: contain;
        .z(2);
    }

    .u-border-quest {
        .z(3);
    }

    .u-item-icon {
        .pr;
        .db;
        .w(36px);
        .h(auto);
        max-height: 36px;
        .z(1);
    }
}
</style>
