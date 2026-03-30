<template>
    <div class="m-comments-panel" v-loading="loading">
        <div class="u-empty" v-if="!comments || !comments.length">
            <span v-if="comments === null">加载中...</span>
            <span v-else-if="comments === false">数据加载异常</span>
            <span v-else>暂无评论</span>
        </div>
        <CommentTree :is-wujie="isWujie" :comments="comments" :source-id="sourceId" />
        <el-pagination
            class="u-pagination-box"
            background
            hide-on-single-page
            :current-page="page"
            :total="total"
            :page-size="pageSize"
            :layout="isWujie ? 'prev, next' : 'prev, pager, next, total'"
            :size="isWujie ? 'small' : undefined"
            :pager-count="isWujie ? 5 : 7"
            @current-change="handleCurrentChange"
        ></el-pagination>
        <div id="m-reply-form" class="m-reply-form">
            <h4 class="u-title">
                <LegacyIcon class="el-icon-chat-dot-round" />
                <span>回复</span>
            </h4>
            <textarea class="u-reply-content" v-model="reply_form.content"></textarea>
            <div class="u-author">
                <span>昵称：</span>
                <input v-model="reply_form.user_nickname" type="text" />
            </div>
            <el-button type="primary" class="u-submit" @click="create_comment(reply_form)">
                <LegacyIcon class="el-icon-check" />
                <span>提交</span>
            </el-button>
        </div>
    </div>
</template>

<script>
import CommentTree from "@/components/wiki-comment.vue";
import { wikiComment } from "@jx3box/jx3box-common/js/wiki";
import User from "@jx3box/jx3box-common/js/user";

function buildCommentTree(comments) {
    const loop = (list, parent) => {
        const outputs = [];
        for (const comment of list || []) {
            if (!comment || comment.parent_id !== parent) continue;
            const children = loop(comment.children, comment.id);
            comment.children = children.map((item) => {
                item.parent = {
                    user_id: comment.user_id,
                    user_nickname: comment.user_nickname,
                    id: comment.id,
                };
                item.reply_form = {
                    show: false,
                    content: "",
                    user_nickname: User.getInfo().name,
                };
                return item;
            });
            outputs.push(comment);
        }
        return outputs;
    };

    return loop(comments, 0);
}

export default {
    name: "WikiCommentsContent",
    components: {
        CommentTree,
    },
    props: {
        type: {
            type: String,
            default: "",
        },
        sourceId: {
            type: [String, Number],
            default: 0,
        },
    },
    data() {
        return {
            comments: null,
            reply_form: {
                content: "",
                user_nickname: User.getInfo().name,
            },
            page: 1,
            pageSize: 10,
            total: 0,
            loading: false,
        };
    },
    computed: {
        isWujie() {
            return this.$route.name?.includes("wujie");
        },
        client() {
            return this.$route?.query?.L === "classic_yq" ? "origin" : "std";
        },
    },
    methods: {
        get_comments() {
            if (!this.type || !this.sourceId) {
                this.comments = [];
                this.total = 0;
                this.loading = false;
                return;
            }
            this.loading = true;
            wikiComment
                .list({ type: this.type, id: this.sourceId }, { client: this.client, page: this.page })
                .then((res) => {
                    const data = res.data?.data || {};
                    const comments = data.list || [];

                    comments.forEach((comment) => {
                        comment.reply_form = {
                            show: false,
                            content: "",
                            user_nickname: User.getInfo().name,
                        };
                    });

                    this.page = data.page || 1;
                    this.total = data.total || 0;
                    this.comments = buildCommentTree(comments);
                })
                .catch(() => {
                    this.comments = false;
                    this.total = 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        create_comment(form, parent_id = 0) {
            if (!form.content) {
                this.$message({
                    message: "请先填写评论内容后再尝试提交",
                    type: "warning",
                });
                return;
            }

            const data = {
                type: this.type,
                source_id: String(this.sourceId),
                parent_id,
                user_nickname: form.user_nickname || User.getInfo().name,
                content: form.content,
                client: this.client,
            };

            wikiComment
                .post(data)
                .then(() => {
                    form.content = "";
                    this.$message({
                        message: "提交成功，请等待审核",
                        type: "success",
                    });
                    this.page = 1;
                    this.get_comments();
                })
                .finally(() => {
                    form.show = false;
                });
        },
        handleCurrentChange(page) {
            this.page = page;
            this.get_comments();
        },
        star_comment(comment, is_star) {
            wikiComment.star(comment.id, { is_star }).then(() => {
                this.page = 1;
                this.get_comments();
            });
        },
        top_comment(comment, is_top) {
            wikiComment.top(comment.id, { is_top }).then(() => {
                this.page = 1;
                this.get_comments();
            });
        },
    },
    watch: {
        sourceId: {
            immediate: true,
            handler() {
                this.page = 1;
                this.get_comments();
            },
        },
        type() {
            if (!this.sourceId) return;
            this.page = 1;
            this.get_comments();
        },
    },
};
</script>

<style lang="less">
@import "~@jx3box/jx3box-ui/assets/css/wiki/wiki-comments.less";
</style>
