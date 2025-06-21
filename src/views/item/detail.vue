<template>
    <div id="m-item-view">
        <div class="m-item-detail" v-if="isRobot">
            <div class="m-item-header">
                <div class="m-item-header__left">
                    <div class="u-top">
                        <item-icon :size="20" :item="source" :dishoverable="true" />
                        <div
                            class="u-name"
                            :class="{ white: source.Quality == 1 }"
                            v-text="source.Name"
                            :style="{
                                color: source.Quality ? item_color(source.Quality) : '#808080',
                            }"
                        ></div>
                        <template v-if="source.MaxStrengthLevel">
                            <img
                                src="@/assets/img/star.svg"
                                class="u-star"
                                v-for="i in source.MaxStrengthLevel"
                                :key="i"
                            />
                        </template>
                    </div>
                    <div class="u-bottom">
                        <!-- 装备类型 -->
                        <div class="u-usage" v-if="show_equip_usage">
                            <template v-if="source.EquipUsage == 1">
                                <img class="u-label-icon" src="@/assets/img/pve.png" alt="" />
                                <span>秘境挑战(PVE)</span>
                            </template>
                            <template v-if="source.EquipUsage == 2">
                                <img class="u-label-icon" src="@/assets/img/pvp.png" alt="" />
                                <span>竞技对抗(PVP)</span>
                            </template>
                            <template v-if="source.EquipUsage == 3">
                                <img class="u-label-icon" src="@/assets/img/pvx.png" alt="" />
                                <span>休闲(PVX)</span>
                            </template>
                        </div>

                        <div v-if="source.AucGenre == 1" class="u-weapon-type-label">武器</div>
                        <div v-if="source.AucGenre == 2" class="u-weapon-type-label">暗器</div>
                        <!-- 物品类型文案 -->
                        <div v-if="source.TypeLabel" class="u-type-label" v-text="source.TypeLabel"></div>
                        <span class="u-from" v-if="source.GetType">获得途径: {{ source.GetType }}</span>
                    </div>
                </div>
                <img src="@/assets/img/item_robot.svg" class="u-item-img__right" />
            </div>
            <div class="m-item-content">
                <div class="u-line">
                    <div v-if="source.Level" class="u-level u-yellow" v-text="'品质等级' + source.Level"></div>
                    <div
                        v-if="Number(source.EquipmentRating)"
                        class="u-equipment-rating u-orange"
                        v-text="'装备分数' + source.EquipmentRating"
                    ></div>
                </div>
                <div class="u-line">
                    <!-- 需要等级 -->
                    <div
                        v-if="source.Requires && source.Requires[5]"
                        class="u-require-level"
                        v-text="source.Requires[5]"
                    ></div>
                    <div
                        v-if="source.Recommend"
                        class="u-equipment-recommend"
                        v-text="'推荐门派：' + source.Recommend"
                    ></div>
                </div>

                <!-- 装备属性 -->
                <div class="m-attributes" v-if="source.attributes && source.attributes.length">
                    <!-- 白色 -->
                    <div
                        class="u-attributes"
                        v-if="source.attributes && source.attributes.length && white_attributes.length"
                    >
                        <div
                            v-for="(attribute, key) in white_attributes"
                            :key="key"
                            class="u-field"
                            :class="[`u-${attribute.color}`]"
                        >
                            <span
                                v-if="
                                    attribute.type == 'atMeleeWeaponAttackSpeedBase' ||
                                    attribute.type == 'atRangeWeaponAttackSpeedBase'
                                "
                                class="u-value u-speed"
                                v-text="attribute.label"
                            ></span>
                            <span v-else-if="attribute.type == 'atHorseAttribute'" class="u-value u-horse-attribute">
                                <div class="u-horse-desc" v-html="attribute.label"></div>
                            </span>
                            <span v-else class="u-value">
                                <game-text :text="attribute.label"></game-text>
                            </span>
                        </div>
                    </div>
                    <!-- 绿色 -->
                    <div
                        class="u-attributes"
                        v-if="source.attributes && source.attributes.length && green_attributes.length"
                    >
                        <div
                            v-for="(attribute, key) in green_attributes"
                            :key="key"
                            class="u-field"
                            :class="[`u-${attribute.color}`]"
                        >
                            <span
                                v-if="
                                    attribute.type == 'atMeleeWeaponAttackSpeedBase' ||
                                    attribute.type == 'atRangeWeaponAttackSpeedBase'
                                "
                                class="u-value u-speed"
                                v-text="attribute.label"
                            ></span>
                            <span v-else-if="attribute.type == 'atHorseAttribute'" class="u-value u-horse-attribute">
                                <img
                                    v-if="attribute.icon_id > 0"
                                    class="u-horse-icon"
                                    :src="iconLink(attribute.icon_id)"
                                />
                                <div class="u-horse-desc" v-html="attribute.label"></div>
                            </span>
                            <span v-else class="u-value">
                                <game-text :text="attribute.label"></game-text>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="m-spec-wrapper">
                    <div class="m-client-spec" v-if="orange_std_attribute.length > 0">
                        <div class="u-spec-attribute-title u-yellow">
                            <span>特殊属性效果 - <span class="u-client">旗舰</span></span>
                        </div>
                        <div
                            class="u-value u-spec-attribute"
                            v-for="(attribute, key) in orange_std_attribute"
                            :key="key"
                        >
                            <game-text :text="attribute.label"></game-text>
                        </div>
                    </div>
                    <div class="m-client-spec" v-if="orange_wujie_attribute.length > 0">
                        <div class="u-spec-attribute-title u-yellow">
                            <span>特殊属性效果 - <span class="u-client">无界</span></span>
                        </div>
                        <div
                            class="u-value u-spec-attribute"
                            v-for="(attribute, key) in orange_wujie_attribute"
                            :key="key"
                        >
                            <game-text :text="attribute.label"></game-text>
                        </div>
                        <div class="u-value u-spec-attribute u-orange">属性效果双端一致</div>
                    </div>
                </div>

                <!-- 套装信息 -->
                <div v-if="source.Set" class="u-set">
                    <div
                        class="u-yellow u-set-title"
                        v-html="`套装属性效果-<span>${source.Set.name}(1/${source.Set.siblings.length})</span>`"
                    ></div>
                    <ul class="u-set-siblings u-gray">
                        <li
                            v-for="(sibling, key) in source.Set.siblings"
                            :key="key"
                            :class="{
                                'u-yellow': sibling && (sibling == source.Name || sibling.includes(source.Name)),
                            }"
                        >
                            {{
                                sibling
                                    .split("/")
                                    .map((s) => s.trim())
                                    .sort((a, b) => a.localeCompare(b))
                                    .join(" / ")
                            }}
                        </li>
                    </ul>
                    <ul class="u-set-attributes u-orange">
                        <li v-for="(attribute, key) in source.Set.attributes" :key="key">
                            <span>{{ `[${key}]` }}</span>
                            <game-text :client="client" :text="attribute" :ignore-color="true"></game-text>
                        </li>
                    </ul>
                </div>

                <!-- 描述 -->
                <p v-if="source.Desc" class="u-desc">
                    <game-text :client="client" :text="source.Desc"></game-text>
                </p>
            </div>
        </div>
        <template v-if="!isRobot">
            <div v-if="source" class="w-item">
                <div class="m-item-viewer">
                    <div class="w-left">
                        <jx3-item :item_id="source.id" />
                    </div>
                    <div class="w-right">
                        <div class="m-name">
                            <div class="u-title">
                                <item-icon :item="source" :dishoverable="true" />
                                <h6
                                    class="u-name"
                                    :class="{ white: source.Quality == 1 }"
                                    v-text="source.Name"
                                    :style="{
                                        color: item_color(source.Quality),
                                    }"
                                ></h6>
                            </div>

                            <div class="m-buttons fr">
                                <!-- 加入清单 -->
                                <Plan class="u-plan" :itemId="id" />
                                <!-- 收藏按钮 -->
                                <Fav
                                    ref="fav"
                                    class="u-collect"
                                    post-type="item"
                                    :post-id="source.id"
                                    :post-title="fav_title"
                                />
                            </div>
                        </div>
                        <!-- 原料 -->
                        <div class="m-item-required" v-if="requiredList.length">
                            <span class="u-label">制作原料</span>
                            <router-link
                                class="u-item"
                                v-for="item in requiredList"
                                :key="item.ID"
                                target="_blank"
                                :to="`/view/5_${item.ID}`"
                            >
                                <img class="u-icon" :src="iconLink(item)" :alt="item.Name" :title="item.Name" />
                                <span class="u-count">{{ item._count }}</span>
                            </router-link>
                        </div>
                        <!-- 其余属性 -->
                        <ul class="m-other-fields">
                            <li class="m-other-field">
                                <span class="u-label">拾取绑定</span>
                                <span class="u-value">{{ item_bind(source.BindType) }}</span>
                            </li>
                            <li class="m-other-field">
                                <span class="u-label">可否交易</span>
                                <span class="u-value">{{ source.CanTrade ? "✔️ 可以" : "❌ 不可以" }}</span>
                            </li>
                            <li>
                                <span class="u-label">回购价格</span>
                                <GamePrice class="u-value" :price="source.Price" v-if="source.Price" />
                                <span class="u-value" v-else>-</span>
                            </li>
                            <!-- <li v-if="source.Level">
							<span class="u-label">品质等级</span>
							<span class="u-value" v-text="source.Level"></span>
						</li> -->
                            <!-- <li class="m-other-field">
							<span class="u-label">品质</span>
							<span class="u-value" v-html="`<span style='color:${item_color(source.Quality)}'>${item_quality(source.Quality)}</span>`"></span>
						</li> -->

                            <li class="m-other-field">
                                <span class="u-label">可否堆叠</span>
                                <span class="u-value">{{ source.CanStack ? "✔️ 可以" : "❌ 不可以" }}</span>
                            </li>
                            <li v-if="source.MaxExistAmount > 0">
                                <span class="u-label">最大拥有数</span>
                                <span class="u-value">{{ source.MaxExistAmount }}</span>
                            </li>
                            <li v-if="source.MaxExistTime > 0">
                                <span class="u-label">限时有效</span>
                                <span class="u-value">{{ showDuration(source.MaxExistTime) }}</span>
                            </li>

                            <!-- <li v-if="source.BelongSchool">
							<span class="u-label">门派</span>
							<span class="u-value">{{source.BelongSchool}}</span>
						</li>
						<li v-if="source.MagicKind">
							<span class="u-label">心法</span>
							<span class="u-value">{{source.MagicKind}}</span>
						</li>
						<li v-if="source.MagicType">
							<span class="u-label">属性</span>
							<span class="u-value">{{source.MagicType}}</span>
						</li> -->
                            <li v-if="source.GetType">
                                <span class="u-label">获得途径</span>
                                <span class="u-value">{{ source.GetType }}</span>
                            </li>
                            <li v-if="source.CanChangeMagic">
                                <span class="u-label">可否附魔</span>
                                <span class="u-value">✔️ 可以</span>
                            </li>
                            <li v-if="source.CanExterior">
                                <span class="u-label">可否收集</span>
                                <span class="u-value">✔️ 可以</span>
                            </li>
                            <li v-if="source.CanSetColor">
                                <span class="u-label">可否染色</span>
                                <span class="u-value">✔️ 可以</span>
                            </li>
                            <li class="m-other-field">
                                <span class="u-label">可否分解</span>
                                <span class="u-value">{{ source.CanApart ? "✔️ 可以" : "❌ 不可以" }}</span>
                            </li>
                            <li class="m-other-field">
                                <span class="u-label">可否摧毁</span>
                                <span class="u-value">{{
                                    source.CanDestroy || source.CanDestroy === null ? "✔️ 可以" : "❌ 不可以"
                                }}</span>
                            </li>
                            <!-- <li v-if="source.CanShared">
							<span class="u-label">可否分享</span>
							<span class="u-value" v-text="'可以分享'"></span>
						</li> -->

                            <!-- <li v-if="source.Requires && source.Requires[100]">
							<span class="u-value" v-text="source.Requires[100]"></span>
						</li> -->
                            <!--<li v-if="source.Require1Type">
                            <label class="u-title" v-text="item_require_1_type(source.Require1Type) + '：'"></label>
                            <span class="u-value" v-text="source.Require1Value"></span>
                        </li>-->

                            <!-- <li v-if="source.AucGenre >= 1 && source.AucGenre <= 3">
							<span class="u-label">耐久度</span>
							<span class="u-value" v-text="`${source.MaxDurability}/${source.MaxDurability}`"></span>
						</li> -->
                            <!--<li class="m-field">
                            <label class="u-title">磨损率：</label>
                            <span class="u-value" v-text="source.AbradeRate"></span>
                        </li>-->
                            <!--<li class="m-other-field">
                            <label class="u-title">修理费：</label>
                            <span class="u-value" v-text="source.RepairPriceRebate"></span>
                        </li>-->

                            <!-- <li v-if="source.CanConsume">
							<span class="u-label">消耗品</span>
							<span class="u-value" v-text="'是'"></span>
						</li> -->
                        </ul>
                    </div>
                </div>
            </div>

            <div class="m-tabs" v-if="showPrice">
                <div class="m-price-server">
                    <i class="el-icon-s-shop"></i> 全服价格
                    <el-select
                        v-if="activeTab === 'item-price-chart' || activeTab === 'item-prices'"
                        filterable
                        class="u-server"
                        v-model="server"
                        placeholder="请选择服务器"
                        size="mini"
                    >
                        <el-option v-for="(serve, i) in servers" :key="i" :label="serve" :value="serve"></el-option>
                    </el-select>
                </div>

                <el-tabs v-model="activeTab" type="border-card" @tab-click="active_tab_handle" v-loading="loading">
                    <el-tab-pane label="📈 价格波动" name="item-price-chart" v-if="source && source.BindType != 3">
                        <item-price-chart ref="item_price_chart" :item_id="source.id" :server="server" />
                    </el-tab-pane>
                    <el-tab-pane label="💰 近期价格" name="item-prices" v-if="source && source.BindType != 3" lazy>
                        <item-prices ref="item_prices" :item_id="source.id" :server="server" />
                    </el-tab-pane>
                    <!-- <el-tab-pane label="📜 相关物品清单" name="relation-plans" lazy>
                    <relation-plans :item_id="source.id" />
                </el-tab-pane> -->
                </el-tabs>
            </div>

            <Notice></Notice>
        </template>

        <div class="m-wiki-post-panel" :class="{ 'is-robot': isRobot }" v-if="wiki_post && wiki_post.post">
            <WikiRobotTip type-name="物品" :reply="source?.Name"></WikiRobotTip>
            <WikiPanel :wiki-post="wiki_post" ref="wikiPanel">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="@/assets/img/item.svg" />
                    <span class="u-txt">物品攻略</span>
                </template>
                <template slot="head-actions">
                    <a class="el-button el-button--primary" :href="publish_url(`item/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善物品攻略</span>
                    </a>
                </template>
                <template slot="body">
                    <div class="m-wiki-compatible" v-if="compatible">
                        <i class="el-icon-warning-outline"></i> 暂无缘起攻略，以下为重制攻略，仅作参考，<a
                            class="s-link"
                            :href="publish_url(`item/${id}`)"
                            >参与修订</a
                        >。
                    </div>
                    <Article :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <i class="el-icon-edit"></i>
                        本次修订由 <b>{{ user_name }}</b> 提交于{{ updated_at }}
                    </div>
                </template>
            </WikiPanel>
            <template v-if="!isRobot">
                <!-- 历史版本 -->
                <WikiRevisions type="item" :source-id="id" />

                <!-- 打赏 -->
                <div class="m-wiki-thx-panel">
                    <WikiPanel>
                        <template slot="head-title">
                            <i class="el-icon-coin"></i>
                            <span class="u-txt">参与打赏</span>
                        </template>
                        <template slot="body">
                            <Thx
                                class="m-thx"
                                :postId="id"
                                postType="item"
                                :postTitle="source.Name"
                                :userId="author_id"
                                :adminBoxcoinEnable="true"
                                :userBoxcoinEnable="true"
                                :authors="authors"
                                mode="wiki"
                                :key="'item-thx-' + id"
                                :client="client"
                                showRss
                            />
                        </template>
                    </WikiPanel>
                </div>

                <!-- 百科评论 -->
                <WikiComments type="item" :source-id="id" />
            </template>
        </div>
        <div class="m-wiki-post-empty" :class="isRobot ? 'is-robot-empty' : ''" v-else>
            <template v-if="!isRobot">
                <i class="el-icon-s-opportunity"></i>
                <span>暂无攻略，我要</span>
                <a class="s-link" :href="publish_url(`item/${id}`)">完善攻略</a>
            </template>
            <span v-else>暂无相关攻略，欢迎热心侠士前往补充！</span>
        </div>
        <wiki-robot-bottom v-if="isRobot" type="item" :id="id"></wiki-robot-bottom>
    </div>
