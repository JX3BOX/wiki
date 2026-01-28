<template>
    <div class="m-comment-list" id="macro-comment" v-if="isLogin">
        <div v-for="item in commentList" :key="item.id" class="m-comment-item">
            <div class="m-main-content">
                <div class="u-commenter-name" @click="toDetail(item.userId)">
                    {{ item.displayName }}
                </div>
                <div class="u-comment-content">
                    {{ item.content }}
                </div>
                <div class="u-comment-time">
                    {{ dayjs(item?.commentDate).format("YYYY-MM-DD") }}
                </div>
            </div>
            <div class="m-child-comment" v-if="item.reply?.length">
                <div v-for="reply in item.reply" :key="reply.id" class="m-reply-item">
                    <div class="u-replier-name" @click="toDetail(reply.userId)">
                        {{ reply.displayName }}
                    </div>
                    <span class="u-reply">回复</span>
                    <div class="u-replier-name" @click="toDetail(reply.replyForUID || item.userId)">
                        {{ reply.replyForUsername || item.displayName }}
                    </div>
                    <span class="u-reply">：</span>
                    <div class="u-reply-content">
                        {{ reply.content }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="loading" class="u-loading-more">加载中...</div>
        <div v-if="noMoreData" class="u-no-more">没有更多评论了</div>
    </div>
</template>

<script>
import { getOrderMode, setOrderMode } from "@jx3box/jx3box-comment-ui/src/options";
import { DELETE, GET, POST, PUT } from "@jx3box/jx3box-comment-ui/src/service";
import { authorLink, isMiniProgram, showAvatar } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";
import { mobileOpen, wxNewPage } from "@/utils/minprogram";
import User from "@jx3box/jx3box-common/js/user.js";

export default {
    name: "CommentList",
    props: {
        id: {
            type: [String, Number],
            default: 0,
        },
        category: {
            type: String,
            default: "post",
        },
        normal: {
            type: Boolean,
            default: true,
        },
        order: {
            type: String,
            default: "desc",
        },
        homework: {
            type: Boolean,
            default: false,
        },
        postType: {
            type: String,
            default: "comment",
        },
    },
    data() {
        return {
            baseAPI: "",
            commentPower: {
                allow: false,
                uid: -1,
            },
            commentList: [],
            pager: {
                index: 1,
                pageSize: 10,
                pageTotal: 1,
                total: 0,
            },
            isDesc: "DESC",
            orderByLikes: false,
            openWhiteList: false,
            loading: false,

            noMoreData: false,
            // 新增属性，用于判断是否监听滚动
            scrollListener: null,

            isLogin: User.isLogin(),
        };
    },
    methods: {
        dayjs,
        formatTime(val) {
            return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
        },
        changeOrder() {
            this.reloadCommentList(this.pager.index);
            setOrderMode(this.isDesc === "ASC" ? "DESC" : "ASC");
        },
        changeOrderByLikes() {
            this.reloadCommentList(this.pager.index);
            // setOrderMode(this.orderByLikes ? false : true);
        },
        changeWhiteList() {
            PUT(`${this.baseAPI}/meta/white-list/${this.openWhiteList ? "open" : "close"}`)
                .then(() => {
                    return this.reloadPower();
                })
                .then(() => {
                    this.commentPower.is_white = this.openWhiteList;
                    this.reloadCommentList(this.pager.index);
                })
                .catch(() => {});
        },
        setLikeComment(id, isLike) {
            var action = isLike ? "like" : "unlike";
            PUT(`${this.baseAPI}/comment/${id}/${action}`)
                .then(() => {
                    //  this.reloadCommentList(this.pager.index);
                })
                .catch(() => {});
        },
        setTopComment(id, setTop) {
            var action = setTop ? "set" : "cancel";
            PUT(`${this.baseAPI}/comment/${id}/top/${action}`)
                .then(() => {
                    this.reloadCommentList(this.pager.index);
                })
                .catch(() => {});
        },
        setStarComment(id, setStar) {
            var action = setStar ? "set" : "cancel";
            PUT(`${this.baseAPI}/comment/${id}/star/${action}`)
                .then(() => {
                    this.reloadCommentList(this.pager.index);
                })
                .catch(() => {});
        },
        setWhiteComment(id, setWhite) {
            // 设置某个评论为精选
            var action = setWhite ? "add" : "remove";
            PUT(`${this.baseAPI}/comment/${id}/white-list/${action}`)
                .then(() => {
                    this.reloadCommentList(this.pager.index);
                })
                .catch(() => {});
        },
        deleteComment(id) {
            DELETE(`${this.baseAPI}/comment/${id}`)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "删除成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right",
                    });
                    this.reloadCommentList(this.pager.index);
                })
                .catch(() => {});
        },
        hideComment(id) {
            PUT(`${this.baseAPI}/comment/${id}/hide`)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "操作成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right",
                    });
                    this.reloadCommentList(this.pager.index);
                })
                .catch(() => {});
        },
        handleCurrentChange(gotoIndex) {
            this.reloadCommentList(gotoIndex);
        },
        userSubmitInputForm(data) {
            POST(`${this.baseAPI}/comment`, null, data)
                .then((responseJSON) => {
                    if (responseJSON && ~~responseJSON.code > 0) {
                        this.$notify({
                            title: "评论失败",
                            message: responseJSON.msg || "",
                            type: "error",
                            duration: 3000,
                            position: "bottom-right",
                        });
                        return;
                    }
                    this.$notify({
                        title: "",
                        message: "评论成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right",
                    });
                    // 位于第一页时才去更新数据,否则没必要,等用户自己触发
                    if (this.pager.index == 1) {
                        this.reloadCommentList(this.pager.index);
                    }
                })
                .catch(() => {});
        },
        reloadPower() {
            GET(`${this.baseAPI}/i-am-author`)
                .then((power) => {
                    this.commentPower = power;
                    this.openWhiteList = power.is_white;
                })
                .catch(() => {});
        },
        toDetail(uid) {
            mobileOpen(authorLink(uid));
        },
        reloadCommentList(index, append = false) {
            if (this.loading) return;
            this.loading = true;
            let orderQuery = {};
            if (this.isDesc === "DESC") {
                orderQuery["desc"] = true;
            }
            orderQuery["orderby_likes"] = this.orderByLikes;
            GET(`${this.baseAPI}/comment/page/${index}`, orderQuery)
                .then((resp) => {
                    if (append && resp.data && resp.data.length) {
                        // 追加模式
                        this.commentList = [...this.commentList, ...resp.data];
                    } else {
                        // 替换模式（首次加载）
                        this.commentList = resp.data || [];
                    }
                    this.pager = resp.page;

                    // 判断是否还有更多数据
                    this.noMoreData = index >= this.pager.pageTotal;
                })
                .catch(() => {})
                .finally(() => {
                    this.loading = false;
                });
        },

        // 检查是否滚动到底部
        checkScrollBottom() {
            // 使用window作为滚动容器
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const clientHeight = document.documentElement.clientHeight;

            // 当滚动到距离底部100px时加载更多
            if (scrollHeight - scrollTop - clientHeight < 100 && !this.loading && !this.noMoreData) {
                this.loadMore();
            }
        },

        // 加载更多数据
        loadMore() {
            if (this.pager.index < this.pager.pageTotal) {
                this.reloadCommentList(this.pager.index + 1, true);
                this.pager.index++;
            }
        },

        // 添加滚动监听
        addScrollListener() {
            this.scrollListener = this.checkScrollBottom.bind(this);
            window.addEventListener("scroll", this.scrollListener);
        },

        // 移除滚动监听
        removeScrollListener() {
            if (this.scrollListener) {
                window.removeEventListener("scroll", this.scrollListener);
                this.scrollListener = null;
            }
        },
    },
    filters: {
        profileLink: function (uid) {
            return authorLink(uid);
        },
        showAvatar: function (val) {
            return showAvatar(val, 144);
        },
    },
    created() {
        this.baseAPI = `/api/comment/${this.category}/article/${this.id}`;
    },
    mounted() {
        getOrderMode()
            .then((mode) => {
                this.isDesc = mode;
            })
            .then(() => {
                this.reloadPower();
            })
            .finally(() => {
                this.reloadCommentList(1);
                // 添加滚动监听
                this.$nextTick(() => {
                    this.addScrollListener();
                });
            });
    },
    beforeDestroy() {
        // 组件销毁前移除监听
        this.removeScrollListener();
    },
};
</script>

