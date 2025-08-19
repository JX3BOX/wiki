<template>
    <div class="m-comment-list"  id="macro-comment">
        <div
            v-for="item in comments"
            :key="item.id"
            class="m-comment-item"
        >
            <div class="m-main-content">
                <div class="u-commenter-name"  @click="toDetail(item.user_id)">
                    {{item.user_nickname}}
                </div>
                <div class="u-comment-content">
                    {{item.content}}
                </div>
                <div class="u-comment-time">
                    {{dayjs(item?.commentDate).format("YYYY-MM-DD")}}
                </div>
            </div>
            <div class="m-child-comment" v-if="item.children?.length">
                <div v-for="reply in item.children" :key="reply.id" class="m-reply-item">
                    <div class="u-replier-name" @click="toDetail(reply.user_id)">
                        {{reply.user_nickname}}
                    </div>
                    <span class="u-reply">回复</span>
                    <div class="u-replier-name" @click="reply.parent.user_id ? toDetail(reply.parent.user_id) : null">
                        {{reply.parent.user_nickname}}
                    </div>
                    <span class="u-reply">：</span>
                    <div class="u-reply-content">
                        {{reply.content}}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" class="u-loading-more">加载中...</div>
        <div v-if="noMoreData" class="u-no-more">没有更多评论了</div>
    </div>
</template>

<script>

import dayjs from "dayjs";
import { wikiComment } from "@jx3box/jx3box-common/js/wiki_v2";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "MiniprogramCommentList",
    props: ["type", "sourceId"],
    data() {
        return {
            comments: [],
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
            return this.$route.name?.indexOf("wujie") > -1;
        },
        client: function () {
            return location.href.includes("classic") || location.href.includes("origin") ? "origin" : "std";
        },
        noMoreData() {
            // 判断是否已加载全部评论
            return this.comments.length >= this.total && this.total > 0;
        }
    },
    mounted() {
        this._onScroll = this.handleScroll.bind(this);
        window.addEventListener('scroll', this._onScroll);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this._onScroll);
    },
    methods: {
        dayjs,
        handleScroll() {
            if (this.loading || this.noMoreData) return;
            // 距离底部100px时触发
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollTop + windowHeight + 100 >= docHeight) {
                this.loadMore();
            }
        },
        loadMore() {
            if (this.loading || this.noMoreData) return;
            this.page++;
            this.get_comments(true); // 传递参数标记为加载更多
        },
        get_comments(append = false) {
            if (!this.type || !this.sourceId) return;
            this.loading = true;
            wikiComment
                .list({ type: this.type, id: this.sourceId }, { client: this.client, page: this.page })
                .then((res) => {
                    res = res.data;
                    let comments = res.data.list;
                    for (let i = 0; i < comments.length; i++) {
                        comments[i]["reply_form"] = {
                            show: false,
                            content: "",
                            user_nickname: User.getInfo().name,
                        };
                    }
                    this.page = res.data.page;
                    this.total = res.data.total;
                    if (append) {
                        // 追加评论
                        this.comments = this.comments.concat(filter(comments, 0));
                    } else {
                        this.comments = filter(comments, 0);
                    }
                    this.loading = false;
                });

            function filter(comments, parent) {
                let outputs = [];
                for (let index in comments) {
                    let c = comments[index];
                    if (!c) continue;
                    if (c.parent_id === parent) {
                        // 递归
                        let children = filter(c.children, c.id);
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
                }
                return outputs;
            }
        },
        create_comment(form, parent_id = 0) {
            // 校验评论内容
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
                parent_id: parent_id,
                user_nickname: form.user_nickname || User.getInfo().name,
                content: form.content,
                client: this.client,
            };
            wikiComment
                .post(data)
                .then((res) => {
                    res = res.data;
                    form.content = "";
                    this.$message({
                        message: "提交成功，请等待审核",
                        type: "success",
                    });
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
            wikiComment.star(comment.id, {
                is_star
            }).then(() => {
                this.page = 1; // 重置页码
                this.get_comments();
            });
        },
        top_comment(comment, is_top) {
            wikiComment.top(comment.id, {
                is_top
            }).then(() => {
                this.page = 1; // 重置页码
                this.get_comments();
            });
        },

        toDetail(){

        },
    },

    watch: {
        sourceId: {
            immediate: true,
            handler() {
                this.page = 1; // 重置页码
                this.get_comments();
            },
        },
    },
};
</script>


<style  lang="less">
.m-comment-list{
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;
    .m-comment-item{
        display: flex;
        padding: var(--20, 20px);
        flex-direction: column;
        gap: var(--8, 8px);

        background: var(--primary-brand-4, #282828);

        .m-main-content{
            display: flex;
            flex-direction: column;
            gap: var(--8, 8px);

            .u-commenter-name{
                color: var(--secondary-cyan, #32ADE6);
                font-size: 12px;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
            .u-comment-content{
                color: var(--black-80, rgba(28, 28, 28, 0.80));
                font-size: 14px;
                font-weight: 400;
                line-height: 20px; /* 142.857% */
            }
            .u-comment-time{
                color: var(--black-40, rgba(28, 28, 28, 0.40));
                font-size: 12px;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }

        .m-child-comment{
            display: flex;
            padding: 12px;
            flex-direction: column;
            gap: 10px;
            border-radius: 8px;
            background: var(--black-5, rgba(28, 28, 28, 0.05));
            .m-reply-item{
                // 超出长度不分词
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                .u-replier-name{
                    color: var(--secondary-cyan, #32ADE6);
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px; /* 150% */
                    display: inline-block;
                    margin-right: 4px;
                }
                .u-reply{
                    color: var(--black-40, rgba(255, 255, 255, 0.40));
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px; /* 150% */
                    margin-right: 4px;
                }
                .u-reply-content{
                    color: var(--black-80, rgba(255, 255, 255, 0.80));
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px; /* 150% */
                    display: inline;
                }
            }
        }
    }

    .u-loading-more, .u-no-more {
        text-align: center;
        padding: 10px 0;
        color: var(--black-40, rgba(28, 28, 28, 0.40));
        font-size: 12px;
        font-weight: 400;
    }
}
</style>
