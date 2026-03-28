const path = require("path");
const webpack = require("webpack");
const pkg = require("./package.json");
const { JX3BOX } = require("@jx3box/jx3box-common");
const commonDomains = require("@jx3box/jx3box-common/data/jx3box.json");

const pages = {
    index: {
        title: "剑三 Wiki - JX3BOX",
        entry: "src/main.js",
        template: "public/index.html",
        filename: "index.html",
    },
    achievement: {
        title: "成就总览 - JX3BOX",
        template: "public/index.html",
        entry: "src/pages/wiki.js",
        filename: "wiki/index.html",
    },
    cj: {
        title: "成就百科 - JX3BOX",
        template: "public/index.html",
        entry: "src/pages/cj.js",
        filename: "cj/index.html",
    },
    item: {
        title: "物品百科 - JX3BOX",
        template: "public/index.html",
        entry: "src/pages/item.js",
        filename: "item/index.html",
    },
    quest: {
        title: "任务百科 - JX3BOX",
        template: "public/index.html",
        entry: "src/pages/quest.js",
        filename: "quest/index.html",
    },
    knowledge: {
        title: "通识百科 - JX3BOX",
        template: "public/index.html",
        entry: "src/pages/knowledge.js",
        filename: "knowledge/index.html",
    },
    macros: {
        title: "云端宏排行榜 - JX3BOX",
        entry: "src/pages/macros.js",
        template: "public/macro.html",
        filename: "macro/tops/index.html",
    },
    macro: {
        title: "云端宏 - JX3BOX",
        entry: "src/pages/macro.js",
        template: "public/macro.html",
        filename: "macro/details/index.html",
    },
};

module.exports = {
    productionSourceMap: false,
    lintOnSave: false,
    pages,
    outputDir: process.env.BUILD_MODE === "preview" ? path.resolve(__dirname, pkg.name) : "dist",
    publicPath:
        (process.env.NODE_ENV === "development" && "/") ||
        (process.env.BUILD_MODE === "preview" && `/${pkg.name}/`) ||
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath.origin}${pkg.name}/`) ||
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath.github}${pkg.name}/`) ||
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath.jsdelivr}${pkg.name}@gh-pages/`) ||
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath.mirror}${pkg.name}/`) ||
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
        (process.env.STATIC_PATH === "root" && "/") ||
        "/",
    devServer: {
        host: "localhost",
        proxy: {
            ...buildEnvProxy(),
            ...buildDirectProxy("/api/next2", process.env.VUE_APP_NEXT_API || commonDomains.__next),
            ...buildDirectProxy("/api/summary-any", process.env.VUE_APP_NEXT_API || commonDomains.__next),
            ...buildDirectProxy("/api/summary", process.env.VUE_APP_NEXT_API || commonDomains.__next),
        },
        allowedHosts: "all",
        port: process.env.DEV_PORT || 12028,
    },
    css: {
        loaderOptions: {
            sass: {
                sassOptions: {
                    quietDeps: true,
                },
            },
            scss: {
                sassOptions: {
                    quietDeps: true,
                },
            },
        },
    },
    transpileDependencies: [
        "htmlparser2",
        "cheerio",
        "dom-serializer",
        "domelementtype",
        "domhandler",
        "domutils",
        "entities",
        "parse5",
        "parse5-htmlparser2-tree-adapter",
        "@jx3box/jx3box-editor",
    ],
    configureWebpack: {
        stats: {
            warningsFilter: [/node_modules[\\\\/]+@jx3box[\\\\/]+jx3box-common[\\\\/]+/],
        },
        plugins: [
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false,
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
            }),
        ],
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set("vue", "@vue/compat")
            .set("@jx3box/jx3box-common-ui/service/bus", "@jx3box/jx3box-ui/utils/bus")
            .set("@jx3box/jx3box-common-ui", "@jx3box/jx3box-ui")
            .set(
                "@jx3box/jx3box-common-ui/src/interact/boxcoin_records.vue",
                "@jx3box/jx3box-ui/src/interact/BoxcoinRecords.vue"
            )
            .set("@jx3box/jx3box-common-ui/assets/css/thx.less", "@jx3box/jx3box-ui/assets/css/single/thx.less")
            .set("@jx3box/jx3box-ui/src/interact/boxcoin_records.vue", "@jx3box/jx3box-ui/src/interact/BoxcoinRecords.vue")
            .set("@jx3box/jx3box-ui/assets/css/thx.less", "@jx3box/jx3box-ui/assets/css/single/thx.less")
            .set("@jx3box/jx3box-common/js/https", "@jx3box/jx3box-common/js/api")
            .set("@jx3box/jx3box-common/js/api_misc", "@jx3box/jx3box-common/js/system")
            .set("@jx3box/jx3box-common/js/wiki_v2", "@jx3box/jx3box-common/js/wiki")
            .set("@jx3box/jx3box-common/js/wiki_v2.js", "@jx3box/jx3box-common/js/wiki.js")
            .set(
                "@jx3box/jx3box-editor/assets/js/item/color.js",
                "@jx3box/jx3box-editor/src/assets/js/item/color.js"
            );

        config.module
            .rule("vue")
            .use("vue-loader")
            .tap((options = {}) => ({
                ...options,
                compilerOptions: {
                    ...(options.compilerOptions || {}),
                    compatConfig: {
                        MODE: 2,
                        COMPILER_V_BIND_OBJECT_ORDER: false,
                    },
                },
            }));

        config.module.rule("images").set("parser", {
            dataUrlCondition: {
                maxSize: 4 * 1024,
            },
        });

        config.module.rule("svg").exclude.add(path.join(__dirname, "src/assets/img/icon")).end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(path.join(__dirname, "src/assets/img/icon"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            });

        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));

        config.externals = {
            tinyMCE: "tinyMCE",
        };
    },
};