</template>

<script>
import Article from "@jx3box/jx3box-editor/src/Article.vue";
// import Fav from "@jx3box/jx3box-common-ui/src/interact/Fav.vue";
import Fav from "./item-fav";
import Item from "@jx3box/jx3box-editor/src/Item.vue";
import GameText from "@jx3box/jx3box-editor/src/GameText.vue";
import ItemIcon from "@/components/common/item-icon.vue";
import Plan from "@/components/item/plan.vue";
import WikiPanel from "@/components/wiki-panel.vue";
import WikiRevisions from "@/components/wiki-revisions.vue";
import WikiComments from "@/components/wiki-comments.vue";
import ItemPrices from "@/components/item/item-prices.vue";
import ItemPriceChart from "@/components/item/item-price-chart.vue";
import GamePrice from "@jx3box/jx3box-common-ui/src/wiki/GamePrice.vue";
import User from "@jx3box/jx3box-common/js/user";
import Notice from "@/components/cj/notice.vue";
import wikiRobotBottom from "@/components/common/wiki-robot-bottom.vue";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";

import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2.js";
import { __Links } from "@jx3box/jx3box-common/data/jx3box.json";
import std_servers from "@jx3box/jx3box-data/data/server/server_std.json";
import origin_servers from "@jx3box/jx3box-data/data/server/server_origin.json";
import { item_color, item_quality, item_price, item_bind } from "@/filters";
import { publishLink, ts2str, showAvatar, iconLink } from "@jx3box/jx3box-common/js/utils";
import { getManufactureDetail, getItemDetail } from "@/service/item";
import { getMyInfo } from "@/service/user";
import { get_item, show_item_prices } from "@/service/item";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const DEFAULT_ACTIVE_TAB = "item-price-chart";
import bus from "@/store/bus";

