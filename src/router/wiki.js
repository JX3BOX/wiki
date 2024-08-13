import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const overview = () => import("@/views/wiki/overview.vue");

const routes = [{ name: "overview", path: "/achievement/overview", component: overview }];

const router = new VueRouter({
    routes,
    base: "/wiki",
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
