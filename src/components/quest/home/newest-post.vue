<template>
    <div class="m-newest-post">
        <div class="u-post" v-for="(post, key) in data" :key="key">
            <div class="u-post-head">
                <div class="u-quest">
                    <img class="u-icon" :src="icon_url(245)" />
                    <router-link
                        class="u-quest-name"
                        :to="{
                            name: 'view',
                            params: {
                                quest_id: post.source_id,
                                post_id: post.id,
                            },
                        }"
                        target="_blank"
                        >{{ questName(post.title) }}</router-link
                    >
                    <div class="u-quest-level" v-text="'综合难度：' + star(post.level)"></div>
                    <div class="u-post-remark" v-if="post.remark" v-text="'📑 ' + post.remark"></div>
                </div>
                <div class="u-post-user">
                    <div class="u-author">
                        <img class="u-icon" :src="showAvatar(post.user)" :alt="post.user_nickname" />
                        <a
                            :href="post.user_id ? authorLink(post.user_id) : null"
                            class="u-name"
                            v-text="post.user_nickname"
                            target="_blank"
                        ></a>
                    </div>
                    <div class="u-updated" v-text="ts2str(post.updated)"></div>
                </div>
            </div>
            <div class="u-post-body">
                <div
                    class="u-excerpt"
                    :to="{
                        name: 'view',
                        params: { quest_id: post.source_id },
                    }"
                    v-html="ellipsis(post.content)"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import { authorLink, ts2str, iconLink, showAvatar, getLink } from "@jx3box/jx3box-common/js/utils";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import { ellipsis } from "@/utils/common";

export default {
    name: "NewestPost",
    data() {
        return {
            data: [],
        };
    },
    mounted() {
        this.getData();
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        icon_url: iconLink,
        authorLink,
        ts2str,
        iconLink,
        showAvatar: function (user) {
            const val = user?.user_avatar || "";
            return showAvatar(val);
        },
        getLink,
        async getData() {
            wiki.latest({ type: "quest" }).then(
                (res) => {
                    this.data = res.data.data?.list ?? [];
                },
                () => {
                    this.data = [];
                }
            );
        },
        star(level) {
            return "⭐️".repeat(level ? level : 1);
        },
        ellipsis,
        questName(name) {
            return name || "未知任务";
        },
    },
};
</script>

<style lang="less" scoped>
@import "~@/assets/css/quest/home/newest-post.less";
</style>