export default {
    name: "Detail",
    props: {
        sourceId: {
            type: [String, Number],
            default: "",
        },
        isRobot: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            source: {},
            wiki_post: {
                source: {},
                post: null,
            },
            compatible: false,
            is_empty: true,

            server: "",
            activeTab: DEFAULT_ACTIVE_TAB,
            loading: false,
            requiredList: [], // 原料列表
            showPrice: false,
        };
    },
    computed: {
        id: function () {
            return this.$route.params.item_id || this.sourceId;
        },
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post?.post?.user_id;
        },
        servers: function () {
            return this.$store.state.client == "origin" ? origin_servers : std_servers;
        },
        isStdClient: function () {
            return this.$store.state.client == "std";
        },
        client: function () {
            return this.$store.state.client;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
        },
        auc: function () {
            return `${this.wiki_post?.source?.AucGenre}_${this.wiki_post?.source?.AucSubType}`;
        },
        fav_title: function () {
            return this.wiki_post?.source?.Name;
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.wiki_post?.users
                        ?.filter((user) => user.id)
                        ?.map((user) => {
                            return {
                                user_id: user.id,
                                user_avatar: user.avatar,
                                display_name: user.nickname,
                            };
                        }) || []
                );
            }
            return [];
        },
        firstServer: function () {
            for (let i of this.servers || []) {
                return i;
            }
            return "";
        },
        // favList() {
        //     return this.$store.state.myFavorites;
        // },
        // 是否展示装备类型
        show_equip_usage() {
            if (Number(this.source?.AucGenre) === 1 && this.source.Quality > 4) return false;
            if ([1, 2, 3].includes(Number(this.source?.AucGenre))) return true;
            if (this.source?.AucGenre == 4 && this.source?.AucSubType < 4) return true;
            return false;
        },
        common_attributes() {
            return this.source?.attributes?.filter((item) => item.color != "orange") || [];
        },
        white_attributes() {
            return this.common_attributes.filter((item) => item.color === "white") || [];
        },
        green_attributes() {
            return this.common_attributes.filter((item) => item.color === "green") || [];
        },
        orange_std_attribute() {
            return this.source?.attributes?.filter((item) => item.color == "orange" && !item.is_mobile) || [];
        },
        orange_wujie_attribute() {
            return this.source?.attributes?.filter((item) => item.color == "orange" && item.is_mobile) || [];
        },
    },
    components: {
        "jx3-item": Item,
        ItemIcon,
        WikiPanel,
        WikiRevisions,
        WikiComments,
        Article,
        Fav,
        Plan,
        "item-prices": ItemPrices,
        "item-price-chart": ItemPriceChart,
        GamePrice,
        Notice,
        wikiRobotBottom,
        GameText,
        WikiRobotTip,
    },
    methods: {
        get_data() {
            const item_id = this.source.id;
            if (item_id) {
                show_item_prices(item_id, {
                    server: this.server,
                    limit: 15,
                }).then((data) => {
                    data = data.data;
                    const prices = data.data?.prices.sort((a, b) => a.created + b.created) || [];
                    this.showPrice = !!prices.length;
                });
            }
        },
        active_tab_handle(tab) {
            if (tab.name === "item-price-chart") {
                this.$nextTick(() => {
                    this.$refs.item_price_chart?.render();
                });
            }
        },
        go_to_comment() {
            let target = document.querySelector("#m-reply-form");
            target.scrollIntoView(true);
        },
        publish_url: publishLink,
        item_color,
        item_quality,
        item_price,
        item_bind,
        ts2str,
        iconLink(item) {
            return iconLink(item.item_info?.[0]?.IconID || item.item_info?.IconID);
        },
        showAvatar: function (url) {
            return showAvatar(url, 32);
        },
        loadData: async function () {
            // 获取最新攻略
            if (this.id) {
                await get_item(this.id, this.client).then((res) => {
                    // console.log(res, "res");
                    this.source = res?.data?.data?.item;
                });
                await wiki.mix({ type: "item", id: this.id, client: this.client }).then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;

                    User.isLogin() &&
                        postHistory({
                            source_type: this.client == "origin" ? "origin_item" : "item",
                            source_id: ~~this.id,
                            link: location.href,
                            title: post.title,
                        });
                });
                window.__READY__ = true;
            }
            this.triggerStat();
        },
        loadRevision: function () {
            // 获取指定攻略
            wiki.getById(this.post_id, { type: "item" }).then((res) => {
                this.wiki_post = res.data.data?.post;
            });
            this.triggerStat();
        },
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_item", this.id);
            } else {
                postStat("item", this.id);
            }
        },
        loadItemDetail: function () {
            if (this.wiki_post?.source?.UiID) {
                getManufactureDetail({ sourceId: this.wiki_post?.source?.SourceID, client: this.client }).then(
                    (res) => {
                        const data = res?.data?.find(
                            (item) => item.CreateItemIndex1 === this.wiki_post?.source?.SourceID
                        );

                        if (!data) return;

                        let counts = [];
                        let itemIds = [];

                        if (data) {
                            for (const key in data) {
                                if (key.startsWith("RequireItemCount") && data[key]) {
                                    counts.push(data[key]);
                                }

                                if (key.startsWith("RequireItemIndex") && data[key]) {
                                    itemIds.push(data[key]);
                                }
                            }
                        }

                        getItemDetail({ ids: itemIds.join(","), per: 10, client: this.client }).then((itemRes) => {
                            this.requiredList = itemRes?.data?.list?.map((item, i) => {
                                return {
                                    ...item,
                                    _count: counts[i],
                                };
                            });
                        });
                    }
                );
            }
        },
        showDuration: function (val) {
            val = Number(val);
            return val && dayjs.duration(val).asDays().toFixed(0) + "天";
        },
        loadUserDefaultServer() {
            User.isLogin() &&
                getMyInfo().then((data) => {
                    let userServer = data?.jx3_server;
                    this.$nextTick(() => {
                        if (userServer && this.servers.includes(userServer)) {
                            this.server = userServer;
                        } else {
                            this.server = this.firstServer;
                        }
                        this.$refs.item_price_chart?.render();
                    });
                });
        },
    },
    watch: {
        id: {
            handler() {
                this.loadData();
            },
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
        source: {
            immediate: true,
            deep: true,
            handler() {
                let item = this.source;
                if (!this.isRobot) {
                    this.activeTab = item && item.BindType != 3 ? DEFAULT_ACTIVE_TAB : "relation-plans";
                }
                if (this.$store.state.sidebar) {
                    this.$store.state.sidebar.AucGenre = Number(item.AucGenre);
                    this.$store.state.sidebar.AucSubTypeID = Number(item.AucSubType);
                }

                this.get_data();
                this.loadItemDetail();
            },
        },
        // favList: {
        //     deep: true,
        //     handler(list) {
        //         if (!list.find((item) => item.id === this.source.id)) {
        //             this.$refs.fav.favorite = false;
        //         }
        //     },
        // },
    },
    mounted: function () {
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }
        this.loadUserDefaultServer();
        bus.on("openWikiPush", (param) => {
            if (!this.wiki_post?.post?.id) {
                return this.$message.warning("该物品没有攻略");
            }
            this.$refs.wikiPanel?.onPush();
        });
    },
    created() {
        if (this.$store.state.client == "origin") {
            this.server = "缘起稻香";
        } else {
            if (!this.server) {
                this.server = "梦江南";
            }
        }
        if (sessionStorage.getItem("server_name")) {
            this.server = sessionStorage.getItem("server_name");
            sessionStorage.removeItem("server_name");
        }
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/detail.less";
</style>

<style lang="less" scoped>
.u-plan {
    margin-right: 10px;
}

.m-name {
    .flex;
    justify-content: space-between;

    .u-title {
        .flex;
        align-items: center;
    }
}
</style>
