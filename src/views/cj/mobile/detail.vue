<template>
    <div class="c-var p-achievement-detail" v-loading="loading">
        <div class="m-main-box">
            <div class="m-achievement-info">
                <div class="m-sub-list">
                    <div
                        v-for="item in source?.SeriesAchievementList || []"
                        :key="item.ID"
                        class="u-sub-achievement"
                        @click="() => changeCurrent(item)"
                    >
                        <img :src="iconUrl(item.IconID)" />
                    </div>
                </div>
                <wiki-item :item="source" />
                <button  class="m-confirm" :class="{complete: isComplete,disabled:!isVirtual}" @click="setConfirm">{{ isComplete ? "已完成" : "设为已完成" }}</button>
            </div>
            <div class="m-wiki">
                <div class="m-wiki-header">
                    <div class="u-title">成就攻略</div>
                    <div class="u-avatar-list">
                        <div v-for="item in authors" :key="item.user_id" class="u-avatar">
                            <img :src="showAvatar(item.user_avatar)" />
                        </div>
                    </div>
                    <div class="u-time">
                        {{ updated_at }}
                    </div>
                </div>
                <div class="m-content-box">
                    <Article id="wikiArticle" :content="clearContent(wiki_post?.post?.content)" />
                </div>

                <div class="u-show-log">查看历史修订</div>
            </div>
        </div>
        <div class="m-comments">
            <miniprogram-comment-list :source-id="id" type="achievement" />
        </div>
        <suspend-common
            v-if="!isFromTarget"
            class="u-suspend-common"
            :btn-options="btnOptions"
            :drawer-options="drawerOptions"
            style="width: 100%"
            @search="onSearch"
            ref="suspendCommon"
        >
            <template #default>
                <div class="m-more-action">
                    <div class="u-action" @click="() => (userSelectShow = true)">
                        <img src="@/assets/img/cj/mobile/user.svg" svg-inline />
                    </div>
                    <div class="u-action">
                        <img src="@/assets/img/cj/mobile/menu.svg" svg-inline />
                    </div>
                    <div class="u-action">
                        <img src="@/assets/img/cj/mobile/map.svg" svg-inline />
                    </div>
                </div>
            </template>
        </suspend-common>

        <user-select-drawer :visible.sync="userSelectShow" :current-role="currentRole" @change="setRole" />

        <confirm-ok-drawer :visible.sync="conformShow" @confirm="confirmOk" />
    </div>
</template>

<script lang="js">
import SuspendCommon from  '@jx3box/jx3box-common-ui/src/SuspendCommon.vue';
import { publishLink, showAvatar, showSchoolIcon, ts2str } from "@jx3box/jx3box-common/js/utils";
import { postHistory, postStat } from "@jx3box/jx3box-common/js/stat";
import {
    cancelVirtualRoleAchievements,
    get_achievement, getRoleGameAchievements, getVirtualRoleAchievements, setVirtualRoleAchievements } from "@/service/achievement";
import { wiki } from "@jx3box/jx3box-common/js/wiki_v2";
import { reportNow } from "@jx3box/jx3box-common/js/reporter";
import User from "@jx3box/jx3box-common/js/user";
import { getConfig } from "@jx3box/jx3box-common/js/api_misc";
import { report } from "@/service/user";
import { icon_url } from "@/filters";
import iconUrl from "@/filters/icon-url";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import UserSelectDrawer from "@/components/cj/mobile/user-select-drawer.vue";
import MiniprogramCommentList from "@/components/cj/mobile/comment-list.vue";
import WikiItem from "@/components/cj/mobile/wiki-item.vue";
import ConfirmOkDrawer from "@/components/cj/mobile/confirm-ok-drawer.vue";

