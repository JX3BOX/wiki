import { createRouter, createWebHistory } from "vue-router";
import store from "../store/cj";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

const Home = () => import("@/views/cj/home.vue");
const Normal = () => import("@/views/cj/normal.vue");
const Detail = () => import("@/views/cj/detail.vue");
const Search = () => import("@/views/cj/search.vue");
const Newest = () => import("@/views/cj/newest.vue");
const Waiting = () => import("@/views/cj/waiting.vue");
const Adventure = () => import("@/views/cj/adventure.vue");
const Rare = () => import("@/views/cj/rare.vue");
const App = () => import("@/views/cj/index.vue");

const routes = [
    {
        name: "cj",
        path: "/",
        component: App,
        redirect: { name: "home" },
        children: [
            {
                name: "home",
                path: "/",
                component: Home,
                beforeEnter: () => {
                    store.state.sidebar.general = 1;
                },
            },
            {
                name: "normal",
                path: "/:sub(\\d+)/:detail(\\d+)?",
                component: Normal,
                beforeEnter: () => {
                    store.state.sidebar.general = 1;
                },
            },
            {
                name: "top_five",
                path: "/top_five/:sub(\\d+)?/:detail(\\d+)?",
                component: Normal,
                beforeEnter: () => {
                    store.state.sidebar.general = 2;
                },
            },
            { name: "view", path: "/view/:source_id(\\d+)/:post_id(\\d+)?", component: Detail },
            { name: "search", path: "/search/:keyword(.*)?", component: Search },
            {
                name: "newest",
                path: "/newest",
                component: Newest,
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
            {
                name: "waiting",
                path: "/waiting",
                component: Waiting,
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
            {
                name: "adventure",
                path: "/adventure",
                component: Adventure,
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
            {
                name: "rare",
                path: "/rare",
                component: Rare,
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
        ],
    },
];

if (isMiniProgram() || isApp()) {
    routes.forEach((route) => {
        if (route.path === "/") {
            route.children.forEach((child) => {
                if (child.name === "home") {
                    child.component = () => import("@/views/cj/mobile/index.vue");
                } else if (child.name === "view") {
                    child.component = () => import("@/views/cj/mobile/detail.vue");
                }
            });
            route.component = () => import("@/views/base.vue");
        }
    });
}

const router = createRouter({
    history: createWebHistory("/cj"),
    routes,
});

router.beforeEach((to) => {
    if (to.fullPath.includes("/#")) {
        return to.fullPath.replace("/#", "");
    }
    if (to.fullPath.includes("/achievement")) {
        return to.fullPath.replace("/achievement", "");
    }
    return true;
});

export default router;
