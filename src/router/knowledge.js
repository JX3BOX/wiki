import { createRouter, createWebHistory } from "vue-router";
import { isMiniProgram, isApp } from "@jx3box/jx3box-common/js/utils";

const KnowledgeIndex = () => import("@/views/knowledge/knowledge-index.vue");
const KnowledgeList = () => import("@/views/knowledge/knowledge-list.vue");
const KnowledgeSingle = () => import("@/views/knowledge/knowledge-single.vue");
const Search = () => import("@/views/knowledge/search.vue");

const routes = [
    {
        name: "knowledge",
        path: "/",
        component: () => import("@/views/knowledge/knowledge.vue"),
        redirect: { name: "index" },
        children: [
            {
                name: "index",
                path: "/",
                component: KnowledgeIndex,
                meta: {
                    i18n: {
                        title: "pages.knowledge.index.title",
                        keywords: "pages.knowledge.index.keywords",
                        description: "pages.knowledge.index.description",
                    },
                },
            },
            {
                name: "normal",
                path: "/type/:knowledge_type([a-z_]+)",
                component: KnowledgeList,
                meta: {
                    i18n: {
                        title: "pages.knowledge.normal.title",
                        keywords: "pages.knowledge.normal.keywords",
                        description: "pages.knowledge.normal.description",
                    },
                },
            },
            {
                name: "view",
                path: "/view/:source_id(\\d+)/:post_id(\\d+)?",
                component: KnowledgeSingle,
                meta: {
                    i18n: {
                        title: "pages.knowledge.view.title",
                        keywords: "pages.knowledge.view.keywords",
                        description: "pages.knowledge.view.description",
                    },
                },
            },
            {
                name: "search",
                path: "/search/:keyword(.*)?",
                component: Search,
                meta: {
                    i18n: {
                        title: "pages.knowledge.search.title",
                        keywords: "pages.knowledge.search.keywords",
                        description: "pages.knowledge.search.description",
                    },
                },
            },
        ],
    },
];

if (isMiniProgram() || isApp()) {
    routes.forEach((route) => {
        if (route.path === "/") {
            route.component = () => import("@/App.vue");
            route.children.forEach((child) => {
                if (child.name === "index") {
                    child.component = () => import("@/views/knowledge/mobile/index.vue");
                }
                if (child.name === "view") {
                    child.component = () => import("@/views/knowledge/mobile/detail.vue");
                }
            });
        }
    });
}

const router = createRouter({
    history: createWebHistory("/knowledge"),
    routes,
});

router.beforeEach((to) => {
    if (to.fullPath.includes("/#")) {
        return to.fullPath.replace("/#", "");
    }
    return true;
});

export default router;
