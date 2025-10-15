<template>
    <el-col class="m-post">
        <div class="m-head">
            <div class="m-achievement">
                <div class="u-achievement">
                    <img
                        class="u-icon"
                        :src="icon_url(post.source_icon_id)"
                        @error.once="$event.target.src = icon_url('')"
                    />
                    <router-link
                        class="u-name"
                        :to="{
                            name: 'view',
                            params: {
                                source_id: post.source_id,
                            },
                        }"
                        :target="isPhone ? '_self' : '_blank'"
                        >{{ post.title }}</router-link
                    >
                </div>
                <div class="u-level" v-text="'综合难度：' + star(post.level)"></div>
                <div class="u-remark" v-if="post.remark" v-text="'📑 ' + post.remark"></div>
            </div>
            <div class="m-user">
                <div class="u-author">
                    <img class="u-icon" :src="showAvatar(post.user)" :alt="post.user_nickname" />
                    <a
                        :href="post.user_id ? author_url(post.user_id) : null"
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
                    params: { source_id: post.source_id },
                }"
                v-html="ellipsis(post.content)"
            ></div>
        </div>
    </el-col>
</template>

<script>
import { authorLink, ts2str, iconLink, showAvatar, getLink } from "@jx3box/jx3box-common/js/utils";
import star from "@/utils/star";
import { ellipsis } from "@/utils/common";
export default {
    name: "WikiPostItem",
    props: {
        post: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isPhone: window.innerWidth <= 768,
        }
    },
    methods: {
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
        star,
        ellipsis,
        ts2str,
        author_url: authorLink,
        showAvatar: function (user) {
            const val = user?.user_avatar || "";
            return showAvatar(val);
        },
    },
};
</script>
