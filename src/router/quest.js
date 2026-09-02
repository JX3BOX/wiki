import { createRouter, createWebHistory } from "vue-router";

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
                    i18n: {
                        title: "pages.quest.home.title",
                        keywords: "pages.quest.home.keywords",
                        description: "pages.quest.home.description",
                    },
                },
            },
            {
                name: "result",
                path: "/search",
                component: () => import("@/views/quest/search-result.vue"),
                meta: {
                    i18n: {
                        title: "pages.quest.result.title",
                        keywords: "pages.quest.result.keywords",
                        description: "pages.quest.result.description",
                    },
                },
            },
            {
                name: "view",
                path: "/view/:quest_id([_\\d]+)/:post_id(\\d+)?",
                component: () => import("@/views/quest/single.vue"),
                meta: {
                    i18n: {
                        title: "pages.quest.view.title",
                        keywords: "pages.quest.view.keywords",
                        description: "pages.quest.view.description",
                    },
                },
            },
            {
                name: "waiting",
                path: "/waiting",
                component: () => import("@/views/quest/waiting.vue"),
                meta: {
                    i18n: {
                        title: "pages.quest.waiting.title",
                        keywords: "pages.quest.waiting.keywords",
                        description: "pages.quest.waiting.description",
                    },
                },
            },
            {
                name: "newest",
                path: "/newest",
                component: () => import("@/views/quest/newest.vue"),
                meta: {
                    i18n: {
                        title: "pages.quest.newest.title",
                        keywords: "pages.quest.newest.keywords",
                        description: "pages.quest.newest.description",
                    },
                },
            },
        ],
    },
];

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
