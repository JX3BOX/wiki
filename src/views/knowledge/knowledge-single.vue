<template>
    <div class="v-knowledge-single" v-loading="loading">
        <div v-if="!isRobot" class="u-detail-title">{{ title }}</div>
        <div v-else class="m-robot-header">
            <div class="m-robot-header__left">
                <div class="u-title">{{ title }}</div>
                <div class="u-desc">剑网3魔盒通识百科 - 剑三世界概念全知道！</div>
            </div>
            <img class="u-robot-header__right" src="@/assets/img/knowledge_robot.svg" />
        </div>
        <notice v-if="!isRobot"></notice>
        <div class="m-wiki" :class="{ 'is-robot': isRobot }" v-if="data && data.post">
            <WikiRobotTip v-if="!isRobot" type-name="通识" :reply="title"></WikiRobotTip>
            <WikiPanel class="m-knowledge-panel" :wiki-post="data" ref="wikiPanel">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="../../assets/img/knowledge.svg" />
                    <span>通识攻略</span>
                </template>
                <template v-if="!isRobot" slot="head-actions">
                    <a class="el-button el-button--primary" :href="publishLink(`knowledge/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善百科通识</span>
                    </a>
                </template>
                <template slot="body">
                    <Article :content="content" />
                </template>
            </WikiPanel>

            <template v-if="!isRobot">
                <WikiRevisions v-if="id" type="knowledge" :source-id="id" style="margin-bottom: 35px" />

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
                                :postId="~~id"
                                postType="knowledge"
                                :postTitle="title"
                                :userId="author_id"
                                :adminBoxcoinEnable="true"
                                :userBoxcoinEnable="true"
                                mode="wiki"
                                :authors="authors"
                                :key="'item-thx-' + id"
                                showRss
                            />
                        </template>
                    </WikiPanel>
                </div>

                <WikiPanel v-if="id" class="m-knowledge-panel">
                    <template slot="head-title">
                        <i class="el-icon-chat-line-round"></i>
                        <span class="u-title">讨论</span>
                    </template>
                    <template slot="body">
                        <Comment :id="id" category="knowledge" />
                    </template>
                </WikiPanel>
            </template>
        </div>

        <div v-else class="m-wiki-null" :class="isRobot ? 'is-robot-empty' : ''">
            <template v-if="!isRobot">
                <i class="el-icon-s-opportunity"></i>
                <span>暂无内容，我要</span>
                <a class="s-link" :href="publishLink(`knowledge/${id}`)">完善百科通识</a>
            </template>
            <span v-else>暂无相关攻略，欢迎热心侠士前往补充！</span>
        </div>
        <wiki-robot-bottom v-if="isRobot" type="knowledge" :id="id"></wiki-robot-bottom>
    </div>
</template>

<script>
import { postStat, postHistory } from "@jx3box/jx3box-common/js/stat";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@/components/wiki-panel.vue";
import WikiRevisions from "@/components/wiki-revisions.vue";
import User from "@jx3box/jx3box-common/js/user";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";

