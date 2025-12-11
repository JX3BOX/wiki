/*
 * @Author: iRuxu
 * @Date: 2022-07-10 21:24:08
 * @LastEditTime: 2022-07-19 17:17:38
 * @Description:
 */
import Vue from "vue";
import VueRouter from "vue-router";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";

Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch((err) => err);
};

const routes = [
    {
        name: "quest",
        path: "/",
        component: () => import("@/views/quest/quest.vue"),
        redirect: { name: "home" },
        children: [
            {
                name: "home",
                path: "/",
                component: () => import("@/views/quest/home.vue"),
                meta: {
                    sidebar: false,
                },
            },
            {
                name: "result",
                path: "/search",
                component: () => import("@/views/quest/search-result.vue"),
            },
            {
                name: "view",
                path: "/view/:quest_id([_\\d]+)/:post_id(\\d+)?",
                component: () => import("@/views/quest/single.vue"),
            },
            {
                name: "waiting",
                path: "/waiting",
                component: () => import("@/views/quest/waiting.vue"),
            },
            {
                name: "newest",
                path: "/newest",
                component: () => import("@/views/quest/newest.vue"),
            },
        ],
    },
];

if (isMiniProgram()) {
    routes.forEach((route) => {
        if (route.path === "/") {
            route.children.forEach((child) => {
                if (child.name === "home") {
                    child.component = () => import("@/views/quest/mobile/index.vue");
                } else if (child.name === "view") {
                    child.component = () => import("@/views/quest/mobile/detail.vue");
                }
            });
            route.component = () => import("@/views/base.vue");
        }
    });
}

const router = new VueRouter({
    routes,
    base: "/quest",
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
