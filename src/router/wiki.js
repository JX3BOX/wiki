import Vue from "vue";
import VueRouter from "vue-router";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";
Vue.use(VueRouter);
let overview = () => import("../views/wiki/overview.vue");
const overviewMiniProgram = () => import("../views/wiki_miniprogram/overview.vue");
const leap = () => import("../views/wiki/leap.vue");
const compare = () => import("../views/wiki/compare.vue");
const compareMiniProgram = () => import("../views/wiki_miniprogram/compare.vue");
const routes = [
    {
        name: "index",
        path: "/",
        redirect: "/overview",
    },
    {
        name: "overview",
        path: "/overview",
        component: isMiniProgram() ? overviewMiniProgram : overview,
    },
    {
        name: "compare",
        path: "/compare",
        component: isMiniProgram() ? compareMiniProgram : compare,
    },
    {
        name: "leap",
        path: "/leap",
        component: leap,
    },
    {
        name: "catalogue",
        path: "/catalogue",
        meta: {
            title: "目录列表",
        },
        component: () => import("../views/wiki_miniprogram/catalogue.vue"),
    },
    {
        name: "list",
        path: "/list",
        meta: {
            title: "成就列表",
        },
        component: () => import("../views/wiki_miniprogram/achievement.vue"),
    },
    {
        name: "compare/catalogue",
        path: "/compare/catalogue",
        meta: {
            title: "对比目录列表",
        },
        component: () => import("../views/wiki_miniprogram/compare/compare_catalogue.vue"),
    },
    {
        name: "compare/achievement",
        path: "/compare/achievement",
        meta: {
            title: "对比成就列表",
        },
        component: () => import("../views/wiki_miniprogram/compare/compare_achievement.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: "/achievement",
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
