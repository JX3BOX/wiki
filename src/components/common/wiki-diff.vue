<template>
    <el-dialog v-model="show" class="m-wiki-diff-dialog" :title="title" :before-close="close" width="80%">
        <div class="m-contents">
            <div class="m-versions">
                <el-select v-model="version" placeholder="版本选择" style="width: 100%" clearable>
                    <el-option v-for="item in list" :label="item.version" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-select v-model="version1" placeholder="版本选择" style="width: 100%" clearable>
                    <el-option v-for="item in list" :label="item.version" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </div>
            <code-diff
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
                <el-button @click="close" plain>关闭</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { getWiki } from "@/service/wiki";
import { cloneDeep } from "lodash";

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
            list: [],
            content: "",
            content1: "",
            version: "",
            version1: "",
        };
    },
    computed: {
        title() {
            return "版本对比";
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
    methods: {
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
</style>
