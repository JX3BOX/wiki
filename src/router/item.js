import Vue from "vue";
import VueRouter from "vue-router";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";

Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch((err) => err);
};

const routes = [
    {
        name: "item",
        path: "/",
        component: () => import("@/views/item/index.vue"),
        redirect: { name: "home" },
        children: [
            // 主页
            { name: "home", path: "/", component: () => import("@/views/item/home.vue") },
            // 常规
            {
                name: "normal",
                path: "/:AucGenre([empty|\\d]+)/:AucSubTypeID(\\d+)",
                component: () => import("@/views/item/normal.vue"),
            },
            // 搜索
            { name: "search", path: "/search/:keyword(\\s?|.+)?", component: () => import("@/views/item/search.vue") },

            // 单页
            {
                name: "view",
                path: "/view/:item_id([_\\d]+)/:post_id(\\d+)?",
                component: () => import("@/views/item/detail.vue"),
            },

            // 清单单页
            {
                name: "plan_view",
                path: "/plan_view/:plan_id(\\d+)",
                component: () => import("@/views/item/plan-detail.vue"),
            },
            // 编辑清单
            {
                name: "plan_edit",
                path: "/plan_edit/:plan_id(\\d+)",
                component: () => import("@/views/item/plan-edit.vue"),
            },
            // 清单列表
            {
                name: "plan_list",
                path: "/plan_list/:keyword(.+)?",
                component: () => import("@/views/item/plan-list.vue"),
            },
            { name: "waiting", path: "/waiting", component: () => import("@/views/item/waiting.vue") },
        ],
    },
];

if (isMiniProgram()) {
    routes.forEach((route) => {
        if (route.path === "/") {
            route.component = () => import("@/views/base.vue");
            route.children.forEach((child) => {
                if (child.name === "home") {
                    child.component = () => import("@/views/item/mobile/index.vue");
                }
                if (child.name === "view") {
                    child.component = () => import("@/views/item/mobile/detail.vue");
                }
                if (child.name === "plan_list") {
                    child.component = () => import("@/views/item/mobile/plan-list.vue");
                }
                if (child.name === "plan_view") {
                    child.component = () => import("@/views/item/mobile/plan-detail.vue");
                }
            });
        }
    });
}

const router = new VueRouter({
    routes,
    base: "/item",
    mode: "history",
});

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    next();
});

export default router;
