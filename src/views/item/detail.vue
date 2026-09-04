<template>
    <div id="m-item-view" v-loading="loading">
        <AsyncState :loading="loading" :error="loadError" @retry="syncWikiData" />
        <div class="m-item-detail" v-if="isRobot && !loadError">
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
                        <span class="u-id">(ID: {{ source.id }})</span>
                        <template v-if="source.MaxStrengthLevel">
                            <img
                                src="@/assets/img/item/star.svg"
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
                                <img class="u-label-icon" src="@/assets/img/item/pve.png" alt="" />
                                <span>{{ $t("ui.item.detail.pve") }}</span>
                            </template>
                            <template v-if="source.EquipUsage == 2">
                                <img class="u-label-icon" src="@/assets/img/item/pvp.png" alt="" />
                                <span>{{ $t("ui.item.detail.pvp") }}</span>
                            </template>
                            <template v-if="source.EquipUsage == 3">
                                <img class="u-label-icon" src="@/assets/img/item/pvx.png" alt="" />
                                <span>{{ $t("ui.item.detail.pvx") }}</span>
                            </template>
                        </div>

                        <div v-if="source.AucGenre == 1" class="u-weapon-type-label">{{ $t("ui.item.detail.weapon") }}</div>
                        <div v-if="source.AucGenre == 2" class="u-weapon-type-label">{{ $t("ui.item.detail.rangedWeapon") }}</div>
                        <!-- 物品类型文案 -->
                        <div v-if="source.TypeLabel" class="u-type-label" v-text="source.TypeLabel"></div>
                        <span class="u-from" v-if="source.GetType">{{ $t("ui.item.detail.source") }} {{ source.GetType }}</span>
                    </div>
                </div>
                <img src="@/assets/img/item/item_robot.svg" class="u-item-img__right" />
            </div>
            <div class="m-item-content">
                <div class="u-line">
                    <div v-if="source.Level" class="u-level u-yellow">{{ $t("ui.item.detail.qualityLevel") }}{{ source.Level }}</div>
                    <div
                        v-if="Number(source.EquipmentRating)"
                        class="u-equipment-rating u-orange"
                    >{{ $t("ui.item.detail.equipmentScore") }}{{ source.EquipmentRating }}</div>
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
                    >{{ $t("ui.item.detail.recommendedSchool") }}{{ source.Recommend }}</div>
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
                            <span>{{ $t("ui.item.detail.specialEffect") }} <span class="u-client">{{ $t("ui.item.detail.flagship") }}</span></span>
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
                            <span>{{ $t("ui.item.detail.specialEffect") }} <span class="u-client">{{ $t("ui.item.detail.mobile") }}</span></span>
                        </div>
                        <div
                            class="u-value u-spec-attribute"
                            v-for="(attribute, key) in orange_wujie_attribute"
                            :key="key"
                        >
                            <game-text :text="attribute.label"></game-text>
                        </div>
                        <div class="u-value u-spec-attribute u-orange">{{ $t("ui.item.detail.sameEffect") }}</div>
                    </div>
                </div>

                <!-- 套装信息 -->
                <div v-if="source.Set" class="u-set">
                    <div
                        class="u-yellow u-set-title"
                        v-html="`${$t('ui.item.detail.setEffects')}-<span>${source.Set.name}(1/${source.Set.siblings.length})</span>`"
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
                                    ?.sort((a, b) => a.localeCompare(b))
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

                <!-- 五彩石属性 -->
                <div class="m-attributes m-wucai-attributes" v-if="source.WuCaiHtml" v-html="source.WuCaiHtml"></div>
            </div>
        </div>
        <template v-if="!isRobot && !loadError">
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
                            <span class="u-label">{{ $t("ui.item.detail.materials") }}</span>
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
                                <span class="u-label">{{ $t("ui.item.detail.bindOnPickup") }}</span>
                                <span class="u-value">{{ itemBindLabel(source.BindType) }}</span>
                            </li>
                            <li class="m-other-field">
                                <span class="u-label">{{ $t("ui.item.detail.tradeable") }}</span>
                                <span class="u-value">{{
                                    [1, 2].includes(source.BindType) ? $t("ui.item.detail.yes") : $t("ui.item.detail.no")
                                }}</span>
                            </li>
                            <li>
                                <span class="u-label">{{ $t("ui.item.detail.buybackPrice") }}</span>
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
                                <span class="u-label">{{ $t("ui.item.detail.stackable") }}</span>
                                <span class="u-value">{{ source.CanStack ? $t("ui.item.detail.yes") : $t("ui.item.detail.no") }}</span>
                            </li>
                            <li v-if="source.MaxExistAmount > 0">
                                <span class="u-label">{{ $t("ui.item.detail.maxCount") }}</span>
                                <span class="u-value">{{ source.MaxExistAmount }}</span>
                            </li>
                            <li v-if="source.MaxExistTime > 0">
                                <span class="u-label">{{ $t("ui.item.detail.expires") }}</span>
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
                                <span class="u-label">{{ $t("ui.item.detail.obtainable") }}</span>
                                <span class="u-value">{{ source.GetType }}</span>
                            </li>
                            <li v-if="source.CanChangeMagic">
                                <span class="u-label">{{ $t("ui.item.detail.enchantable") }}</span>
                                <span class="u-value">{{ $t("ui.item.detail.yes") }}</span>
                            </li>
                            <li v-if="source.CanExterior">
                                <span class="u-label">{{ $t("ui.item.detail.collectable") }}</span>
                                <span class="u-value">{{ $t("ui.item.detail.yes") }}</span>
                            </li>
                            <li v-if="source.CanSetColor">
                                <span class="u-label">{{ $t("ui.item.detail.dyeable") }}</span>
                                <span class="u-value">{{ $t("ui.item.detail.yes") }}</span>
                            </li>
                            <li class="m-other-field">
                                <span class="u-label">{{ $t("ui.item.detail.decomposable") }}</span>
                                <span class="u-value">{{ source.CanApart ? $t("ui.item.detail.yes") : $t("ui.item.detail.no") }}</span>
                            </li>
                            <li class="m-other-field">
                                <span class="u-label">{{ $t("ui.item.detail.destroyable") }}</span>
                                <span class="u-value">{{
                                    source.CanDestroy || source.CanDestroy === null ? $t("ui.item.detail.yes") : $t("ui.item.detail.no")
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
                    <LegacyIcon class="el-icon-s-shop" /> {{ $t("ui.item.allServerPrices") }}
                    <el-select
                        v-if="activeTab === 'item-price-chart' || activeTab === 'item-prices'"
                        filterable
                        class="u-server"
                        v-model="server"
                        :placeholder="$t('ui.common.placeholders.server')"
                        size="small"
                    >
                        <el-option v-for="(serve, i) in servers" :key="i" :label="serve" :value="serve"></el-option>
                    </el-select>
                </div>

                <el-tabs v-model="activeTab" type="border-card" @tab-click="active_tab_handle" v-loading="loading">
                    <el-tab-pane :label="$t('ui.item.priceTrend')" name="item-price-chart" v-if="source && source.BindType != 3">
                        <item-price-chart ref="item_price_chart" :item_id="source.id" :server="server" />
                    </el-tab-pane>
                    <el-tab-pane :label="$t('ui.item.recentPrices')" name="item-prices" v-if="source && source.BindType != 3" lazy>
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
            <WikiRobotTip v-if="!isRobot" :type-name="$t('ui.types.item')" :reply="source?.Name"></WikiRobotTip>
            <WikiPanel :wiki-post="wiki_post" ref="wikiPanel">
                <template #head-title>
                    <img class="u-icon" svg-inline src="@/assets/img/item/item.svg" />
                    <span class="u-txt">{{ $t("ui.common.wiki.guideTitle", { type: $t("ui.types.item") }) }}</span>
                </template>
                <template #head-actions>
                    <a
                        class="u-btn--link el-button el-button--primary u-wiki-action"
                        :href="publish_url(`item/${id}`)"
                        :aria-label="$t('ui.common.actions.improve')"
                        :title="$t('ui.common.actions.improve')"
                    >
                        <LegacyIcon class="el-icon-edit" aria-hidden="true" />
                        <span class="u-wiki-action-label">{{ $t("ui.common.actions.improve") }}</span>
                    </a>
                </template>
                <template #body>
                    <div class="m-wiki-compatible" v-if="compatible">
                        <LegacyIcon class="el-icon-warning-outline" /> {{ $t("ui.common.wiki.originFallback") }}<a
                            class="s-link"
                            :href="publish_url(`item/${id}`)"
                            >{{ $t("ui.common.wiki.joinRevision") }}</a
                        >。
                    </div>
                    <Article id="wikiArticle" :content="wiki_post.post.content" />
                    <div class="m-wiki-signature">
                        <LegacyIcon class="el-icon-edit" />
                        {{ $t("ui.common.wiki.revisionBy") }} <b>{{ user_name }}</b> {{ $t("ui.common.wiki.submittedAt") }}{{ updated_at }}
                    </div>
                </template>
            </WikiPanel>
            <template v-if="!isRobot">
                <!-- 历史版本 -->
                <WikiRevisions type="item" :source-id="id" />

                <!-- 打赏 -->
                <div class="m-wiki-thx-panel">
                    <WikiPanel>
                        <template #head-title>
                            <LegacyIcon class="u-icon el-icon-coin" />
                            <span class="u-txt">{{ $t("ui.common.wiki.reward") }}</span>
                        </template>
                        <template #body>
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
                                category="item"
                            />
                        </template>
                    </WikiPanel>
                </div>

                <!-- 百科评论 -->
                <WikiComments type="item" :source-id="id" />
            </template>
        </div>
        <div class="m-wiki-post-empty" :class="isRobot ? 'is-robot-empty' : ''" v-else-if="!loading && !loadError">
            <template v-if="!isRobot">
                <LegacyIcon class="el-icon-s-opportunity" />
                <span>{{ $t("ui.common.wiki.noGuidePrefix") }}</span>
                <a class="s-link" :href="publish_url(`item/${id}`)">{{ $t("ui.common.actions.improve") }}</a>
            </template>
            <span v-else>{{ $t("ui.common.wiki.noRelatedGuide") }}</span>
        </div>
        <wiki-robot-bottom v-if="isRobot" type="item" :id="id"></wiki-robot-bottom>
    </div>
</template>

<script>
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Fav from "@/components/common/item-fav";
import Item from "@/components/common/compat-item.vue";
import GameText from "@jx3box/jx3box-editor/src/GameText.vue";
import ItemIcon from "@/components/common/item-icon.vue";
import Plan from "@/components/item/plan.vue";
import WikiPanel from "@/components/common/wiki-panel.vue";
import WikiRevisions from "@/components/common/wiki-revisions.vue";
import WikiComments from "@jx3box/jx3box-ui/src/wiki/WikiComments.vue";
import Thx from "@jx3box/jx3box-ui/src/single/Thx.vue";
import ItemPrices from "@/components/item/item-prices.vue";
import ItemPriceChart from "@/components/item/item-price-chart.vue";
import GamePrice from "@jx3box/jx3box-ui/src/wiki/GamePrice.vue";
import User from "@jx3box/jx3box-common/js/user";
import Notice from "@/components/cj/notice.vue";
import wikiRobotBottom from "@/components/common/wiki-robot-bottom.vue";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";
import { createArticleReadyTracker } from "@/utils/article-ready";

import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki.js";
import { __Links } from "@/utils/config";
import std_servers from "@jx3box/jx3box-data/data/server/server_std.json";
import origin_servers from "@jx3box/jx3box-data/data/server/server_origin.json";
import { item_color, item_quality, item_price } from "@/filters";
import { publishLink, ts2str, showAvatar, iconLink } from "@jx3box/jx3box-common/js/utils";
import { getManufactureDetail, getItemDetail } from "@/service/item";
import { getMyInfo } from "@/service/user";
import { get_item, show_item_prices } from "@/service/item";
import { getItemAuc } from "@/utils/item.js";

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
            loadError: false,
            requestGuard: createLatestRequestGuard(),
            priceAvailabilityGuard: createLatestRequestGuard(),
            detailRequestGuard: createLatestRequestGuard(),
            articleReadyTracker: createArticleReadyTracker(),
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
        routeDataKey() {
            return `${this.id || ""}:${this.post_id || ""}:${this.client || ""}`;
        },
    },
    components: {
        "jx3-item": Item,
        ItemIcon,
        WikiPanel,
        WikiRevisions,
        WikiComments,
        Thx,
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
        AsyncState,
    },
    methods: {
        get_data() {
            const item_id = this.source.id;
            if (!item_id) {
                this.showPrice = false;
                return;
            }
            const token = this.priceAvailabilityGuard.begin();
            show_item_prices(item_id, {
                    server: this.server,
                    limit: 15,
                })
                .then((data) => {
                    if (!this.priceAvailabilityGuard.isCurrent(token)) return;
                    data = data.data;
                    const prices = data.data?.prices?.sort((a, b) => a.created + b.created) || [];
                    this.showPrice = !!prices.length;
                })
                .catch(() => {
                    if (this.priceAvailabilityGuard.isCurrent(token)) this.showPrice = false;
                });
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
        itemBindLabel(value) {
            const labels = {
                1: this.$t("ui.item.detail.tradeableValue"),
                2: this.$t("ui.item.detail.tradeBeforeEquip"),
                3: this.$t("ui.item.detail.notTradeable"),
            };
            return labels[value] || this.$t("ui.item.detail.unknownBindType");
        },
        ts2str,
        iconLink(item) {
            return iconLink(item.item_info?.[0]?.IconID || item.item_info?.IconID);
        },
        showAvatar: function (url) {
            return showAvatar(url, 32);
        },
        async prepareArticleReady() {
            if (!this.isRobot) return;
            await this.$nextTick();
            await this.articleReadyTracker.wait(this.$el?.querySelector("#wikiArticle"));
        },
        syncWikiData: async function () {
            if (!this.id) return;
            const token = this.requestGuard.begin();
            this.loading = true;
            this.loadError = false;
            this.source = {};
            this.wiki_post = { source: {}, post: null };
            this.is_empty = false;
            if (this.isRobot) {
                this.articleReadyTracker.cancel();
                window.__READY__ = false;
            }
            try {
                const [itemResponse, wikiResponse, revisionResponse] = await Promise.all([
                    get_item(this.id, this.client),
                    wiki.mix({ type: "item", id: this.id, client: this.client }),
                    this.post_id
                        ? wiki.getById(this.post_id, { type: "item" })
                        : Promise.resolve(null),
                ]);
                if (!this.requestGuard.isCurrent(token)) return;

                this.source = itemResponse?.data?.data?.item || {};
                const { post, source, compatible, isEmpty, users } = wikiResponse;
                this.wiki_post = {
                    post: revisionResponse?.data?.data?.post || post,
                    source,
                    users,
                };
                this.is_empty = isEmpty;
                this.compatible = compatible;
                document.title = this.wiki_post.source?.Name + this.$t("pages.common.appendTitle");

                User.isLogin() &&
                    postHistory({
                        source_type: this.client == "origin" ? "origin_item" : "item",
                        source_id: ~~this.id,
                        link: location.href,
                        title: this.wiki_post.post?.title,
                    });

                this.triggerStat();
            } catch (e) {
                if (!this.requestGuard.isCurrent(token)) return;
                this.loadError = true;
            } finally {
                if (this.requestGuard.isCurrent(token)) {
                    this.loading = false;
                    this.prepareArticleReady();
                }
            }
        },
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_item", this.id);
            } else {
                postStat("item", this.id);
            }
        },
        loadItemDetail: async function () {
            const token = this.detailRequestGuard.begin();
            this.requiredList = [];
            const source = this.wiki_post?.source;
            if (!source?.UiID) return;

            try {
                const res = await getManufactureDetail({ sourceId: source.SourceID, client: this.client });
                if (!this.detailRequestGuard.isCurrent(token)) return;
                const data = res?.data?.find((item) => item.CreateItemIndex1 === source.SourceID);
                if (!data) return;

                const counts = [];
                const itemIds = [];
                for (const key in data) {
                    if (key.startsWith("RequireItemCount") && data[key]) counts.push(data[key]);
                    if (key.startsWith("RequireItemIndex") && data[key]) itemIds.push(data[key]);
                }
                if (!itemIds.length) return;

                const itemRes = await getItemDetail({ ids: itemIds.join(","), per: 10, client: this.client });
                if (!this.detailRequestGuard.isCurrent(token)) return;
                this.requiredList =
                    itemRes?.data?.list?.map((item, i) => ({
                        ...item,
                        _count: counts[i],
                    })) || [];
            } catch (e) {
                if (this.detailRequestGuard.isCurrent(token)) this.requiredList = [];
            }
        },
        showDuration: function (val) {
            val = Number(val);
            return val && this.$t("ui.item.detail.days", { count: dayjs.duration(val).asDays().toFixed(0) });
        },
        loadUserDefaultServer() {
            User.isLogin() &&
                getMyInfo()
                    .then((data) => {
                        let userServer = data?.jx3_server;
                        this.$nextTick(() => {
                            if (userServer && this.servers.includes(userServer)) {
                                this.server = userServer;
                            } else {
                                this.server = this.firstServer;
                            }
                        });
                    })
                    .catch(() => {});
        },
        handleWikiPush() {
            if (!this.wiki_post?.post?.id) {
                return this.$message.warning(this.$t("ui.item.noGuideWarning"));
            }
            this.$refs.wikiPanel?.onPush();
        },
    },
    watch: {
        routeDataKey: {
            immediate: true,
            handler() {
                this.syncWikiData();
            },
        },
        source: {
            handler() {
                let item = this.source;
                if (!this.isRobot) {
                    this.activeTab = item && item.BindType != 3 ? DEFAULT_ACTIVE_TAB : "relation-plans";
                }
                if (this.$store.state.sidebar) {
                    if (!item || !item.AucGenre || !item.AucSubType) {
                        this.$store.state.sidebar.AucGenre = 0;
                        this.$store.state.sidebar.AucSubTypeID = 0;
                        return;
                    }
                    const [customAucGenre, customAucSubType] = getItemAuc(item) || [];
                    const targetAucGenre = customAucGenre || item.AucGenre;
                    const targetAucSubType = customAucSubType || item.AucSubType;

                    this.$store.state.sidebar.AucGenre = Number(targetAucGenre);
                    this.$store.state.sidebar.AucSubTypeID = Number(targetAucSubType);
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
        this.loadUserDefaultServer();
        bus.on("openWikiPush", this.handleWikiPush);
    },
    beforeUnmount() {
        bus.off("openWikiPush", this.handleWikiPush);
        this.requestGuard.invalidate();
        this.priceAvailabilityGuard.invalidate();
        this.detailRequestGuard.invalidate();
        this.articleReadyTracker.cancel();
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

<!-- <style lang="less" scoped>
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
</style> -->
