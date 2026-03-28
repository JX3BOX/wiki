import { createRouter, createWebHistory } from "vue-router";

const wujieDetail = () => import("@/views/wujie-detail.vue");
const qqrobot = () => import("@/views/qqrobot.vue");

const routes = [
    {
        path: "/",
        component: () => import("../views/game.vue"),
    },
    {
        path: "/wiki",
        component: () => import("../views/game.vue"),
    },
    { name: "wujie-cj-detail", path: "/wujie/cj/view/:source_id(\\d+)/:post_id(\\d+)?", component: wujieDetail },
    { name: "qqbot-wiki-detail", path: "/qqbot/wiki", component: qqrobot },
];

const router = createRouter({
    history: createWebHistory("/"),
    routes,
});

export default router;
