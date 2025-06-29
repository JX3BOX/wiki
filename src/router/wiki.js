import { name } from "dayjs/locale/zh-cn";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        name: "overview",
        path: "/overview",
        component: () => import("../views/wiki/overview.vue"),
    },
    {
        name: "compare",
        path: "/compare",
        component: () => import("../views/wiki/compare.vue"),
    },
    {
        name: "leap",
        path: "/leap",
        component: () => import("../views/wiki/leap.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: "/achievement",
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
