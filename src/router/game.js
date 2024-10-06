import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const wujieDetail = () => import("@/views/wujie-detail.vue");

const routes = [
    {
        path: "/",
        component: () => import("../views/game.vue"),
    },
    // 无界成就单页
    { name: "wujie-cj-detail", path: "/wujie-cj-detail/:source_id(\\d+)/:post_id(\\d+)?", component: wujieDetail },
];

const router = new VueRouter({
    mode: "history",
    base: "/",
    routes,
});

export default router;
