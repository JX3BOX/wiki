import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/cj";
import { isMiniProgram } from "@jx3box/jx3box-common/js/utils";

// 组件懒加载
const Home = () => import("@/views/cj/home.vue");
const Normal = () => import("@/views/cj/normal.vue");
const Detail = () => import("@/views/cj/detail.vue");
const Search = () => import("@/views/cj/search.vue");
const Newest = () => import("@/views/cj/newest.vue");
const Waiting = () => import("@/views/cj/waiting.vue");
const OutPrint = () => import("@/views/cj/out-print.vue");
const Adventure = () => import("@/views/cj/adventure.vue");
const Rare = () => import("@/views/cj/rare.vue");
const App = () => import("@/views/cj/index.vue");

Vue.use(VueRouter);

const routes = [
    // 主页
    {
        name: "cj",
        path: "/",
        component: App,
        redirect: { name: "home" },
        children:[
            {
                name: "home",
                path: "/",
                component: Home,
                beforeEnter: (to, from, next) => {
                    store.state.sidebar.general = 1;
                    next();
                },
            },
            // 常规
            {
                name: "normal",
                path: "/:sub(\\d+)/:detail(\\d+)?",
                component: Normal,
                beforeEnter: (to, from, next) => {
                    store.state.sidebar.general = 1;
                    next();
                },
            },
            // 五甲
            {
                name: "top_five",
                path: "/top_five/:sub(\\d+)?/:detail(\\d+)?",
                component: Normal,
                beforeEnter: (to, from, next) => {
                    store.state.sidebar.general = 2;
                    next();
                },
            },
            // 单页
            { name: "view", path: "/view/:source_id(\\d+)/:post_id(\\d+)?", component: Detail },
            // 搜索
            { name: "search", path: "/search/:keyword(.*)?", component: Search },
            // 最新成就
            {
                name: "newest",
                path: "/newest",
                component: Newest,
                beforeEnter: (to, from, next) => {
                    store.state.sidebar.general = 3;
                    next();
                },
            },
            // 待攻略成就
            {
                name: "waiting",
                path: "/waiting",
                component: Waiting,
                beforeEnter: (to, from, next) => {
                    store.state.sidebar.general = 3;
                    next();
                },
            },
            // 绝版成就
            // {
            //     name: 'out_print', path: '/out_print', component: OutPrint, beforeEnter: (to, from, next) => {
            //         store.state.sidebar.general = 3;
            //         next();
            //     }
            // },
            // 奇遇成就
            {
                name: "adventure",
                path: "/adventure",
                component: Adventure,
                beforeEnter: (to, from, next) => {
                    store.state.sidebar.general = 3;
                    next();
                },
            },
            // 宠物成就
            {
                name: "rare",
                path: "/rare",
                component: Rare,
                beforeEnter: (to, from, next) => {
                    store.state.sidebar.general = 3;
                    next();
                },
            },
        ]
    }
];

if (isMiniProgram()){
    routes.forEach(route => {
        if (route.path === "/") {
            route.children.forEach(child => {
                if (child.name === 'home') {
                    child.component = () => import("@/views/cj/mobile/index.vue");
                }else if (child.name === 'view') {
                    child.component = () => import("@/views/cj/mobile/detail.vue");
                }
            })
            route.component = () => import("@/views/base.vue");
        }
    })
}

const router = new VueRouter({
    routes,
    base: "/cj",
    mode: "history",
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

router.beforeEach((to, from, next) => {
    if (to.fullPath.includes("/#")) {
        next(to.fullPath.replace("/#", ""));
    }
    if (to.fullPath.includes("/achievement")) {
        next(to.fullPath.replace("/achievement", ""));
    }
    next();
});

export default router;
