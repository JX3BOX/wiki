<template>
    <div class="w-mobile-item-card" @click="$emit('click')">
        <div class="m-icon-section">
            <div class="u-quality" :class="`quality-${item.Quality}`"></div>
            <img class="u-icon" :src="iconLink" alt="" />
        </div>
        <div class="m-content-section">
            <div class="u-primary">
                <span class="u-name">{{ item.Name }}</span>
                <span class="u-id" v-if="!count">{{ item.id }}</span>
                <span class="u-count" v-if="count">x {{ count }}</span>
            </div>
            <div class="u-secondary">
                <span class="u-desc">
                    <GameText :text="item.Desc" :ignoreColor="true" :client="final_client"></GameText>
                </span>
            </div>
        </div>
        <div
            class="m-actions-section"
            @click.stop="onActionClick"
            :class="{ 'is-delete': showDelete, 'is-edit-count': showEditCount }"
        >
            <template v-if="showDelete">
                <i class="u-icon el-icon-close"></i>
            </template>
            <template v-else-if="showEditCount">
                <i class="u-icon el-icon-edit"></i>
                <span class="u-count">x{{ count }}</span>
            </template>
        </div>
    </div>
</template>

<script>
import { getItemByResource } from "@/service/item";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import GameText from "@jx3box/jx3box-editor/src/GameText.vue";

export default {
    name: "MobileItemCard",
    components: { GameText },
    props: {
        itemId: {
            type: String,
            required: true,
        },
        client: {
            type: String,
            default: null,
        },
        data: {
            type: Object,
            default: () => {},
        },
        showDelete: {
            type: Boolean,
            default: false,
        },
        count: {
            type: Number,
            default: 0,
        },
        showEditCount: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            source: "",
        };
    },
    computed: {
        final_client() {
            return this.client || this.$store.state.client;
        },
        cache_key() {
            return `item-${this.final_client}-${this.itemId}`;
        },
        iconLink() {
            return iconLink(this.item?.IconID, this.final_client);
        },
        item() {
            return this.data || this.source;
        },
    },
    watch: {
        itemId: {
            immediate: true,
            handler() {
                if (!this.data) {
                    this.loadData();
                }
            },
        },
    },
    methods: {
        onActionClick() {
            if (this.showDelete) {
                this.$emit("delete");
            } else if (this.showEditCount) {
                this.$emit("edit");
            }
        },
        loadData() {
            if (this.data) return;
            const _cache = sessionStorage.getItem(this.cache_key);
            if (_cache) {
                try {
                    this.source = JSON.parse(_cache);
                } catch (e) {}
            } else {
                getItemByResource(this.itemId, this.final_client).then((res) => {
                    let item = res.data;
                    let isValidItem = JSON.stringify(item) !== "{}";
                    if (isValidItem) {
                        this.source = item;
                        sessionStorage.setItem(this.cache_key, JSON.stringify(this.source));
                    } else {
                        this.source = "";
                    }
                });
            }
        },
    },
};
</script>

<style lang="less">
.w-mobile-item-card {
    overflow: hidden;
    display: flex;
    padding: 8px 12px;
    gap: 8px;

    border-radius: 8px;
    background: var(--primary-brand-4, #fff);
    .pr;

    .m-icon-section {
        display: flex;
        height: 44px;
        gap: 4px;
        flex-shrink: 0;

        .u-quality {
            width: 4px;
            height: 44px;
            border-radius: 100px;

            &.quality-1 {
                background-color: var(--secondary-mint);
            }
            &.quality-2 {
                background-color: var(--secondary-green);
            }
            &.quality-3 {
                background-color: var(--secondary-cyan);
            }
            &.quality-4 {
                background-color: var(--secondary-purple);
            }
            &.quality-5 {
                background-color: var(--secondary-orange);
            }
            &.quality-6 {
                background-color: var(--secondary-red);
            }
        }

        .u-icon {
            width: 44px;
            height: 44px;
            border-radius: 4px;
            background: #d9d9d9;
        }
    }

    .m-content-section {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .u-primary {
            display: flex;
            justify-content: space-between;
            align-content: center;
        }

        .u-name {
            color: var(--black-100, #1c1c1c);

            font-size: 14px;
            font-weight: 700;
            line-height: 20px;
        }

        .u-id {
            color: var(--black-40, rgba(28, 28, 28, 0.4));

            font-size: 12px;
            font-weight: 400;
            line-height: 18px;
        }

        .u-count {
            color: var(--black-100, #1c1c1c);

            /* 12 Bold */
            font-family: "Microsoft YaHei UI";
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px; /* 150% */
        }

        .u-secondary {
            color: var(--black-80, rgba(28, 28, 28, 0.8));

            font-family: "Microsoft YaHei UI";
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
        }
    }

    .m-actions-section {
        .pa;
        right: 0;
        top: 0;
        height: 100%;
        box-sizing: border-box;
        width: 60px;
        padding: 20px 14px;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .u-icon {
            .fz(18px);
        }

        &.is-delete {
            background: var(--secondary-red, #ff3b30);
        }

        &.is-edit-count {
            background: var(--secondary-green, #34c759);

            font-family: "Microsoft YaHei UI";
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px; /* 150% */
        }
    }
}
</style>
