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
    {
        name: "compare",
        path: "/achievement/compare",
        component: () => import("../views/wiki/compare.vue"),
    },
    {
        name: "leap",
        path: "/achievement/leap",
        component: () => import("../views/wiki/leap.vue"),
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