function addStyleResource(rule) {
    const preloadStyles = [
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/mixin.less"),
        path.resolve(__dirname, "./src/assets/css/var.less"),
        path.resolve(__dirname, "./src/assets/css/mixin.less"),
        path.resolve(__dirname, "./node_modules/csslab/base.less"),
    ];

    rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preloadStyles,
    });
}

function normalizeTarget(value) {
    if (!value) return "";
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed.replace(/^\/+/, "")}`;
}

function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildDirectProxy(context, target) {
    const normalized = normalizeTarget(target);
    if (!normalized) return {};
    return {
        [context]: {
            target: normalized,
            changeOrigin: true,
            secure: false,
            cookieDomainRewrite: "",
        },
    };
}

function buildEnvProxy() {
    const nodeEnv = String(process.env.NODE_ENV || "").toLowerCase();
    if (nodeEnv && nodeEnv !== "development") return {};

    const rawEnabled = String(process.env.VUE_APP_PROXY_ENABLE || "").toLowerCase();
    const disabled = ["0", "false", "no", "off"].includes(rawEnabled);
    if (disabled) return {};

    const prefix = process.env.VUE_APP_PROXY_PREFIX || "/__proxy";
    const mk = (serviceKey, target) => {
        const normalized = normalizeTarget(target);
        if (!normalized) return {};
        const context = `${prefix}/${serviceKey}`;
        const contextRe = new RegExp(`^${escapeRegExp(context)}`);
        return {
            [context]: {
                target: normalized,
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: (url) => url.replace(contextRe, ""),
            },
        };
    };

    const serviceTargets = {
        cms: process.env.VUE_APP_CMS_API || commonDomains.__cms,
        next: process.env.VUE_APP_NEXT_API || commonDomains.__next,
        team: process.env.VUE_APP_TEAM_API || commonDomains.__team,
        pay: process.env.VUE_APP_PAY_API || commonDomains.__pay,
        lua: process.env.VUE_APP_LUA_API || commonDomains.__lua,
        node: process.env.VUE_APP_NODE_API || commonDomains.__node,
        helper: process.env.VUE_APP_HELPER_API || commonDomains.__helperUrl,
        gs: process.env.VUE_APP_GS_API || "https://gs.jx3box.com",
    };

    return Object.keys(serviceTargets).reduce((acc, key) => Object.assign(acc, mk(key, serviceTargets[key])), {});
}
