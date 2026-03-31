import { createRouter, createWebHistory } from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

const routes = [
    {
        name: "item",
        path: "/",
        component: () => import("@/views/item/index.vue"),
        redirect: { name: "home" },
        children: [
            {
                name: "home",
                path: "/",
                component: () => import("@/views/item/home.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.home.title",
                        keywords: "pages.item.home.keywords",
                        description: "pages.item.home.description",
                    },
                },
            },
            {
                name: "normal",
                path: "/:AucGenre([empty|\\d]+)/:AucSubTypeID(\\d+)",
                component: () => import("@/views/item/normal.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.normal.title",
                        keywords: "pages.item.normal.keywords",
                        description: "pages.item.normal.description",
                    },
                },
            },
            {
                name: "search",
                path: "/search/:keyword(\\s?|.+)?",
                component: () => import("@/views/item/search.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.search.title",
                        keywords: "pages.item.search.keywords",
                        description: "pages.item.search.description",
                    },
                },
            },
            {
                name: "view",
                path: "/view/:item_id([_\\d]+)/:post_id(\\d+)?",
                component: () => import("@/views/item/detail.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.view.title",
                        keywords: "pages.item.view.keywords",
                        description: "pages.item.view.description",
                    },
                },
            },
            {
                name: "plan_view",
                path: "/plan_view/:plan_id(\\d+)",
                component: () => import("@/views/item/plan-detail.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.plan_view.title",
                        keywords: "pages.item.plan_view.keywords",
                        description: "pages.item.plan_view.description",
                    },
                },
            },
            {
                name: "plan_edit",
                path: "/plan_edit/:plan_id(\\d+)",
                component: () => import("@/views/item/plan-edit.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.plan_edit.title",
                        keywords: "pages.item.plan_edit.keywords",
                        description: "pages.item.plan_edit.description",
                    },
                },
            },
            {
                name: "plan_list",
                path: "/plan_list/:keyword(.+)?",
                component: () => import("@/views/item/plan-list.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.plan_list.title",
                        keywords: "pages.item.plan_list.keywords",
                        description: "pages.item.plan_list.description",
                    },
                },
            },
            {
                name: "waiting",
                path: "/waiting",
                component: () => import("@/views/item/waiting.vue"),
                meta: {
                    i18n: {
                        title: "pages.item.waiting.title",
                        keywords: "pages.item.waiting.keywords",
                        description: "pages.item.waiting.description",
                    },
                },
            },
        ],
    },
];

if (isMiniProgram() || isApp()) {
    routes.forEach((route) => {
        if (route.path === "/") {
            route.component = () => import("@/views/base.vue");
            route.children.forEach((child) => {
                if (child.name === "home") {
                    child.component = () => import("@/views/item/mobile/index.vue");
                }
                if (child.name === "view") {
                    child.component = () => import("@/views/item/mobile/detail.vue");
                }
                if (child.name === "plan_list") {
                    child.component = () => import("@/views/item/mobile/plan-list.vue");
                }
                if (child.name === "plan_view") {
                    child.component = () => import("@/views/item/mobile/plan-detail.vue");
                }
            });
        }
    });
}

const router = createRouter({
    history: createWebHistory("/item"),
    routes,
});

router.beforeEach((to) => {
    if (to.fullPath.includes("/#")) {
        return to.fullPath.replace("/#", "");
    }
    return true;
});

export default router;
