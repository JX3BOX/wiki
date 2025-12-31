import Vue from "vue";
import VueRouter from "vue-router";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";
Vue.use(VueRouter);
let overview = () => import("../views/wiki/overview.vue");
const overviewMiniProgram = () => import("../views/wiki_miniprogram/overview.vue");
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
        component: () => import("../views/wiki/compare.vue"),
    },
    {
        name: "leap",
        path: "/leap",
        component: () => import("../views/wiki/leap.vue"),
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
        name: "achievementList",
        path: "/achievementList",
        meta: {
            title: "成就列表",
        },
        component: () => import("../views/wiki_miniprogram/achievement.vue"),
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
