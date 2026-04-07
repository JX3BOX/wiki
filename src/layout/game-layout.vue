<template>
    <header class="m-header">
        <a class="m-header-logo" :href="rootPath">
            <img class="u-logo" src="@/assets/img/brand/logo.png" alt="JX3BOX" />
            <strong class="u-title">JX3BOX魔盒</strong>
        </a>
        <ul class="m-header-list">
            <li><a :href="`${rootPath}macro/`">宏库</a></li>
            <li><a :href="`${rootPath}bps/`">职业</a></li>
            <li><a :href="`${rootPath}pvp/`">竞技</a></li>
            <li><a :href="`${rootPath}fb/`">副本</a></li>
            <li><a :href="`${rootPath}cj/`">百科</a></li>
            <li><a :href="`${rootPath}pvx/`">休闲</a></li>
            <li><a :href="`${rootPath}tool/`">工具</a></li>
            <li><a :href="`${rootPath}bbs/`">茶馆</a></li>
        </ul>
    </header>

    <main class="m-main">
        <div id="app">
            <slot></slot>
        </div>
    </main>

    <div class="m-footer">
        &copy; <a :href="rootPath">剑三魔盒</a> [ <a class="u-link" :href="rootPath">{{ rootDomain }}</a> ]
    </div>
</template>

<script>
import { __Root, __OriginRoot } from "@/utils/config";

export default {
    name: "GameLayout",
    computed: {
        client() {
            return this.$route?.query?.L === "classic_yq" ? "origin" : "std";
        },
        rootPath() {
            return this.client === "origin" ? __OriginRoot : __Root;
        },
        rootDomain() {
            return this.rootPath.replace(/^https?:\/\//ui, "").replace(/\/.*$/ui, "");
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/game/common.less";
@import "../assets/css/game/header.less";
@import "../assets/css/game/block.less";
@import "../assets/css/game/footer.less";
</style>
