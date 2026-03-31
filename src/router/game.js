import { createRouter, createWebHistory } from "vue-router";

const wujieDetail = () => import("@/views/wujie-detail.vue");
const qqrobot = () => import("@/views/qqrobot.vue");

const routes = [
    {
        path: "/",
        component: () => import("../views/game.vue"),
        meta: {
            i18n: {
                title: "pages.game.home.title",
                keywords: "pages.game.home.keywords",
                description: "pages.game.home.description",
            },
        },
    },
    {
        path: "/wiki",
        component: () => import("../views/game.vue"),
        meta: {
            i18n: {
                title: "pages.game.wiki.title",
                keywords: "pages.game.wiki.keywords",
                description: "pages.game.wiki.description",
            },
        },
    },
    {
        name: "wujie-cj-detail",
        path: "/wujie/cj/view/:source_id(\\d+)/:post_id(\\d+)?",
        component: wujieDetail,
        meta: {
            i18n: {
                title: "pages.game.wujie_cj_detail.title",
                keywords: "pages.game.wujie_cj_detail.keywords",
                description: "pages.game.wujie_cj_detail.description",
            },
        },
    },
    {
        name: "qqbot-wiki-detail",
        path: "/qqbot/wiki",
        component: qqrobot,
        meta: {
            i18n: {
                title: "pages.game.qqbot_wiki_detail.title",
                keywords: "pages.game.qqbot_wiki_detail.keywords",
                description: "pages.game.qqbot_wiki_detail.description",
            },
        },
    },
];

const router = createRouter({
    history: createWebHistory("/"),
    routes,
});

export default router;
