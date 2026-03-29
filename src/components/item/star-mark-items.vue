<template>
    <WikiPanel :border-none="true" class="m-search-hottest m-price-header">
        <template #head-title>
            <div class="u-title">
                <LegacyIcon class="el-icon-shopping-bag-1" />
                <span>交易走势</span>
            </div>
            <el-select v-model="server" class="u-server" placeholder="请选择服务器" size="small">
                <el-option v-for="serve in servers" :key="serve" :label="serve" :value="serve"></el-option>
            </el-select>
        </template>
        <template #head-actions>
            <el-input
                v-model="search"
                class="u-search"
                placeholder="搜索.."
                size="small"
                @keyup.enter="goItemPage"
            >
                <template #append>
                    <el-button icon="Search" @click="goItemPage"></el-button>
                </template>
            </el-input>
        </template>
        <template #body>
            <div class="m-index-price">
                <div v-if="groups && groups.length && isEmpty" class="m-price-list">
                    <el-row v-for="(group, key) in groups" :key="key" :gutter="20">
                        <div :span="24" class="u-group-title" v-text="group.label"></div>
                        <el-col v-for="(item, k) in group.items" :key="k" :span="6">
                            <router-link
                                v-if="item"
                                class="u-item"
                                :class="`u-item-${key}`"
                                :to="{ name: 'view', params: { item_id: item.item_id } }"
                            >
                                <div class="u-icon">
                                    <img :src="icon_url(item.icon)" />
                                </div>
                                <div class="u-content">
                                    <span class="u-name">
                                        <span v-text="item.label"></span>
                                    </span>
                                    <span class="u-price">
                                        <span class="u-trending" :class="showItemTrendingClass(item)">
                                            {{ showItemTrending(item) }}
                                        </span>
                                        <template v-if="item.sub_days_0_price">
                                            <span>今日：</span>
                                            <GamePrice :price="item.sub_days_0_price" />
                                        </template>
                                        <template v-else-if="!item.sub_days_0_price && item.sub_days_1_price">
                                            <span>昨日：</span>
                                            <GamePrice :price="item.sub_days_1_price" />
                                        </template>
                                        <template
                                            v-else-if="!item.sub_days_0_price && !item.sub_days_1_price && item.sub_days_2_price"
                                        >
                                            <span>前日：</span>
                                            <GamePrice :price="item.sub_days_2_price" />
                                        </template>
                                        <span v-else>暂无价目</span>
                                    </span>
                                </div>
                            </router-link>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "@/components/wiki-panel.vue";
import { get_item_groups_with_price } from "@/service/item-group";
import servers_origin from "@jx3box/jx3box-data/data/server/server_origin.json";
import servers_std from "@jx3box/jx3box-data/data/server/server_std.json";
import GamePrice from "@jx3box/jx3box-ui/src/wiki/GamePrice.vue";
import { getProfile } from "@/service/user";
import User from "@jx3box/jx3box-common/js/user";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "StarMarkItems",
    components: {
        WikiPanel,
        GamePrice,
    },
    data() {
        return {
            groups: [],
            server: "",
            loading: false,
            search: "",
        };
    },
    computed: {
        item_ids() {
            return this.$store.state.client == "origin"
                ? ["origin1", "origin2", "origin3"]
                : ["index1", "index2", "teshucailiao"];
        },
        servers() {
            return this.$store.state.client == "origin" ? servers_origin : servers_std;
        },
        client() {
            return this.$store.state.client;
        },
        isEmpty() {
            return this.groups.some((item) => item);
        },
    },
    methods: {
        get_data() {
            if (!this.server) return;

            this.loading = true;
            get_item_groups_with_price({
                server: this.server,
                keys: this.item_ids.join(","),
            })
                .then((data) => {
                    data = data.data;
                    this.groups = Object.values(data.data) || [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        goItemPage() {
            window.open(`${location.origin}/item/#/search/${this.search}?page=1`, "_blank");
        },
        icon_url(id) {
            return iconLink(id, this.client);
        },
        showItemTrending(item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) return "▲";
                if (item.sub_days_0_price - item.sub_days_1_price < 0) return "▼";
            }
            return "";
        },
        showItemTrendingClass(item) {
            if (item.sub_days_0_price && item.sub_days_1_price) {
                if (item.sub_days_0_price - item.sub_days_1_price > 0) return "up";
                if (item.sub_days_0_price - item.sub_days_1_price < 0) return "down";
                return "keep";
            }
            return "";
        },
    },
    watch: {
        server: {
            immediate: true,
            handler() {
                this.get_data();
            },
        },
    },
    mounted() {
        if (User.isLogin() && this.$store.state.client == "std") {
            getProfile().then((data) => {
                if (data) {
                    this.server = data.jx3_server || "斗转星移";
                }
            });
        } else {
            this.server = this.$store.state.client == "origin" ? "缘起稻香" : "斗转星移";
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/price-slider.less";
</style>