export default {
    name: "CjMobileDetail",
    components: { ConfirmOkDrawer, WikiItem, MiniprogramCommentList, UserSelectDrawer,SuspendCommon,Article },
    data() {
        return {
            source: {},
            wiki_post: "",
            compatible: false,
            is_empty: true,

            imageCount: 0,
            loadedImageCount: 0,
            images: [],
            imagesLoaded: false,

            userSelectShow:false,
            currentRole: this.$store.state.role,
            loading: false,
            conformShow: false
        };
    },
    computed: {
        show: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            }
        },
        id() {
            return this.$route.params.source_id;
        },
        post_id: function () {
            return this.$route.params.post_id;
        },
        isRevision: function () {
            return !!this.$route.params.post_id;
        },
        author_id: function () {
            return ~~this.wiki_post.post.user_id;
        },
        client: function () {
            return this.$store.state.client;
        },
        user_name: function () {
            return this.wiki_post?.post?.user_nickname;
        },
        updated_at: function () {
            return ts2str(this.wiki_post?.post?.updated);
        },
        authors: function () {
            if (!this.isRevision) {
                return (
                    this.wiki_post?.users
                        ?.filter((user) => user.id)
                        ?.map((user) => {
                            return {
                                user_id: user.id,
                                user_avatar: user.avatar,
                                display_name: user.nickname,
                            };
                        }) || []
                );
            }
            return [];
        },
        favTitle: function () {
            return this.wiki_post?.source?.Name;
        },
        prefix() {
            return this.client === "std" ? "www" : "origin";
        },
        isFromTarget(){
            return false;
        },
        drawerOptions(){
            return {
                hideType: ['report'], //需要隐藏的type,如['search','pin']
                direction: 'btt', //弹出框方向，btt、ttb、rtl、ltr
            }
        },
        btnOptions(){
            return {
                showHome: true, //是否显示home区域，和Icon区域二选一,home区域优先级高于icon区域
                showIcon: false, //是否显示icon区域,此处为false后，则下列配置无效

                showMore: true, //是否显示更多
            }
        },
        completeAchievements() {
            return this.$store.state.achievements || [];
        },
        achievementsVirtual() {
            return this.$store.state.achievementsVirtual || [];
        },
        isComplete(){
            return this.hadCompleted(this.id);
        },
        isVirtual(){
            return !this.currentRole?.jx3id;
        }
    },
    watch:{
        id: {
            handler() {
                this.loadData();
            },
        },
        post_id: {
            handler() {
                this.loadRevision();
            },
        },
        currentRole: {
            deep: true,
            handler(val) {
                if (!val) return;
                localStorage.setItem("wiki_last_sync", val.jx3id || 0);
                this.$store.commit("SET_STATE", { key: "role", value: val });
                const { jx3id } = val;
                if (jx3id) {
                    this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: [] });
                    this.loadRoleAchievements(jx3id);
                } else {
                    if (jx3id === 0) {
                        // 虚拟角色
                        this.loadVirtualAchievements();
                    }
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
            },
        },
    },
    methods: {
        iconUrl,
        showAvatar,
        icon_url,
        next(){

        },
        onSearch(){
            if(isMiniProgram()){
                wx.miniProgram.navigateTo({ url: `/pages/search/search-detail/search-detail?app=wiki&filter_category=成就` });
            }
        },
        setRole(val){
            this.currentRole = val;
            this.userSelectShow = false;
        },
        openChild(){
            this.childrenShow = true;
            console.log(111);
        },
        clearContent(content){
            return (content || "").replace(/ style="[^"]*"/g, "")
                .replace(/<i?frame.*?src="(.*?)".*?>/g, (match, src) => {
                    return `<a href="${src}" target="_blank">${src}</a>`;
                })
                .replace(/<i?frame.*?src="(.*?)".*?>.*?<\/i?frame>/g, (match, src) => {
                    return `<a href="${src}" target="_blank">${src}</a>`;
                })
        },
        publish_url: publishLink,
        triggerStat: function () {
            if (this.client == "origin") {
                postStat("origin_cj", this.id);
            } else {
                postStat("cj", this.id);
            }
        },
        changeCurrent(item){
            this.$router.push({
                name: "view",
                params: {
                    source_id: item.ID,
                }
            })
        },
        initImageLoader() {
            // 在DOM更新后获取所有图片
            this.$nextTick(() => {
                const container = document.getElementById("wikiArticle");
                if (!container) {
                    this.setGlobalReady();
                    return;
                }

                const images = container.querySelectorAll("img");
                this.images = images;
                this.imageCount = images.length;

                if (this.imageCount === 0) {
                    this.setGlobalReady();
                    return;
                }

                // 手动预加载所有图片
                this.preloadAllImages(images);
            });
        },

        // 手动预加载所有图片
        preloadAllImages(images) {
            let loadedInThisBatch = 0;
            let totalProcessed = 0;
            Array.from(images).forEach((img, index) => {
                // 记录原始src
                const originalSrc = img.src;

                // 如果图片未加载
                if (!img.complete) {
                    // 创建一个Image对象来预加载
                    const tempImg = new Image();

                    tempImg.onload = () => {
                        loadedInThisBatch++;

                        // 在临时图片加载完成后，设置原始图片的src
                        img.src = originalSrc;

                        // 检查是否所有图片都已处理
                        this.checkImageLoadCompletion(images, loadedInThisBatch);
                    };

                    tempImg.onerror = () => {
                        console.error(`图片加载失败: ${originalSrc}`);
                        totalProcessed++;

                        // 即使加载失败，也要设置原始图片的src
                        img.src = originalSrc;

                        // 标记原始图片为已加载（错误情况）
                        this.handleImageLoad();
                    };

                    // 开始预加载
                    tempImg.src = originalSrc;
                } else {
                    // 图片已经加载完成
                    this.handleImageLoad();
                    totalProcessed++;
                }
            });
        },

        // 检查图片加载状态
        checkImageLoadCompletion(images, loadedCount) {
            if (images.length === this.loadedImageCount) {
                this.setGlobalReady();
                return;
            }

            // 设置超时检查，防止意外情况
            setTimeout(() => {
                const allLoaded = Array.from(images).every((img) => img.complete);

                if (allLoaded) {
                    this.setGlobalReady();
                } else if (this.loadedImageCount === images.length) {
                    this.setGlobalReady();
                }
            }, 3000);
        },

        // 判断是否全部完成
        handleImageLoad() {
            this.loadedImageCount++;
            if (this.loadedImageCount === this.imageCount) {
                this.setGlobalReady();
            }
        },

        // 设置全局就绪状态
        setGlobalReady() {
            if (this.imagesLoaded) return; // 避免重复设置

            this.imagesLoaded = true;
            window.__READY__ = true;
            console.log("全局状态设置成功: __READY__ = ", window.__READY__);
        },
        loadData: async function () {
            // 获取最新攻略
            if (this.id) {
                this.loading = true;
                await get_achievement(this.id, { client: this.client }).then((res) => {
                    this.source = res?.data?.data?.achievement || "";
                });
                await wiki.mix({ type: "achievement", id: this.id, client: this.client }).then((res) => {
                    const { post, source, compatible, isEmpty, users } = res;
                    this.wiki_post = {
                        post: post,
                        source: source,
                        users,
                    };
                    this.is_empty = isEmpty;
                    this.compatible = compatible;

                    reportNow({
                        caller: "cj_detail",
                        data: {
                            href: `${this.prefix}:/cj/view/${this.id}`,
                        },
                    });

                    User.isLogin() &&
                    postHistory({
                        source_type: this.client == "origin" ? "origin_cj" : "cj",
                        source_id: ~~this.id,
                        link: location.href,
                        title: post.title,
                    });
                }).finally(()=>{
                    this.loading = false;
                });
            }

            // 请注意，为防止QQBOT无法抓取完全，请不要删除
            if (this.isRobot) {
                // 数据加载后启动奇遇流程中的图片检测
                this.initImageLoader();
            }

            this.triggerStat();
        },
        loadRevision: function () {
            // 获取指定攻略
            wiki.getById(this.post_id).then((res) => {
                this.wiki_post = {
                    ...this.wiki_post,
                    post: res.data.data?.post,
                };
            });
            this.triggerStat();
        },
        ts2str,
        loadConfig() {
            getConfig({ key: "test_user_ua" }).then((res) => {
                const isTest = ~~res.data.data.val;

                if (isTest) {
                    report();
                }
            });
        },

        loadRoleAchievements(jx3id) {
            getRoleGameAchievements(jx3id).then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const jx3id = res.data?.data?.jx3id;
                this.isSync = !!jx3id; // 是否在游戏中同步
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievements", value: list, isSession: true });
            });
        },
        showSchoolIcon,
        // 获取虚拟角色成就列表
        loadVirtualAchievements() {
            if (!this.currentRole || this.currentRole.jx3id) return;
            getVirtualRoleAchievements().then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
            });
        },
        confirmOk(){
            this.finishVirtual([this.id])
        },
        hadCompleted(id) {
            const list = this.isVirtual ? this.achievementsVirtual : this.completeAchievements;
            return list.includes(id + "");
        },
        setConfirm(){
            if (!this.isVirtual) {
                return;
            }

            if (this.isComplete) {
                // 取消完成
                this.cancelVirtual([this.id])

                return;
            }

            this.conformShow = true;
        },

        finishVirtual(curr) {
            const ids = curr?curr: this.selectedAchievements.map((item) => item.ID + "");
            const data = {
                achievements: ids.join(),
            };
            setVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将选中成就标记为已完成",
                    type: "success",
                });
                const list = Array.from(new Set(this.achievementsVirtual.concat(ids)));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },
        cancelVirtual(curr) {
            const ids = curr?curr: this.selectedAchievements.map((item) => item.ID + "");
            const data = {
                achievements: ids.join(),
            };
            cancelVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将选中成就标记为待完成",
                    type: "success",
                });
                const list = this.achievementsVirtual.filter((item) => !ids.includes(item));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },
    },
    mounted() {
        if (this.post_id) {
            this.loadRevision();
        } else {
            this.loadData();
        }

        this.loadConfig();
    },
}
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.u-suspend-common {
    padding-bottom: 2rem;
    margin: 0;
    .m-base {
        width: 100%;
        .m-more-action {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;

            .u-action {
                display: flex;
                height: 24px;
                justify-content: center;
                align-items: center;
                flex: 1 0 0;

                &.disabled {
                    img {
                        opacity: 0.5;
                    }
                }
            }
        }
    }
    .m-more {
        .u-icon {
            display: none;
        }
    }
}

