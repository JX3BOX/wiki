<template>
    <!-- 模仿公共库版本加了DIFF功能，公共库部分用于pvx项目 -->
    <WikiPanel class="c-wiki-revisions" scene="detail">
        <template #head-title>
            <LegacyIcon class="u-icon el-icon-time" />
            <span class="u-txt">{{ $t("ui.common.wiki.revisions") }}</span>
        </template>
        <template #head-actions>
            <button
                type="button"
                class="u-btn--link el-button el-button--primary u-wiki-action"
                :aria-label="$t('ui.common.wiki.compareVersions')"
                :title="$t('ui.common.wiki.compareVersions')"
                @click="visible = true"
            >
                <LegacyIcon class="el-icon-crop" aria-hidden="true" />
                <span class="u-wiki-action-label">{{ $t("ui.common.wiki.compareVersions") }}</span>
            </button>
        </template>
        <template #body>
            <div class="m-revisions-panel">
                <div class="u-empty" v-if="!versions || !versions.length">
                    <span v-if="versions === null">{{ $t("ui.common.status.loading") }}</span>
                    <span v-if="versions === false">{{ $t("ui.common.status.loadFailed") }}</span>
                    <span v-if="versions && !versions.length">{{ $t("ui.common.status.noData") }}</span>
                </div>
                <table v-if="versions && versions.length" class="m-histories">
                    <thead>
                        <tr>
                            <th>{{ $t("ui.common.labels.version") }}</th>
                            <th>{{ $t("ui.common.labels.updatedTime") }}</th>
                            <th>{{ $t("ui.common.labels.contributor") }}</th>
                            <th>{{ $t("ui.common.labels.revisionNote") }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="history" v-for="(ver, key) in versions" :key="key">
                            <td :data-label="$t('ui.common.labels.version')">
                                <a
                                    :href="link(type, `${ver.source_id}/${ver.id}`)"
                                    v-text="'v' + ver.v"
                                    @click="redirectRevision(ver, $event)"
                                ></a>
                            </td>
                            <td :data-label="$t('ui.common.labels.updatedTime')" v-text="ts2str(ver.updated)"></td>
                            <td :data-label="$t('ui.common.labels.contributor')">
                                <a :href="ver.user_id ? author_url(ver.user_id) : null" v-text="ver.user_nickname"></a>
                            </td>
                            <td :data-label="$t('ui.common.labels.revisionNote')" v-text="ver.remark"></td>
                        </tr>
                    </tbody>
                </table>
                <div class="u-op" v-if="remainVersions.length" @click="onToggle">
                    <div class="u-btn">
                        <LegacyIcon :class="isExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
                        {{ isExpand ? $t("ui.common.wiki.collapse") : $t("ui.common.wiki.expandAll") }}
                    </div>
                </div>
            </div>
            <WikiDiff v-if="visible" :visible="visible" :data="versions" @close="visible = false"></WikiDiff>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "@/components/common/wiki-panel.vue";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
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
            return this.$route?.query?.L === "classic_yq" || this.globalClient === "origin" ? "origin" : "std";
        },
        globalClient: function () {
            return this.$store.state.client;
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

.c-wiki-revisions {
    .m-revisions-panel .u-op {
        display: flex;
        justify-content: center;
        margin-top: 16px;
    }

    .m-revisions-panel .u-op .u-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        min-height: 32px;
        padding: 0 18px;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        color: #303133;
        background: #f4f6fb;
        border: 1px solid #e4e7ed;
        border-radius: 2px;
        box-shadow: none;
        transition: all 0.2s ease;
        font-size: 13px;
    }

    .m-revisions-panel .u-op .u-btn:hover {
        color: var(--el-color-primary);
        background: #eef3ff;
        border-color: #c6d4ff;
    }

    .m-revisions-panel .u-op .u-btn .legacy-icon,
    .m-revisions-panel .u-op .u-btn [data-legacy-icon] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        color: inherit;
        fill: currentColor;
        margin-right: 0 !important;
    }

    @media screen and (max-width: 480px) {
        .m-revisions-panel {
            overflow-x: visible;
        }

        .m-histories {
            display: block;
            width: 100%;
            margin: 0;

            thead {
                display: none;
            }

            tbody {
                display: grid;
                gap: 10px;
            }

            tr {
                display: grid;
                grid-template-columns: 48px minmax(86px, 1fr) minmax(72px, 1fr);
                border: 1px solid #e4e7ed;
                border-radius: 6px;
                background: #fff;
                overflow: hidden;
            }

            td {
                display: flex;
                min-width: 0;
                padding: 8px;
                border: 0;
                flex-direction: column;
                gap: 2px;
                overflow-wrap: anywhere;

                &::before {
                    content: attr(data-label);
                    color: #909399;
                    font-size: 11px;
                    line-height: 1.4;
                    white-space: nowrap;
                }

                &:nth-child(-n + 3) {
                    white-space: nowrap;
                    overflow: hidden;
                }

                &:nth-child(-n + 3) > a {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                &:nth-child(4) {
                    grid-column: 1 / -1;
                    padding-top: 7px;
                    border-top: 1px solid #ebeef5;
                }
            }
        }
    }
}
</style>
