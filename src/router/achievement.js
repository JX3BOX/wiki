import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "overview",
        component: () => import("../views/achievement/overview.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: "/",
    routes,
});

export default router;
