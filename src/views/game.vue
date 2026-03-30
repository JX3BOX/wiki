<template>
    <GameLayout>
        <div class="m-wiki-view" v-if="wikiPost">
            <div class="m-warning" :class="{ none: !warning }">❌ 您的浏览器版本太低,将无法正常使用本应用</div>
            <!-- 公告 -->
            <Notice class="m-game-notice"></Notice>
            <!-- 机器人成就提示 -->
            <WikiRobotTip
                class="m-game-qqbot-tip"
                v-if="type === 'cj'"
                type-name="成就"
                :reply="wikiPost.source?.Name"
            ></WikiRobotTip>
            <!-- 百科 -->
            <WikiContent v-if="type !== 'price'" :wiki-post="wikiPost" :compatible="compatible" />
            <!-- 物品价格 -->
            <PriceTabs
                v-if="type == 'item' && wikiPost && wikiPost.source && wikiPost.source.BindType != 3"
                :source-id="source_id"
            />
            <!-- 单纯价格 -->
            <Price v-if="type === 'price'" :source-id="source_id"></Price>
            <template v-else>
                <!-- 历史版本 -->
                <WikiRevisions
                    v-if="wikiPost && wikiPost.post"
                    :type="source_type"
                    :source-id="source_id"
                    :isGame="true"
                />
                <!-- 评论 -->
                <WikiComments v-if="wikiPost && wikiPost.post" :type="source_type" :source-id="source_id" />
            </template>
        </div>
    </GameLayout>
</template>

<script>
import UA from "@/utils/ua";
import star from "@/utils/star";
import WikiContent from "@/components/wiki-content";
import WikiRevisions from "@/components/wiki-revisions.vue";
import WikiComments from "@/components/wiki-comments.vue";
// import Relations from "@/components/relations.vue";
import PriceTabs from "@/components/item/price-tabs.vue";
import Price from "@/components/item/price.vue";
import { wiki } from "@jx3box/jx3box-common/js/wiki.js";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { postStat } from "@jx3box/jx3box-common/js/stat";
import Notice from "@/components/cj/notice.vue";
import GameLayout from "@/layout/game-layout.vue";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";

export default {
    name: "Wiki",
    components: {
        WikiContent,
        WikiRevisions,
        WikiComments,
        // Relations,
        PriceTabs,
        GameLayout,
        Notice,
        Price,
        WikiRobotTip,
    },
    data() {
        return {
            ua: UA(),
            wikiPost: null,
            compatible: false,
            routeReady: false,

            source_id: "",
            source_type: "",
        };
    },
    provide: function () {
        return {
            client: this.client,
        };
    },
    computed: {
        client: function () {
            return this.$route.query.L == "classic_yq" ? "origin" : "std";
        },
        id() {
            return this.$route.query.id;
        },
        type() {
            return this.$route.query.type;
        },
        routeKey() {
            return `${this.type || ""}:${this.id || ""}`;
        },
        warning() {
            return this.ua.browser === "ie" && this.ua.version < 9;
        },
    },
    methods: {
        icon_url: iconLink,
        star,
        trackStat() {
            if (!this.type || !this.id) return;
            let type = this.type;
            if (type === "achievement") type = "cj";
            postStat(type, this.id);
        },
        loadWiki: function (source_type, source_id) {
            wiki.mix({ type: source_type, id: source_id, client: this.client })
                .then((res) => {
                    const { post, source, compatible, type, source_id, users } = res;
                    this.wikiPost = {
                        post,
                        source,
                        type,
                        source_id,
                        users,
                    };
                    this.compatible = compatible;
                    this.source_id = source_id;
                })
                .catch((err) => {
                    console.log(err, "err");
                });
        },
    },
    watch: {
        routeKey: {
            immediate: true,
            handler() {
                let source_type = "";
                // fix source_type
                if (this.type == "cj") {
                    this.source_type = source_type = "achievement";
                } else if (this.type == "pet" || this.type == "horse" || this.type == "price") {
                    this.source_type = "item";
                    source_type = this.type == "pet" ? "pet" : "item";
                } else {
                    this.source_type = source_type = this.type || "achievement";
                }

                // 获取最新攻略
                if (this.id) {
                    if (this.routeReady) {
                        this.trackStat();
                    } else {
                        this.routeReady = true;
                    }
                    this.loadWiki(source_type, this.id);
                } else {
                    this.routeReady = false;
                    this.wikiPost = null;
                    this.source_id = "";
                }
            },
        },
        "$route.query.post_id": {
            handler() {
                // 获取攻略
                if (this.$route.query.post_id) {
                    wiki.getById(this.$route.query.post_id).then((res) => {
                        res = res.data;
                        this.wikiPost = res.data;
                    });
                } else if (this.id) {
                    this.loadWiki(this.source_type || this.type || "achievement", this.id);
                }
            },
        },
    },
    created() {
        // 统计
        if (this.type && this.id) {
            let type = this.type;
            if (type === "achievement") type = "cj";
            postStat(type, this.id);
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/game/wiki.less";
</style>
