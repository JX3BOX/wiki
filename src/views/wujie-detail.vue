<template>
    <div class="p-wujie-cj-detail">
        <div class="m-header">
            <div class="m-header__logo">
                <a class="m-logo" :href="rootPath">
                    <img class="u-logo" src="@/assets/img/logo.png" alt="JX3BOX" />
                </a>
                <div class="m-info">
                    <div class="u-title">魔盒成就百科</div>
                    <div class="u-stat">
                        魔盒数据库已收录 -
                        <span class="u-stat-item" v-for="(text, key) in countDict" :key="key">
                            <em>{{ text }}</em>
                            <span>:</span>
                            <b>{{ count[key] }}</b>
                        </span>
                    </div>
                </div>
            </div>
            <el-dropdown class="m-header__links">
                <el-button type="primary" class="u-dropdown-link">
                    更多百科<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu class="m-header__menu" slot="dropdown">
                    <el-dropdown-item class="u-dropdown-link">
                        <a :href="`${rootPath}adventure`">奇遇大全</a>
                    </el-dropdown-item>
                    <el-dropdown-item class="u-dropdown-link">
                        <a :href="`${rootPath}pet`">宠物大全</a>
                    </el-dropdown-item>
                    <el-dropdown-item class="u-dropdown-link">
                        <a :href="`${rootPath}horse`">坐骑大全</a>
                    </el-dropdown-item>
                    <el-dropdown-item class="u-dropdown-link">
                        <a :href="`${rootPath}furniture`">家具大全</a>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="m-content-wrapper">
            <div class="m-strategy-content">
                <!-- 进阶类成就 -->
                <div class="m-series" v-if="seriesList.length">
                    <router-link
                        class="u-series"
                        :class="item.ID == source.ID ? 'active' : ''"
                        v-for="item in seriesList"
                        :key="item.ID"
                        :to="{
                            name: 'wujie-cj-detail',
                            params: { source_id: item.ID },
                        }"
                    >
                        <div class="u-series__left">
                            <img class="u-icon" :src="icon_url(item.IconID)" />
                            <div class="u-name">{{ item.Name }}</div>
                        </div>
                        <div class="u-series__right">
                            <img class="u-icon" src="@/assets/img/wujie/point.svg" svg-inline />
                            <div class="u-num">{{ item.Point }}</div>
                        </div>
                    </router-link>
                </div>
                <!-- 攻略 -->
                <div class="m-strategy">
                    <div class="m-title-wrapper">
                        <div class="m-title">
                            <img class="u-icon" src="@/assets/img/wujie/strategy.svg" svg-inline alt="成就攻略" />
                            <div class="u-title">成就攻略</div>
                        </div>
                        <WikiRobotTip
                            class="m-wujie-cj-qqbot-tip"
                            type-name="成就"
                            :reply="source?.Name"
                        ></WikiRobotTip>
                    </div>
                    <div class="m-detail">
                        <div class="m-wiki-post-panel" v-if="wiki_post && wiki_post.post">
                            <WikiPanel :wiki-post="wiki_post">
                                <div slot="meta" class="m-meta-list">
                                    <!-- 参与贡献 -->
                                    <div class="m-user-info">
                                        <div class="u-meta" v-if="wiki_post.users && wiki_post.users.length">
                                            <em class="u-label">参与贡献</em>
                                            <div class="m-users">
                                                <a
                                                    class="u-value u-creator"
                                                    v-for="(user, key) in wiki_post.users.slice(0, 3)"
                                                    :key="key"
                                                    target="_blank"
                                                    :href="user.id ? author_url(user.id) : null"
                                                >
                                                    <img
                                                        class="u-user"
                                                        :src="thumbnail_url(user.avatar)"
                                                        :alt="user.nickname"
                                                        :title="user.nickname"
                                                    />
                                                </a>
                                                <span class="u-more" v-if="userLength > 3">
                                                    +{{ userLength - 3 > 999 ? 999 : userLength - 3 }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="m-article-info">
                                        <div class="m-version" v-if="versions.length">
                                            攻略版本：v{{ versions.length }}
                                        </div>
                                        <div class="m-wiki-signature">
                                            本次修订由 <b>{{ user_name }}</b> 提交于{{ updated_at }}
                                        </div>
                                    </div>
                                </div>
                                <template slot="body">
                                    <div class="m-wiki-compatible" v-if="compatible">
                                        <i class="el-icon-warning-outline"></i>
                                        暂无缘起攻略，以下为重制攻略，仅作参考，<a
                                            class="s-link"
                                            :href="publish_url(`achievement/${id}`)"
                                            >参与修订</a
                                        >。
                                    </div>
                                    <Article :content="wiki_post.post.content" />
                                </template>
                            </WikiPanel>
                        </div>

                        <div class="m-wiki-post-empty" v-if="is_empty">
                            <i class="el-icon-s-opportunity"></i>
                            <span>暂无攻略，我要</span>
                            <a class="s-link" :href="publish_url(`achievement/${id}`)">完善攻略</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 评论 -->
            <div class="m-comment">
                <div class="m-title">
                    <img class="u-icon" src="@/assets/img/wujie/comment.svg" svg-inline alt="百科评论" />
                    <div class="u-title">百科评论</div>
                </div>
                <WikiComments class="m-comment-detail" type="achievement" :source-id="id" />
            </div>
        </div>
    </div>
</template>

<script>
import { __Root, __OriginRoot } from "@/utils/config";

import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import { ts2str, authorLink, showAvatar, iconLink } from "@jx3box/jx3box-common/js/utils.js";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";
import User from "@jx3box/jx3box-common/js/user";

import { getAchievementsTotal, get_achievement } from "@/service/achievement";

import WikiPanel from "@/components/wiki-panel.vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import WikiComments from "@/components/wiki-comments.vue";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";
export default {
    name: "WujieDetail",
    components: {
        WikiPanel,
        Article,
        WikiComments,
        WikiRobotTip,
    },
    data() {
        return {
            params: new URLSearchParams(location.search),
            generalNum: 137, // 和游戏差异，固定加上
            count: {},
            countDict: {
                general: "常规成就数",
                general_point: "常规资历数",
                armor: "五甲成就数",
                armor_point: "五甲资历数",
                // post_count: "收录攻略数",
            },

            source: "",
            wiki_post: "",
            compatible: false,
            is_empty: true,
            versions: [],
        };
    },
    computed: {
        client: function () {
            let client = this.params.get("L") == "classic_yq" ? "origin" : "std";
            return client;
        },
        rootPath: function () {
            return this.client == "origin" ? __OriginRoot : __Root;
        },
        id() {
            return this.$route.params.source_id;
        },
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post.post.user_id;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
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
        favTitle: function () {
            return this.wiki_post?.source?.Name;
        },
        prefix() {
            return this.client === "std" ? "www" : "origin";
        },
        seriesList() {
            return this.source?.SeriesAchievementList || [];
        },
        userLength: function () {
            return this.wiki_post?.users?.length;
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
    },
    created() {
        this.getStat();
    },
    mounted() {
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }
    },
    methods: {
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
        author_url: authorLink,
        ts2str,
        thumbnail_url: function (val) {
            return showAvatar(val);
        },
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_cj", this.id);
            } else {
                postStat("cj", this.id);
            }
        },
        loadData: function () {
            // 获取最新攻略
            if (this.id) {
                get_achievement(this.id, { client: this.client }).then((res) => {
                    this.source = res?.data?.data?.achievement || "";
                });
                wiki.mix({ type: "achievement", id: this.id, client: this.client }).then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;

                    reportNow({
                        caller: "cj_detail",
                        data: {
                            href: `${this.prefix}:/cj/view/${this.id}`,
                        },
                    });

                    User.isLogin() &&
                        postHistory({
                            source_type: "wujie",
                            source_id: ~~this.id,
                            link: location.href,
                            title: post.title,
                        });
                });

                wiki.versions({ type: "achievement", id: this.id }, { client: this.client }).then(
                    (res) => {
                        res = res.data;
                        this.versions = res.data || [];
                    },
                    () => {
                        this.versions = [];
                    }
                );
            }
            this.triggerStat();
        },
        loadRevision: function () {
            // 获取指定攻略
            wiki.getById(this.post_id).then((res) => {
                this.wiki_post = {
                    ...this.wiki_post,
                    post: res.data.data?.post,
                };
            });
            this.triggerStat();
        },
        getStat() {
            // 获取成就统计信息
            getAchievementsTotal().then((data) => {
                data = data.data;
                this.count = data.data.count;
                this.count.general = ~~this.count?.general + this.generalNum;
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/wujie/cj-detail.less";
</style>
