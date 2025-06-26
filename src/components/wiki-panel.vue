<template>
    <div
        class="c-wiki-panel"
        :class="{
            'border-none': borderNone,
            'm-detail-scene': wikiPost || scene === 'detail',
        }"
    >
        <div class="m-panel-head">
            <slot name="head-before"></slot>
            <div class="m-panel-actions">
                <!-- <el-button class="u-push" v-if="wikiPost && isEditor" type="warning" @click="onPush">
                    <i class="el-icon-position"></i>
                    推送</el-button
                > -->
                <QRcode v-if="wikiPost && showQR" class="u-qr" />
                <slot name="head-actions"></slot>
            </div>
            <div class="m-panel-title">
                <slot name="head-title"></slot>
            </div>
            <slot name="head-after"></slot>
        </div>
        <div class="m-panel-body">
            <slot name="body-before"></slot>
            <slot name="meta">
                <div class="m-wiki-metas" v-if="wikiPost && wikiPost.post">
                    <!-- 参与贡献 -->
                    <div class="u-meta" v-if="wikiPost.users && wikiPost.users.length">
                        <em class="u-label">参与贡献</em>
                        <a
                            class="u-value u-creator"
                            v-for="(user, key) in wikiPost.users.slice(0, 5)"
                            :key="key"
                            target="_blank"
                            :href="user.id ? author_url(user.id) : null"
                        >
                            <img :src="thumbnail_url(user.avatar)" :alt="user.nickname" :title="user.nickname" />
                        </a>
                        <span v-if="wikiPost.users.length > 5" class="u-more">+{{ wikiPost.users.length - 5 }}人</span>
                    </div>
                    <!-- 综合难度 -->
                    <div class="u-meta" v-if="wikiPost.post && wikiPost.post.level">
                        <em class="u-label">综合难度</em>
                        <span class="u-value">
                            <i class="el-icon-star-on" v-for="i in wikiPost.post.level" :key="i"></i>
                        </span>
                    </div>
                    <!-- 热度 -->
                    <div class="u-meta" v-if="stat">
                        <em class="u-label">热度</em>
                        <span class="u-value" v-text="stat.views"></span>
                    </div>
                    <!-- 更新时间 -->
                    <div class="u-meta" v-if="wikiPost.post && wikiPost.post.updated">
                        <em class="u-label">更新时间</em>
                        <span class="u-value" v-text="ts2str(wikiPost.post.updated)"></span>
                    </div>
                </div>
            </slot>
            <slot name="body"></slot>
            <slot name="body-after"></slot>
        </div>
        <design-task v-model="showDesignTask" :post="currentPost"></design-task>
    </div>
</template>

<script>
import _ from "lodash";
import QRcode from "@/components/common/qr-code";
import { authorLink, ts2str, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { getStat } from "@jx3box/jx3box-common/js/stat";
import DesignTask from "@jx3box/jx3box-common-ui/src/bread/DesignTask.vue";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "WikiPanel",
    props: {
        wikiPost: {
            type: [Object, String],
            default: null,
        },
        scene: {
            type: String,
            default: "default",
        },
        borderNone: {
            type: Boolean,
            default: false,
        },
        showQR: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            stat: null,
            showDesignTask: false,
            currentPost: {},
            isEditor: User.isEditor(),
        };
    },
    watch: {
        wikiPost: {
            immediate: true,
            handler() {
                if (!this.wikiPost) return;
                // 获取热度信息
                if (this.wikiPost.type && this.wikiPost.source_id) {
                    let type = this.wikiPost.type;
                    if (type === "achievement") type = "cj";
                    getStat(type, this.wikiPost.source_id).then((data) => {
                        if (data.status === 200) this.stat = data.data;
                    });
                }
            },
        },
    },
    methods: {
        author_url: authorLink,
        ts2str,
        thumbnail_url: function (val) {
            return showAvatar(val);
        },
        onPush() {
            this.showDesignTask = true;
            this.currentPost = {
                ...(this.wikiPost?.post || {}),
                post_title: this.wikiPost?.post?.title,
                post_type: this.wikiPost?.post?.type,
                ID: this.wikiPost?.post?.source_id,
            };
        },
    },
    components: {
        QRcode,
        DesignTask,
    },
    mounted() {},
};
</script>

<style lang="less">
@import "~@/assets/css/wiki-panel.less";
</style>
