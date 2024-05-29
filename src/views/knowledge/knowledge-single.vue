<template>
    <div class="v-knowledge-single" v-loading="loading">
        <notice></notice>
        <div class="m-wiki" v-if="data && data.post">
            <WikiPanel class="m-knowledge-panel" :wiki-post="data">
                <template slot="head-title">
                    <img class="u-icon" svg-inline src="../../assets/img/knowledge.svg" />
                    <span>{{ title }} </span>
                </template>
                <template slot="head-actions">
                    <a class="el-button el-button--primary" :href="publishLink(`knowledge/${id}`)">
                        <i class="el-icon-edit"></i>
                        <span>完善百科通识</span>
                    </a>
                </template>
                <template slot="body">
                    <Article :content="content" />
                </template>
            </WikiPanel>

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
        </div>

        <div v-else class="m-wiki-null">
            <i class="el-icon-s-opportunity"></i>
            <span>暂无内容，我要</span>
            <a class="s-link" :href="publishLink(`knowledge/${id}`)">完善百科通识</a>
        </div>
    </div>
</template>

<script>
import { postStat } from "@jx3box/jx3box-common/js/stat";
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@/components/wiki-panel.vue";
import WikiRevisions from "@/components/wiki-revisions.vue";
import User from "@jx3box/jx3box-common/js/user";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";

import Article from "@jx3box/jx3box-editor/src/Article.vue";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
import notice from "@/components/cj/notice.vue";

export default {
    name: "Detail",
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
    },
    computed: {
        id: function () {
            return this.$route.params.source_id;
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
                })
                .finally(() => {
                    this.loading = false;
                    postStat(this.type, this.id);
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
}
.m-navigation {
    .flex;
    justify-content: space-between;
    align-items: center;
}
.w-boxcoin-records-list {
    background-color: #fff;
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
</style>
