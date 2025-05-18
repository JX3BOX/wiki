import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const wujieDetail = () => import("@/views/wujie-detail.vue");
const qqrobot = () => import("@/views/qqrobot.vue");

const routes = [
    {
        path: "/",
        component: () => import("../views/game.vue"),
    },
    // 无界成就单页
    { name: "wujie-cj-detail", path: "/wujie/cj/view/:source_id(\\d+)/:post_id(\\d+)?", component: wujieDetail },
    // 通用qq机器人详情页
    { name: "qqbot-wiki-detail", path: "/qqbot/wiki", component: qqrobot },
];

const router = new VueRouter({
    mode: "history",
    base: "/",
    routes,
});

export default router;
