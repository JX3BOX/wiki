import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: () => import("../views/game.vue"),
    },
];

const router = new VueRouter({
    mode: "history",
    base: "/",
    routes,
});

export default router;