.p-achievement-detail {
    min-height: calc(100vh - 120px);
    background: #f1f1f1;
    @media (prefers-color-scheme: dark) {
        background: #000;
    }

    padding-bottom: 100px;

    .m-main-box {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px 20px 0;
    }

    .m-achievement-info {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .m-sub-list {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: center;
            .u-sub-achievement {
                width: 32px;
                height: 32px;
                border-radius: 4px;
                overflow: hidden;
            }
        }

        .m-confirm {
            display: flex;
            height: 48px;
            padding: 12px 16px;
            justify-content: center;
            align-items: center;
            gap: 8px;

            border-radius: var(--12, 12px);
            background: var(--primary-brand-2, #fedaa3);
            border: none;

            color: var(--primary-brand-3, #24292e);
            /* 16 Bold */
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */

            &.complete{
                opacity: 0.3;
            }

            &.disabled{
                opacity: 0.3;
            }
        }
    }

    .m-wiki {
        display: flex;
        padding: 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        width: 100%;
        border-radius: 12px;
        box-sizing: border-box;
        border: 1px solid rgba(40, 40, 40, 0.05);
        background: var(--primary-brand-4, #282828);
        .m-wiki-header {
            display: flex;
            flex-direction: column;
            gap: 4px;
            .u-title {
                color: var(--black-80, rgba(255, 255, 255, 0.8));

                /* 16 Bold */
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
            }

            .u-avatar-list {
                display: flex;
                align-items: center;

                .u-avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: -8px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }

            .u-time {
                color: var(--black-40, rgba(255, 255, 255, 0.4));

                /* 12 Regular */
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }

        .m-content-box {
            overflow: auto;
            box-sizing: border-box;
            #wikiArticle {
                color: rgba(255, 255, 255, 0.8) !important;

                /* 14 Regular */
                font-size: 14px !important;
                font-style: normal !important;
                font-weight: 400 !important;
                line-height: 20px; /* 142.857% */

                box-sizing: border-box;
                overflow-x: hidden;

                ul {
                    padding-left: 12px !important;
                }

                .e-summary,
                .e-jx3-resource {
                    @media (prefers-color-scheme: dark) {
                        color: var(--black-100);
                        background: var(--black-20);
                    }
                }
                ul:has(.e-jx3-resource) {
                    padding: 0 !important;
                }
                ul:has(.e-summary) {
                    padding: 0 !important;
                }
                img {
                    margin: 0 !important;
                }

                div {
                    color: var(--black-100);
                }
                h1 {
                    font-weight: 700 !important;
                    line-height: 30px !important;
                    font-size: 20px !important;
                    margin-bottom: 15px !important;
                    color: var(--black-100);
                }

                h2 {
                    font-weight: 700 !important;
                    line-height: 27px !important;
                    font-size: 18px !important;
                    margin-bottom: 14px !important;
                    color: var(--black-100);
                }

                h3 {
                    font-weight: 700 !important;
                    line-height: 24px !important;
                    font-size: 16px !important;
                    margin-bottom: 12px !important;
                    color: var(--black-100);
                }

                h4 {
                    font-weight: 700 !important;
                    line-height: 20px !important;
                    font-size: 14px !important;
                    margin-bottom: 11px !important;

                    @media (prefers-color-scheme: dark) {
                        color: var(--black-100);
                        background: var(--black-20);
                    }
                }

                blockquote {
                    @media (prefers-color-scheme: dark) {
                        background: var(--black-20);
                    }
                }

                h5,
                h6 {
                    font-weight: 700 !important;
                    line-height: 18px !important;
                    font-size: 12px !important;
                    margin-bottom: 9px !important;
                    color: var(--black-100) !important;
                    @media (prefers-color-scheme: dark) {
                        background: var(--black-20);
                    }
                }

                .e-jx3-resource {
                    overflow: hidden;
                }

                p {
                    font-weight: 400 !important;
                    line-height: 20px !important;
                    font-size: 14px !important;
                    margin-bottom: 11px !important;
                    color: var(--black-100);
                }

                .text {
                    display: inline-block !important;
                    font-weight: 400 !important;
                    line-height: 20px !important;
                    font-size: 14px !important;
                    margin-bottom: 11px !important;
                    color: var(--black-100);
                }

                hr {
                    margin-bottom: 11px !important;
                    margin-top: 8px !important;
                }
            }
        }

        .u-show-log {
            margin-top: 20px;
            text-align: center;
            width: 100%;
            color: var(--black-40, rgba(255, 255, 255, 0.4));

            /* 12 Regular */
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px; /* 150% */
        }
    }
}
</style>
