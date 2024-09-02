<template>
    <div class="m-home-view">
        <WikiPanel :border-none="true" class="u-qlinks-box">
            <template slot="head-title">
                <i class="el-icon-location-information"></i>
                <span>便捷入口</span>
            </template>
            <!-- <template slot="head-actions">
                <a class="other" target="_blank" :href="feedback">反馈建议 &raquo;</a>
            </template> -->
            <template slot="body">
                <ul class="u-qlinks">
                    <li class="u-qlink">
                        <a style="background-color: #fe7979" target="_blank" href="/tool/9126/">
                            <i class="el-icon-trophy"></i>
                            <span>游戏内看百科</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <Counter></Counter>
                    </li>
                    <li class="u-qlink">
                        <a target="_blank" :href="hiddenAchievementsPostLink" style="background-color: #f7b044">
                            <i class="el-icon-medal"></i>
                            <span>隐藏成就</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a target="_blank" href="/adventure">
                            <i class="el-icon-ice-drink"></i>
                            <span>奇遇大全</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a target="_blank" href="/pet">
                            <i class="el-icon-grape"></i>
                            <span>宠物大全</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a target="_blank" href="/horse">
                            <i class="el-icon-watermelon"></i>
                            <span>坐骑大全</span>
                        </a>
                    </li>
                    <li class="u-qlink">
                        <a target="_blank" href="/furniture">
                            <i class="el-icon-cherry"></i>
                            <span>家具大全</span>
                        </a>
                    </li>
                    <!-- <li class="u-qlink">
                        <a target="_blank" href="/book">
                            <i class="el-icon-orange"></i>
                            <span>书籍大全</span>
                        </a>
                    </li> -->
                </ul>
            </template>
        </WikiPanel>

        <WikiPanel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-notebook-1"></i>
                <span>热门成就</span>
            </template>
            <template slot="body">
                <div class="m-achievement-slider">
                    <el-carousel height="66px" direction="vertical" indicator-position="none">
                        <el-carousel-item v-for="(items, key) in hot_achievements" :key="key" class="m-carousel m-hot">
                            <el-row :gutter="20">
                                <template v-for="(item, k) in items">
                                    <el-col :md="8" v-if="item" :key="k">
                                        <WikiItem :class="`u-item-${k}`" :item="item"></WikiItem>
                                        <!--  <router-link
                                            class="u-item u-item-new"
                                            :class="`u-item-${k}`"
                                            :to="{
                                                name: 'view',
                                                params: { source_id: item.ID },
                                            }"
                                        >
                                            <div class="u-icon">
                                                <img
                                                    :src="icon_url(item.IconID)"
                                                    @error.once="
                                                        () => {
                                                            $event.target.src = icon_url();
                                                        }
                                                    "
                                                />
                                            </div>
                                            <div class="m-carousel-content">
                                                <span class="u-title">
                                                    <i class="el-icon-medal"></i>
                                                    <span v-text="` ${item.Name}`"></span>
                                                </span>
                                                <span class="u-desc">
                                                    <i class="el-icon-mic"></i>
                                                    <span v-html="` ${item.Desc}`"></span>
                                                </span>
                                                <span class="u-rank" v-if="views[item.ID]">
                                                    <i class="el-icon-watermelon"></i>
                                                    <span v-text="`昨日 - ${views[item.ID]['yesterday']}`"></span>
                                                    <i class="el-icon-grape"></i>
                                                    <span v-text="`七天 - ${views[item.ID]['7days']}`"></span>
                                                    <i class="el-icon-pear"></i>
                                                    <span v-text="`三十天 - ${views[item.ID]['30days']}`"></span>
                                                </span>
                                            </div>
                                        </router-link> -->
                                    </el-col>
                                </template>
                            </el-row>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </template>
        </WikiPanel>

        <WikiPanel :border-none="true">
            <template slot="head-title">
                <i class="el-icon-notebook-2"></i>
                <span>最新成就</span>
            </template>
            <template slot="head-actions">
                <router-link class="other" :to="{ name: 'newest' }">查看更多 &raquo;</router-link>
            </template>
            <template slot="body">
                <el-carousel height="66px" direction="vertical" :interval="3500" indicator-position="none">
                    <el-carousel-item v-for="(items, key) in newest_achievements" :key="key" class="m-carousel">
                        <el-row :gutter="20">
                            <el-col :md="8" v-for="(item, k) in items" :key="k">
                                <WikiItem :class="`u-item-${k}`" :item="item"></WikiItem>
                            </el-col>
                        </el-row>
                    </el-carousel-item>
                </el-carousel>
            </template>
        </WikiPanel>

        <!-- 最近攻略 -->
        <PostList></PostList>
    </div>
</template>

<script>
import { feedback } from "@jx3box/jx3box-common/data/jx3box.json";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { iconLink, showAvatar, getLink } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@/components/wiki-panel.vue";
import WikiItem from "@/components/common/wiki-item.vue";
import Counter from "@/components/common/counter.vue";
import PostList from "@/components/common/post-list.vue";

export default {
    name: "Home",
    components: {
        WikiPanel,
        PostList,
        WikiItem,
        Counter,
    },
    data() {
        return {
            views: {},
            hot_achievements: null,
            newest_achievements: null,
            feedback,
        };
    },
    computed: {
        isStd: function () {
            return this.$store.state.client == "std";
        },
        client: function () {
            return this.$store.state.client;
        },
        hiddenAchievementsPostLink: function () {
            let id = this.client == "std" ? 8104 : 43543;
            return getLink("bbs", id);
        },
    },
    methods: {
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
        chuck(arr, number = 3) {
            let output = [];
            for (let i = 0; i < arr.length; i += number) {
                output.push(arr.slice(i, i + number));
            }
            return output;
        },
        showAvatar: function (user) {
            const val = user?.user_avatar || "";
            return showAvatar(val);
        },
    },
    created() {
        // 获取热门成就
        const hot_key = this.client == "origin" ? "origin_cj" : "cj";
        getStatRank(hot_key, "views", 12).then((res) => {
            res = res.data;
            let source_ids = [];
            res.forEach((item) => {
                if (item.name.startsWith("cj")) {
                    let id = item.name.split("-").pop();
                    source_ids.push(id);
                    this.views[id] = item.value;
                }
            });

            wiki.achievements({
                ids: source_ids.join(","),
                limit: source_ids.length,
            }).then((res) => {
                res = res.data;
                // 按照长度分批
                this.hot_achievements = this.chuck(Object.values(res.data.achievements));
            });
        });

        // 获取成就列表
        wiki.achievements({ per: 12 }).then(
            (res) => {
                res = res.data;
                // 按照长度分批
                this.newest_achievements = this.chuck(Object.values(res.data.achievements));
            },
            () => {
                this.newest_achievements = [];
            }
        );
    },
};
</script>

<style lang="less">
@import "~@/assets/css/cj/home.less";
</style>
