const path = require("path");
const pkg = require("./package.json");
const { JX3BOX, SEO } = require("@jx3box/jx3box-common");
const VueProxyPlugin = require("@jx3box/jx3box-fe-proxy");

module.exports = {
    productionSourceMap: false, //关闭 source map 生成
    //❤️ Multiple pages ~
    pages: {
        index: {
            title: "剑三wiki - JX3BOX",
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
    },

    // ❤️ Porxy ~
    devServer: {
        proxy: {
            ...VueProxyPlugin.generateBuiltinProxy(),
            // 专门为直接的 /api/next2/ 路径配置代理到 dev.next2.jx3box.com
            "/api/next2": {
                target: "https://dev.next2.jx3box.com",
                changeOrigin: true,
                pathRewrite: {
                    "^/api/next2": "/api/next2",
                },
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/summary-any": {
                target: "https://dev.next2.jx3box.com",
                changeOrigin: true,
                pathRewrite: {
                    "^/api/next2": "/api/next2",
                },
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
            "/api/summary": {
                target: "https://dev.next2.jx3box.com",
                changeOrigin: true,
                pathRewrite: {
                    "^/api/next2": "/api/next2",
                },
                onProxyReq: function (request) {
                    request.setHeader("origin", "");
                },
            },
        },
        port: process.env.DEV_PORT || 12028, // 默认端口
    },

    outputDir: process.env["BUILD_MODE"] == "preview" ? path.resolve(__dirname, pkg.name) : "dist", // 指定构建输出的目录

    //❤️ define path for static files ~
    publicPath:
        //FOR Localhost => development
        (process.env.NODE_ENV === "development" && "/") ||
        (process.env.BUILD_MODE == "preview" && `/${pkg.name}/`) ||
        //BY origin
        (process.env.STATIC_PATH === "origin" && `${JX3BOX.__staticPath["origin"]}${pkg.name}/`) ||
        //BY github
        (process.env.STATIC_PATH === "github" && `${JX3BOX.__staticPath["github"]}${pkg.name}/`) ||
        //BY jsdelivr
        (process.env.STATIC_PATH === "jsdelivr" && `${JX3BOX.__staticPath["jsdelivr"]}${pkg.name}@gh-pages/`) ||
        //BY OSS=>CDN
        (process.env.STATIC_PATH === "mirror" && `${JX3BOX.__staticPath["mirror"]}${pkg.name}/`) ||
        //BY relative path
        (process.env.STATIC_PATH === "repo" && `/${pkg.name}/`) ||
        //BY root path or bind a domain
        (process.env.STATIC_PATH == "root" && "/") ||
        //for lost
        "/",

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
    ],

    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        // config.plugin("html").tap(args => {
        //     args[0].meta = {                            //------设置SEO信息
        //         Keywords: Setting.keys,
        //         Description: Setting.desc
        //     };
        //     args[0].title = Setting.title + Setting.seoSuffix;  //------自动添加标题后缀
        //     return args;
        // });

        //💝 in-line small imgs ~
        config.module
            .rule("images")
            .use("url-loader")
            .loader("url-loader")
            .tap((options) => Object.assign(options, { limit: 10240, esModule: false }));

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        var preload_styles = [];
        preload_styles.push(
            path.resolve(__dirname, "./node_modules/csslab/base.less"),
            path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
            path.resolve(__dirname, "./src/assets/css/var.less")
        );
        function addStyleResource(rule) {
            rule.use("style-resource").loader("style-resources-loader").options({
                patterns: preload_styles,
            });
        }
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
    },
};
