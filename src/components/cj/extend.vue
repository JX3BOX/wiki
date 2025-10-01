<template>
    <div class="m-right-side" :class="{ isHome: isHome }">
        <SideMsg></SideMsg>
        <!-- 贡献排行榜 -->
        <Rank></Rank>

        <div class="m-group">
            <h2 class="m-title">
                <img class="u-icon" svg-inline src="@/assets/img/cj/puzzle.svg" />
                <span class="u-text">各区服成就群</span>
                <a class="u-show-message" target="_blank" href="https://www.jx3box.com/tool/13659/">申请展示 »</a>
            </h2>
            <div class="m-group-content">
                <!-- <el-tree
                    class="m-group-tree"
                    :default-expand-all="false"
                    :data="groups"
                    node-key="uuid"
                    @node-click="clickNode"
                /> -->
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item
                        :title="group.label"
                        :name="group.label"
                        v-for="group in groups"
                        :key="group.uuid"
                    >
                        <div class="u-zones" v-for="zone in group.children" :key="zone.uuid">
                            <el-tag class="u-zone" size="mini">{{ zone.label }}</el-tag>
                            <span
                                size="mini"
                                class="u-qq"
                                v-for="qq in zone.children"
                                :key="qq.uuid"
                                @click="copy(qq.label)"
                                >{{ qq.label }}</span
                            >
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
import { getMenuGroup } from "@/service/group";
import { __ossRoot, __ossMirror } from "@/utils/config";
import SideMsg from "@/components/common/side-msg.vue";
import Rank from "@/components/common/rank.vue";
import { v4 as uuid } from "uuid";

export default {
    name: "Extend",
    components: {
        SideMsg,
        Rank,
    },
    props: {
        type: {
            type: String,
            default: "achievement",
        },
    },
    data() {
        return {
            ranks: [],
            groups: [],
            isHome: true,

            activeName: "",
            qq: "614370825",
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
    },
    methods: {
        clickNode(data) {
            if (!data.children) {
                const val = data.label;
                this.copy(val);
            }
        },
        copy(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: text,
                    type: "success",
                });
            });
        },
        copy_success() {
            this.$notify({ title: "复制成功", type: "success" });
        },
        copy_error() {
            this.$notify({ title: "浏览器不支持", type: "error" });
        },
        checkIsHome: function () {
            this.isHome = this.$route.name == "home" || !this.$route.name;
        },
        onQQClick() {
            navigator.clipboard.writeText(this.qq).then(() => {
                this.$notify({
                    title: "复制成功",
                    message: "内容：" + this.qq,
                    type: "success",
                });
            });
        },
        loadGroups() {
            getMenuGroup("wiki_cj_group").then((res) => {
                const groups = res.data?.data?.menus || [];
                const newGroups = groups.map((item) => {
                    return {
                        zone: item.label.split("/")[0],
                        server: item.label.split("/")?.[1] || "",
                        children: item.link.split("/"),
                        priority: item.priority,
                    };
                });
                this.groups = this.convertToTree(newGroups);
            });
        },
        convertToTree(data) {
            const tree = {};

            data.forEach((item) => {
                const zone = item.zone;

                if (!tree[zone]) {
                    tree[zone] = {
                        label: zone,
                        children: [],
                        uuid: uuid(),
                    };
                }

                const serverNode = {
                    label: item.server,
                    children: item.children.map((val) => {
                        return {
                            label: val,
                            uuid: uuid(),
                        };
                    }),
                    priority: item.priority,
                    uuid: uuid(),
                };

                tree[zone].children.push(serverNode);
            });

            return Object.values(tree);
        },
    },
    mounted() {
        // 获取成就群
        this.loadGroups();
        this.checkIsHome();
    },
    watch: {
        "$route.name": function () {
            this.checkIsHome();
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/right-side.less";
.m-group-tree {
    .is-leaf + .el-tree-node__label:before {
        content: "»";
        color: #3d454d;
        margin-right: 5px;
    }
}
</style>
