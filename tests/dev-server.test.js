import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const webpack = require("webpack");
const DevServer = require("webpack-dev-server");
const HtmlPlugin = require("html-webpack-plugin");
const config = require("../vue.config.js");

test("开发服务器不会暴露原始模板，并能处理异常 favicon URL", async () => {
    const output = await mkdtemp(path.join(tmpdir(), "wiki-dev-test-"));
    const compiler = webpack({
        mode: "development",
        entry: {},
        output: { path: output, publicPath: "/" },
        plugins: Object.values(config.pages).map((page) => new HtmlPlugin({
            template: path.resolve(page.template),
            filename: page.filename,
            title: page.title,
            templateParameters: { BASE_URL: "/" },
        })),
        infrastructureLogging: { level: "none" },
    });
    const server = new DevServer({
        ...config.devServer,
        host: "127.0.0.1", port: 0, proxy: {}, hot: false, client: false,
        setupExitSignals: false,
        static: { directory: path.resolve("public"), ...config.devServer.static },
        historyApiFallback: config.devServer.historyApiFallback || {
            rewrites: Object.keys(config.pages).map((name) => ({
                from: new RegExp(`^/${name}`), to: `/${config.pages[name].filename}`,
            })),
        },
        devMiddleware: { stats: "errors-only" },
    }, compiler);
    try {
        await server.start();
        const base = `http://127.0.0.1:${server.server.address().port}`;
        for (const route of ["/pvp/", "/pvx/", "/index.html", "/%69ndex.html", "/"]) {
            const response = await fetch(base + route, { headers: { accept: "text/html" } });
            const html = await response.text();
            assert.equal(response.status, 200, route);
            assert(!html.includes("<%="), `${route} 暴露了未编译模板`);
            assert(html.includes(config.pages.cj.title), route);
        }
        for (const [name, page] of Object.entries(config.pages)) {
            const response = await fetch(`${base}/${name}/detail/1`, { headers: { accept: "text/html" } });
            assert((await response.text()).includes(page.title), name);
        }
        const malformed = await fetch(base + "/pvp/%3C%=%20BASE_URL%20%%3Efavicon.ico");
        assert.equal(malformed.status, 400);
        assert.equal(await malformed.text(), "Bad Request");
        assert.equal((await fetch(base + "/favicon.ico")).status, 200);
        assert.equal((await fetch(base + "/missing.js")).status, 404);
    } finally {
        await server.stop();
        await rm(output, { recursive: true, force: true });
    }
});
