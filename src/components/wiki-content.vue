<template>
    <WikiPanel v-if="wiki_post" :wiki-post="wiki_post" class="m-wiki-content">
        <template slot="head-title">
            <div class="u-label" v-if="wikiPost.source">
                <img
                    class="u-icon"
                    :src="icon_url(wikiPost.source.IconID)"
                    @error.once="
                        () => {
                            $event.target.src = icon_url();
                        }
                    "
                />
                <span class="u-text" v-text="wikiPost.source.Name"></span>
            </div>
            <div class="u-zhtr" @click="isTW = !isTW">
                <i class="el-icon-guide"></i>
                <span>[</span>
                <span v-if="isTW" class="u-tr">繁體</span>
                <span v-else class="u-cn">简体</span>
                <span>]</span>
            </div>
        </template>
        <template slot="head-actions">
            <el-button v-if="!isEditMode" type="primary" class="u-edit" @click="editHandler">
                <i class="el-icon-edit"></i>
                <span>编辑修订</span>
            </el-button>
            <el-button v-else class="u-edit" @click="isEditMode = false">
                <i class="el-icon-back"></i>
                <span>取消修订</span>
            </el-button>
        </template>
        <template slot="body">

            <div class="m-wiki-compatible" v-if="compatible && !isEditMode">
                <i class="el-icon-warning-outline"></i> 暂无缘起攻略，以下为重制攻略，仅作参考，<a
                    :href="publish_url(`${wiki_post.type}/${wikiPost.source_id}`)"
                    >参与修订</a
                >。
            </div>

            <!-- Tips -->
            <div class="m-tips" v-if="isEditMode">
                游戏内仅支持简易文本修订,如需上传图片等,请至
                <a :href="rootPath">JX3BOX网站</a>
                操作
            </div>


            <!-- Article -->
            <template v-if="wiki_post.source">
                <div class="u-content" v-if="content || (!content && isEditMode)">
                    <Article
                        id="content"
                        v-if="isEditMode || !isTW"
                        :content="content || '<div>&nbsp;</div>'"
                        :pageable="false"
                        :contenteditable="isEditMode"
                        :class="{ 'u-editable': isEditMode }"
                    />
                    <Article id="content-tw" v-else :content="cn2tw(content)" :pageable="false" />
                </div>
                <div v-else class="u-empty">
                    <i class="el-icon-s-opportunity"></i>
                    <span>
                        暂无百科攻略，我来
                        <span class="u-edit" @click="editHandler">完善攻略</span>
                    </span>
                </div>
            </template>

            <!-- Publish -->
            <div class="m-publish" v-if="isEditMode">
                <div class="m-other-fields">
                    <div class="u-level">
                        <span>难度(1-5)：</span>
                        <input type="number" id="level" min="1" max="5" v-model="publish.level" />
                    </div>
                    <div class="u-author">
                        <span>昵称：</span>
                        <input type="text" id="author" v-model="publish.author" autocomplete="off" />
                    </div>
                    <div class="u-remark">
                        <span>修订说明：</span>
                        <input type="text" id="remark" v-model="publish.remark" autocomplete="off" />
                    </div>
                </div>
                <div class="u-btn">
                    <el-button size="mini" type="primary" @click="submitHanlder">提交</el-button>
                    <el-button size="mini" @click="cancelHandler">取消</el-button>
                </div>
            </div>
        </template>
    </WikiPanel>
</template>

<script>
import _ from "lodash";
import Utils from "@jx3box/jx3box-common/js/utils";
import cn2tw from "@/utils/cn2tw";
import player_name from "@/utils/player-name";
import star from "@/utils/star";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import WikiPanel from "@/components/wiki-panel.vue";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2.js";
import { getTypeLabel, iconLink, publishLink } from "@jx3box/jx3box-common/js/utils";
import { __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "WikiContent",
    props: ["wikiPost", "compatible"],
    data() {
        return {
            wiki_post: this.wikiPost,
            isEditMode: false,
            isTW: false,

            publish: {
                level: 1,
                author: player_name(),
                remark: "",
            },

            params: new URLSearchParams(location.search),
        };
    },
    computed: {
        content() {
            let post = _.get(this.wiki_post, "post");
            if (!post) return "";
            let content = _.get(post, "content");
            if (!content) return "";
            content = Utils.resolveImagePath(content);
            content = content.replace(/(<p>)?\s*◆成就难度 [★]+\s*(<\/p>)?/gi, "");
            content = content.replace(/(<p>)?\s*◆花费时长 [★]+\s*(<\/p>)?/gi, "");
            content = content.replace(/(<p>)?\s*◆成就攻略\s*(<\/p>)?/gi, "");
            return content ? content.trim() : "";
        },
        client: function () {
            let client = this.params.get("L") == "classic_yq" ? "origin" : "std";
            return client;
        },
        clientID: function () {
            let clientID = this.params.get("L") == "classic_yq" ? "2" : "1";
            return clientID;
        },
        rootPath: function () {
            return this.client == "origin" ? __OriginRoot : __Root;
        },
    },
    methods: {
        publish_url: function (path) {
            return this.rootPath + publishLink(path).slice(1);
        },
        cn2tw,
        star,
        getTypeLabel,
        icon_url: iconLink,
        editHandler(e) {
            e.preventDefault();
            this.isTW = false;
            this.isEditMode = true;
        },
        cancelHandler(e) {
            e.preventDefault();
            this.isEditMode = false;
        },
        submitHanlder(e) {
            e.preventDefault();

            if (!this.publish.remark) {
                this.$message({
                    message: "请简单描述本次修订说明",
                    type: "warning",
                });
                return;
            }
            const data = {
                source_id: this.wiki_post.source_id,
                level: this.publish.level,
                user_nickname: this.publish.author,
                content: document.getElementById("c-article").innerHTML,
                remark: this.publish.remark,
            }
            wiki.post({ type: this.wiki_post.type, ...data, client: this.client }).then((res) => {
                res = res.data;
                this.$message({
                    message: "提交成功，请等待审核",
                    type: "success",
                });
                this.publish = {
                    level: 1,
                    author: player_name(),
                    remark: "",
                };
                this.isEditMode = false;
            });
        },
    },
    watch: {
        isEditMode(val) {
            if (!val) return
            // 获取最新攻略
            if (this.wiki_post && this.wiki_post.type && this.wiki_post.source_id) {
                wiki.get({ type: this.wiki_post.type, id: this.wiki_post.source_id }, { client: this.client }).then(
                    (res) => {
                        res = res.data;
                        this.wiki_post = res.data;
                        this.publish.level = _.get(this, "wiki_post.post.level") || 1;
                    }
                );
            }
        },
        wikiPost: {
            deep: true,
            handler(val) {
                this.wiki_post = val;
            },
        },
    },
    components: {
        Article,
        WikiPanel,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/game/wiki-content.less";
</style>
