<template>
    <div class="m-knowledge-panel">
        <div class="m-title m-recent-title">
            <span class="u-title-left"><LegacyIcon class="el-icon-time" /><span> 最新更新</span></span>
        </div>
        <div class="m-recent m-panel">
            <div class="m-post" v-for="(post, key) in list" :key="key">
                <div class="m-head">
                    <div class="m-source">
                        <div class="u-source">
                            <img class="u-icon" svg-inline src="../../assets/img/knowledge.svg" />
                            <router-link class="u-name" :to="{ name: 'view', params: { source_id: post.source_id } }">{{
                                post.title
                            }}</router-link>
                        </div>
                        <div class="u-remark" v-if="post.remark" v-text="'📑 ' + post.remark"></div>
                    </div>
                </div>
                <div class="m-user">
                    <div class="u-author">
                        <img class="u-icon" :src="showAvatar(post.user)" :alt="post.user_nickname" />
                        <a
                            :href="post.user_id ? authorLink(post.user_id) : null"
                            class="u-name"
                            v-text="post.user_nickname"
                        ></a>
                    </div>
                    <div class="u-updated" v-text="ts2str(post.updated)"></div>
                </div>
                <div class="m-body">
                    <div
                        class="u-excerpt"
                        :to="{ name: 'view', params: { source_id: post.source_id } }"
                        v-html="ellipsis(post.content)"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { authorLink, ts2str, showAvatar } from "@jx3box/jx3box-common/js/utils";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import { ellipsis } from "@/utils/common";
export default {
    name: "Recent",
    data: function () {
        return {
            list: [],
        };
    },
    computed: {},
    watch: {},
    methods: {
        // 获取最新帖子数据
        getRecentData() {
            wiki.latest({ type: "knowledge" }, { client: null }).then(
                (res) => {
                    this.list = res.data.data?.list ?? [];
                },
                () => {
                    this.list = [];
                }
            );
        },

        showAvatar: function (user) {
            const val = user?.user_avatar || "";
            return showAvatar(val);
        },
        ts2str,
        authorLink,
        ellipsis,
    },
    created: function () {
        this.getRecentData();
    },
};
</script>
<style scoped lang="less">
.m-knowledge-panel .m-recent-title {
    margin-bottom: 0;
}
.m-recent {
    .m-post {
        .fz(12px);
        .clip;
        padding: 15px 10px;
        border-bottom: 1px solid #ccc;
        .m-head {
            margin-top: 5px;
        }
        &:last-child {
            border-bottom: none;
        }
        .u-icon {
            .dbi;
            .w(20px);
            .r(3px);
            vertical-align: middle;
        }
        .u-name {
            .dbi;
            .ml(8px);
            vertical-align: middle;
            &:not([href]) {
                color: #3d454d;
            }
            .underline(@color-link);
        }
        .m-achievement {
            .mt(5px);
        }
        .u-author,
        .u-updated,
        .u-source,
        .u-remark {
            .mr(15px);
            display: inline-block;
            vertical-align: middle;
        }
        .m-user {
            .x(left);
            padding-bottom: 5px;
        }
        .u-updated {
            // .fr;
            .mr(0);
            opacity: 0.75;
        }
        .u-remark {
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .u-excerpt {
            margin-top: 5px;
            margin-bottom: 5px;
            .db;
            .lh(1.6);
            color: #999;
        }
    }
}
</style>
