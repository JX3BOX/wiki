import { createRouter, createWebHistory } from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

const overview = () => import("../views/wiki/overview.vue");
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
        component: isMiniProgram() || isApp() ? overviewMiniProgram : overview,
    },
    {
        name: "compare",
        path: "/compare",
        component: isMiniProgram() || isApp() ? compareMiniProgram : compare,
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

const router = createRouter({
    history: createWebHistory("/achievement"),
    routes,
});

router.beforeEach((to) => {
    if (to.fullPath.includes("/#")) {
        return to.fullPath.replace("/#", "");
    }
    return true;
});

export default router;
