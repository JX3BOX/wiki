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
                meta: {
                    i18n: {
                        title: "pages.cj.home.title",
                        keywords: "pages.cj.home.keywords",
                        description: "pages.cj.home.description",
                    },
                },
                beforeEnter: () => {
                    store.state.sidebar.general = 1;
                },
            },
            {
                name: "normal",
                path: "/:sub(\\d+)/:detail(\\d+)?",
                component: Normal,
                meta: {
                    i18n: {
                        title: "pages.cj.normal.title",
                        keywords: "pages.cj.normal.keywords",
                        description: "pages.cj.normal.description",
                    },
                },
                beforeEnter: () => {
                    store.state.sidebar.general = 1;
                },
            },
            {
                name: "top_five",
                path: "/top_five/:sub(\\d+)?/:detail(\\d+)?",
                component: Normal,
                meta: {
                    i18n: {
                        title: "pages.cj.top_five.title",
                        keywords: "pages.cj.top_five.keywords",
                        description: "pages.cj.top_five.description",
                    },
                },
                beforeEnter: () => {
                    store.state.sidebar.general = 2;
                },
            },
            {
                name: "view",
                path: "/view/:source_id(\\d+)/:post_id(\\d+)?",
                component: Detail,
                meta: {
                    i18n: {
                        title: "pages.cj.view.title",
                        keywords: "pages.cj.view.keywords",
                        description: "pages.cj.view.description",
                    },
                },
            },
            {
                name: "search",
                path: "/search/:keyword(.*)?",
                component: Search,
                meta: {
                    i18n: {
                        title: "pages.cj.search.title",
                        keywords: "pages.cj.search.keywords",
                        description: "pages.cj.search.description",
                    },
                },
            },
            {
                name: "newest",
                path: "/newest",
                component: Newest,
                meta: {
                    i18n: {
                        title: "pages.cj.newest.title",
                        keywords: "pages.cj.newest.keywords",
                        description: "pages.cj.newest.description",
                    },
                },
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
            {
                name: "waiting",
                path: "/waiting",
                component: Waiting,
                meta: {
                    i18n: {
                        title: "pages.cj.waiting.title",
                        keywords: "pages.cj.waiting.keywords",
                        description: "pages.cj.waiting.description",
                    },
                },
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
            {
                name: "adventure",
                path: "/adventure",
                component: Adventure,
                meta: {
                    i18n: {
                        title: "pages.cj.adventure.title",
                        keywords: "pages.cj.adventure.keywords",
                        description: "pages.cj.adventure.description",
                    },
                },
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
            {
                name: "rare",
                path: "/rare",
                component: Rare,
                meta: {
                    i18n: {
                        title: "pages.cj.rare.title",
                        keywords: "pages.cj.rare.keywords",
                        description: "pages.cj.rare.description",
                    },
                },
                beforeEnter: () => {
                    store.state.sidebar.general = 3;
                },
            },
        ],
    },

    {
        name: "view_alias",
        path: "/:id(\\d+)",
        redirect: (to) => {
            return `/view/${to.params.id}`;
        },
    },
    {
        name: "achievement_alias",
        path: "/achievement/:id(\\d+)",
        redirect: (to) => {
            return `/view/${to.params.id}`;
        },
    },
    {
        name: "achievement_view_alias",
        path: "/achievement/view/:id(\\d+)",
        redirect: (to) => {
            return `/view/${to.params.id}`;
        },
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
            route.component = () => import("@/App.vue");
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
