<template>
    <WikiPanel class="c-wiki-revisions" scene="detail">
        <template #head-title>
            <LegacyIcon class="el-icon-time" />
            <span>历史版本</span>
        </template>
        <template #head-actions>
            <span class="el-button el-button--primary" @click="visible = true">
                <LegacyIcon class="el-icon-crop" />
                <span>版本对比</span>
            </span>
        </template>
        <template #body>
            <div class="m-revisions-panel">
                <div class="u-empty" v-if="!versions || !versions.length">
                    <span v-if="versions === null">🎉 数据加载中...</span>
                    <span v-if="versions === false">⚠️ 数据加载异常</span>
                    <span v-if="versions && !versions.length">💧 暂无数据</span>
                </div>
                <table v-if="versions && versions.length" class="m-histories">
                    <thead>
                        <tr>
                        <th>版本</th>
                        <th>更新时间</th>
                        <th>贡献者</th>
                        <th>修订说明</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="history" v-for="(ver, key) in versions" :key="key">
                        <td>
                            <a
                                :href="link(type, `${ver.source_id}/${ver.id}`)"
                                v-text="'v' + ver.v"
                                @click="redirectRevision(ver, $event)"
                            ></a>
                        </td>
                        <td v-text="ts2str(ver.updated)"></td>
                        <td>
                            <a :href="ver.user_id ? author_url(ver.user_id) : null" v-text="ver.user_nickname"></a>
                        </td>
                        <td v-text="ver.remark"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="u-op" v-if="remainVersions.length" @click="onToggle">
                    <div class="u-btn">
                        <LegacyIcon :class="isExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
                        {{ isExpand ? "折叠" : "展开" }}
                    </div>
                </div>
            </div>
            <WikiDiff v-if="visible" :visible="visible" :data="versions" @close="visible = false"></WikiDiff>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "@/components/wiki-panel.vue";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { getLink, authorLink, ts2str } from "@jx3box/jx3box-common/js/utils";
import { __Root, __OriginRoot } from "@/utils/config";
import WikiDiff from "./wiki-diff.vue";

export default {
    name: "WikiRevisions",
    components: {
        WikiPanel,
        WikiDiff,
    },
    props: ["type", "sourceId", "isGame"],
    data: function () {
        return {
            originData: [],
            defaultNum: 5,
            visible: false,
            isExpand: false,
        };
    },
    computed: {
        client: function () {
            return this.$route?.query?.L === "classic_yq" ? "origin" : "std";
        },
        baseUrl: function () {
            return this.client == "origin" ? __OriginRoot : __Root;
        },
        prefix: function () {
            if (this.isGame) {
                return this.baseUrl.slice(0, -1);
            } else {
                return "";
            }
        },
        versions() {
            const list = this.originData;
            if (!this.isExpand && list.length > 5) {
                return list.slice(0, this.defaultNum);
            }
            return list;
        },
        remainVersions() {
            const list = this.originData;
            if (list.length > 5) {
                return list.slice(this.defaultNum);
            }
            return [];
        },
    },
    methods: {
        fetchVersions() {
            if (!this.type || !this.sourceId) {
                this.originData = [];
                return;
            }
            wiki.versions({ type: this.type, id: this.sourceId }, { client: this.client }).then(
                (res) => {
                    const data = res.data?.data || [];
                    this.originData = data.map((item, index) => {
                        return {
                            ...item,
                            v: data.length - index,
                        };
                    });
                },
                () => {
                    this.originData = [];
                }
            );
        },
        onToggle() {
            this.isExpand = !this.isExpand;
        },
        link: function (type, id) {
            return this.prefix + getLink(type, id);
        },
        author_url: function (uid) {
            return this.prefix + authorLink(uid);
        },
        ts2str,
        redirectRevision: function (ver, e) {
            if (!this.isGame && this.$router) {
                e.preventDefault();
                this.$router.replace({ path: `/view/${ver.source_id}/${ver.id}` });
            }
        },
    },
    watch: {
        sourceId: {
            immediate: true,
            handler() {
                this.fetchVersions();
            },
        },
        type() {
            this.fetchVersions();
        },
    },
};
</script>

<style lang="less">
@import "~@jx3box/jx3box-ui/assets/css/wiki/wiki-revisions.less";
</style>
