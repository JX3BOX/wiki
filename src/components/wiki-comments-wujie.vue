<template>
    <div class="c-wiki-comments m-comments-panel" v-loading="loading">
        <div class="u-empty" v-if="!comments || !comments.length">
            <span v-if="comments === null">🎉 数据加载中...</span>
            <span v-if="comments === false">⚠️ 数据加载异常</span>
            <span v-if="comments && !comments.length">💧 暂无评论</span>
        </div>
        <WikiComment :comments="comments" :source-id="sourceId" />
        <el-pagination
            class="u-pagination-box"
            background
            hide-on-single-page
            small
            :current-page="page"
            :total="total"
            :page-size="pageSize"
            layout="prev, next"
            @current-change="handleCurrentChange"
        ></el-pagination>
        <div id="m-reply-form" class="m-reply-form">
            <h4 class="u-title">
                <i class="el-icon-chat-dot-round"></i>
                <span>回复</span>
            </h4>
            <textarea class="u-reply-content" v-model="reply_form.content"></textarea>
            <div class="u-author">
                <span>昵称：</span>
                <input v-model="reply_form.user_nickname" type="text" />
            </div>
            <el-button type="primary" class="u-submit" @click="create_comment(reply_form)">
                <i class="el-icon-check"></i>
                <span>提交</span>
            </el-button>
        </div>
    </div>
</template>

<script>
import WikiComment from "@jx3box/jx3box-ui/src/wiki/WikiComment.vue";
import { wikiComment } from "@jx3box/jx3box-common/js/wiki";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "WikiCommentsWujie",
    components: {
        WikiComment,
    },
    props: {
        type: {
            type: String,
            default: "",
        },
        sourceId: {
            type: [Number, String],
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
                    const data = res?.data?.data || {};
                    const list = data.list || [];

                    list.forEach((item) => {
                        item.reply_form = {
                            show: false,
                            content: "",
                            user_nickname: User.getInfo().name,
                        };
                    });

                    this.page = data.page || 1;
                    this.total = data.total || 0;
                    this.comments = this.buildTree(list, 0);
                })
                .catch(() => {
                    this.comments = false;
                    this.total = 0;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        buildTree(comments, parent) {
            const outputs = [];
            for (const c of comments || []) {
                if (!c || c.parent_id !== parent) continue;
                const children = this.buildTree(c.children, c.id);
                c.children = children.map((item) => {
                    item.parent = {
                        user_id: c.user_id,
                        user_nickname: c.user_nickname,
                        id: c.id,
                    };
                    item.reply_form = {
                        show: false,
                        content: "",
                        user_nickname: User.getInfo().name,
                    };
                    return item;
                });
                outputs.push(c);
            }
            return outputs;
        },
        create_comment(form, parent_id = 0) {
            if (!form.content) {
                this.$message({
                    message: "请先填写评论内容再尝试提交",
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
