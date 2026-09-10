<template>
    <el-dialog v-model="show" class="m-wiki-diff-dialog" :title="title" :before-close="close" width="80%">
        <div class="m-contents">
            <div class="m-versions">
                <el-select v-model="version" :placeholder="$t('ui.common.placeholders.version')" style="width: 100%" clearable>
                    <el-option v-for="item in list" :label="item.version" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-select v-model="version1" :placeholder="$t('ui.common.placeholders.version')" style="width: 100%" clearable>
                    <el-option v-for="item in list" :label="item.version" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </div>
            <div v-if="isMobile" class="m-stacked-diff">
                <section v-for="side in ['old', 'new']" :key="side" class="m-version-panel" :class="'is-' + side">
                    <h3>{{ (side === 'old' ? filename : newFilename).trim() || $t('ui.common.placeholders.version') }}</h3>
                    <code-diff
                        :old-string="content"
                        :new-string="content1"
                        :context="Number.MAX_SAFE_INTEGER"
                        output-format="side-by-side"
                        :hide-header="true"
                        max-height="420px"
                    />
                </section>
            </div>
            <code-diff
                v-else
                class="m-content-view"
                :old-string="content"
                :new-string="content1"
                :context="1024"
                output-format="side-by-side"
                maxHeight="600px"
                :filename="filename"
                :newFilename="newFilename"
            ></code-diff>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close" plain>{{ $t("ui.common.actions.close") }}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { getWiki } from "@/service/wiki";
import cloneDeep from "lodash/cloneDeep";

import { CodeDiff } from "v-code-diff";
import { ts2str } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "WikiDiff",
    components: {
        CodeDiff,
    },
    props: ["visible", "data"],
    data() {
        return {
            loading: false,
            show: false,
            isMobile: window.matchMedia("(max-width: 720px)").matches,
            list: [],
            content: "",
            content1: "",
            version: "",
            version1: "",
        };
    },
    computed: {
        title() {
            return this.$t("ui.common.wiki.compareVersions");
        },
        filename() {
            const data = this.list.find((item) => item.id === this.version);
            return `${data?.version || ""} ${data?.user_nickname || ""} ${data?.remark || ""} ${
                data?.updated ? ts2str(data?.updated) : ""
            }`;
        },
        newFilename() {
            const data = this.list.find((item) => item.id === this.version1);
            return `${data?.version || ""} ${data?.user_nickname || ""} ${data?.remark || ""} ${
                data?.updated ? ts2str(data?.updated) : ""
            }`;
        },
    },
    watch: {
        visible: {
            handler: function (val) {
                this.show = val;
            },
            immediate: true,
        },
        data: {
            immediate: true,
            deep: true,
            handler(data) {
                this.list = cloneDeep(data)
                    .reverse()
                    .map((item, index) => {
                        return {
                            ...item,
                            version: `v${index + 1}`,
                        };
                    });
            },
        },
        version(id) {
            if (id) {
                this.load(id, "content");
            } else {
                this.content = "";
            }
        },
        version1(id) {
            if (id) {
                this.load(id, "content1");
            } else {
                this.content1 = "";
            }
        },
    },
    mounted() {
        this.mobileQuery = window.matchMedia("(max-width: 720px)");
        this.mobileQuery.addEventListener("change", this.updateLayout);
    },
    beforeUnmount() {
        this.mobileQuery?.removeEventListener("change", this.updateLayout);
    },
    methods: {
        updateLayout(event) {
            this.isMobile = event.matches;
        },
        load(id, key) {
            this.loading = true;
            getWiki(id)
                .then((res) => {
                    const content = res.data?.data?.post?.content || "";
                    this[key] = content;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        close() {
            this.show = false;
            this.$emit("close");
        },
    },
};
</script>

<style lang="less">
.m-wiki-diff-dialog {
    .el-dialog__body {
        padding-top: 10px;
    }
    .u-tip {
        margin-bottom: 10px;
    }
    .m-versions {
        margin: 10px 0;
        .flex;
        gap: 10px;
    }
}
@media screen and (max-width: 720px) {
    .m-wiki-diff-dialog.el-dialog {
        width: calc(100% - 24px);
        margin-top: 16px;
        border-radius: 12px;

        .m-versions {
            flex-direction: column;
        }

        .m-content-view {
            min-width: 0;
            max-width: 100%;
        }

        .m-stacked-diff {
            display: grid;
            gap: 16px;
        }

        .m-version-panel {
            min-width: 0;
            border: 1px solid #e4e7ed;
            border-radius: 8px;
            overflow: hidden;

            h3 {
                margin: 0;
                padding: 10px 12px;
                background: #f6f7fa;
                border-bottom: 1px solid #e4e7ed;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.6;
                white-space: normal;
                overflow-wrap: anywhere;
            }

            .code-diff-view { margin: 0; border: 0; border-radius: 0; }
            .diff-table { table-layout: fixed; }
            .blob-num { min-width: 32px; padding: 0 5px; font-size: 11px; }
            .blob-code { padding: 0 8px; font-size: 12px; }
            .blob-code-inner { white-space: pre-wrap; overflow-wrap: anywhere; }

            &.is-old {
                col:nth-child(n + 3), td:nth-child(n + 3) { display: none; }
                col:first-child { width: 32px; }
            }
            &.is-new {
                col:nth-child(-n + 2), td:nth-child(-n + 2) { display: none; }
                col:nth-child(3) { width: 32px; }
            }
        }

        .file-header .file-info,
        .file-header .diff-commandbar,
        .file-header .diff-stat {
            flex-wrap: wrap;
            gap: 6px 12px;
        }

        .file-header .info-left,
        .file-header .info-right {
            min-width: 0;
            overflow-wrap: anywhere;
        }

        .file-header {
            font-size: 12px;
        }
    }
}
</style>
