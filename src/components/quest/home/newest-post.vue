<template>
    <div class="m-newest-post m-posts">
        <div class="m-post" v-for="(post, key) in data" :key="key">
            <div class="m-head">
                <div class="u-post">
                    <div class="u-info">
                        <img class="u-icon" :src="icon_url(245)" />
                        <router-link
                            class="u-name"
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
                    </div>
                    <div class="u-level">{{ $t("ui.common.labels.comprehensiveDifficulty") }}{{ star(post.level) }}</div>
                    <div class="u-remark" v-if="post.remark" v-text="'📑 ' + post.remark"></div>
                </div>
                <div class="m-user">
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
            <div class="m-body">
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
            return name || this.$t("ui.quest.unknownQuest");
        },
    },
};
</script>