<style lang="less">
.m-comment-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;
    .m-comment-item {
        display: flex;
        padding: var(--20, 20px);
        flex-direction: column;
        gap: var(--8, 8px);

        background: var(--primary-brand-4, #282828);

        .m-main-content {
            display: flex;
            flex-direction: column;
            gap: var(--8, 8px);

            .u-commenter-name {
                color: var(--secondary-cyan, #32ade6);
                font-size: 12px;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
            .u-comment-content {
                color: var(--black-80, rgba(28, 28, 28, 0.8));
                font-size: 14px;
                font-weight: 400;
                line-height: 20px; /* 142.857% */
            }
            .u-comment-time {
                color: var(--black-40, rgba(28, 28, 28, 0.4));
                font-size: 12px;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }

        .m-child-comment {
            display: flex;
            padding: 12px;
            flex-direction: column;
            gap: 10px;
            border-radius: 8px;
            background: var(--black-5, rgba(28, 28, 28, 0.05));
            .m-reply-item {
                // 超出长度不分词
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                .u-replier-name {
                    color: var(--secondary-cyan, #32ade6);
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px; /* 150% */
                    display: inline-block;
                    margin-right: 4px;
                }
                .u-reply {
                    color: var(--black-40, rgba(255, 255, 255, 0.4));
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px; /* 150% */
                    margin-right: 4px;
                }
                .u-reply-content {
                    color: var(--black-80, rgba(255, 255, 255, 0.8));
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 18px; /* 150% */
                    display: inline;
                }
            }
        }
    }

    .u-loading-more,
    .u-no-more {
        text-align: center;
        padding: 10px 0;
        color: var(--black-40, rgba(28, 28, 28, 0.4));
        font-size: 12px;
        font-weight: 400;
    }
}
</style>