import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import notice from "@/components/cj/notice.vue";
import wikiRobotBottom from "@/components/common/wiki-robot-bottom.vue";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";
import bus from "@/store/bus";
import WikiRobotTip from "@/components/common/wiki-robot-tip.vue";

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
            loading: false,
            data: "",
        };
    },
    components: {
        Article,
        WikiPanel,
        WikiRevisions,
        Comment,
        notice,
        wikiRobotBottom,
        WikiRobotTip,
    },
    computed: {
        id: function () {
            return this.$route.params.source_id || this.sourceId;
        },
        type: function () {
            return this.data?.source?.type;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.data?.post?.user_id;
        },
        title: function () {
            return this.data?.source?.name;
        },
        content: function () {
            return this.data?.post?.content;
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.data?.users
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
        isEditor: function () {
            return User.isEditor();
        },
        isMiniProgram() {
            return isMiniProgram();
        },
    },
    methods: {
        onSearchKey(val) {
            this.$router.push({ path: "/", query: { search: val } });
        },
        getData() {
            this.loading = true;
            wiki.get({ type: "knowledge", id: this.id })
                .then((res) => {
                    this.data = res.data.data;
                    if (this.data.source) this.data.source.post = this.data.post;

                    User.isLogin() &&
                        postHistory({
                            source_type: "knowledge",
                            source_id: ~~this.id,
                            link: location.href,
                            title: this.title,
                        });
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);

                    // TEST:请注意，为防止QQBOT无法抓取完全，请不要删除本行
                    window.__READY__ = true;
                });
        },
        getPostData() {
            this.loading = true;
            wiki.getById(this.$route.params.post_id)
                .then((res) => {
                    const data = res.data.data;
                    if (data.source) this.data.source.post = data.post;
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
                });
        },
        goBack() {
            if (this.data?.source?.type) {
                this.$router.push({ name: "normal", params: { knowledge_type: this.data.source.type } });
            } else {
                this.$router.push({ name: "index" });
            }
        },
        publishLink,
    },
    mounted() {
        bus.on("openWikiPush", (param) => {
            console.log(this.wiki_post);
            if (!this.data?.source?.post?.id) {
                return this.$message.warning("该通识没有攻略");
            }
            this.$refs.wikiPanel?.onPush();
        });
    },
    watch: {
        "$route.params.post_id": {
            immediate: true,
            handler() {
                if (this.$route.params.post_id) {
                    // 获取指定攻略
                    this.getPostData();
                }
            },
        },
        id: {
            immediate: true,
            handler() {
                if (this.id) {
                    this.getData(this.id);
                }
            },
        },
    },
};
</script>

<style lang="less">
.m-wiki,
.m-wiki-null {
    .mt(10px);
}
.m-wiki-null {
    .x;
    .r(5px);
    .fz(15px);
    padding: 20px;
    background-color: #fafbfc;
    border: 1px solid #eee;

    a:hover {
        box-shadow: 0 1px 0 @primary;
    }
    &.is-robot-empty {
        width: 100%;
        height: 42px;
        border-radius: 8px;
        box-sizing: border-box;
        background: linear-gradient(to top, #383838 0%, #000000 100%);

        border: 1px solid #6e6e6e !important;

        box-shadow: inset 0px 10px 5px #000000;
        text-shadow: none !important;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;

        color: rgba(#fff, 0.75) !important;
    }
}
.m-navigation {
    .flex;
    justify-content: space-between;
    align-items: center;
}
.w-boxcoin-records-list {
    background-color: #fff;
}
.m-robot-header {
    width: 100%;
    height: 75px;
    border-radius: 8px;
    background: linear-gradient(to top, #383838 0%, #000000 100%);
    box-sizing: border-box;

    border: 1px solid #6e6e6e;

    box-shadow: inset 0px 10px 5px #000000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    .u-title {
        font-size: 20px;
        .bold;
        color: #fff;
        width: 420px;
        .nobreak;
    }
    .u-desc {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(#fff, 0.75);
    }
    .u-robot-header__right {
        .size(48px);
    }
}
.m-knowledge-panel {
    .m-panel-title {
        .flex;
        align-items: center;
    }
    .el-icon-chat-line-round {
        width: 28px;
        height: 28px;
        line-height: 28px;
        color: #0366d6;
        fill: #0366d6;
        font-size: 22px;
    }
    .u-title {
        font-size: 17px;
        font-weight: 300;
    }
}
.m-wiki-thx-panel {
    .m-panel-title {
        .flex;
        align-items: center;
        svg,
        i {
            width: 28px;
            height: 28px;
            line-height: 28px;
            color: #0366d6;
            fill: #0366d6;
            font-size: 22px;
        }
        span {
            font-size: 17px;
            font-weight: 300;
        }
    }
    .m-thx {
        margin-top: 20px;
        .w-boxcoin-records-list {
            background-color: #fff;
        }
    }
}
.u-detail-title {
    font-size: 18px;
    .bold;
    line-height: 2;
}

.m-wiki.is-robot {
    .r(8px);
    overflow: hidden;
    .c-wiki-panel {
        margin-bottom: 0;
        .m-wiki-metas .u-value {
            color: #3d454d;
        }
    }
    .m-panel-head .m-panel-actions {
        .none;
    }
}
</style>
