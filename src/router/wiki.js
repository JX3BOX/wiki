import { name } from "dayjs/locale/zh-cn";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        name: "wiki",

        path: "/",
        redirect: "/achievement/overview",
    },
    {
        name: "overview",
        path: "/achievement/overview",
        component: () => import("../views/wiki/overview.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: "/wiki",
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
