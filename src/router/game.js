import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const wujieDetail = () => import("@/views/wujie-detail.vue");
const qqrobot = () => import("@/views/qqrobot.vue");

const routes = [
    // 💠 PC游戏内插件访问
    // 作为page.j3cx.com域名使用
    {
        path: "/",
        component: () => import("../views/game.vue"),
    },
    // 作为www.jx3box.com/wiki主域名使用
    {
        path: "/wiki",
        component: () => import("../views/game.vue"),
    },
    // 💠 无界手机访问
    { name: "wujie-cj-detail", path: "/wujie/cj/view/:source_id(\\d+)/:post_id(\\d+)?", component: wujieDetail },
    // 💠 QQ机器人生图页
    { name: "qqbot-wiki-detail", path: "/qqbot/wiki", component: qqrobot },
];

const router = new VueRouter({
    mode: "history",
    base: "/",
    routes,
});

export default router;
