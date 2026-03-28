import { createRouter, createWebHistory } from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

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

if (isMiniProgram() || isApp()) {
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

const router = createRouter({
    history: createWebHistory("/quest"),
    routes,
});

router.beforeEach((to) => {
    if (to.fullPath.includes("/#")) {
        return to.fullPath.replace("/#", "");
    }
    return true;
});

export default router;
