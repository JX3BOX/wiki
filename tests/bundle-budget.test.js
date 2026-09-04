import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const budgetScript = fileURLToPath(new URL("../scripts/check-bundle-budget.mjs", import.meta.url));
const entryNames = ["cj", "item", "quest", "knowledge"];

async function createFixture(scriptUrl, scriptContent = "console.log('bundle budget fixture');\n") {
    const root = await mkdtemp(path.join(tmpdir(), "wiki-bundle-budget-"));
    await mkdir(path.join(root, "assets"));
    await writeFile(path.join(root, "assets/app.js"), scriptContent);
    await writeFile(path.join(root, "assets/app.css"), "body { color: #333; }\n");

    const html = [
        "<!doctype html><html><head>",
        `<script defer src="${scriptUrl}"></script>`,
        '<script data-src="https://cdn.example.test/missing-placeholder.js"></script>',
        '<link href="https://cdn.example.test/another-prefix/assets/app.css" rel="stylesheet">',
        '<link data-href="https://cdn.example.test/missing-placeholder.css" data-rel="stylesheet">',
        '<link rel="prefetch" href="https://cdn.example.test/missing-lazy.js">',
        "</head><body></body></html>",
    ].join("");
    await Promise.all(
        entryNames.map(async (entry) => {
            const directory = path.join(root, entry);
            await mkdir(directory);
            await writeFile(path.join(directory, "index.html"), html);
        })
    );
    return root;
}

test("构建体积门禁按 dist 资源后缀解析 CDN URL 并忽略 prefetch", async () => {
    const fixture = await createFixture("https://cdn.example.test/custom-prefix/assets/app.js?v=1");
    try {
        const result = spawnSync(process.execPath, [budgetScript, fixture], { encoding: "utf8" });
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /Bundle budget passed/);
        assert.match(result.stdout, /initial union gzip/);
    } finally {
        await rm(fixture, { recursive: true, force: true });
    }
});

test("构建体积门禁在 HTML 资源无法对应构建产物时失败", async () => {
    const fixture = await createFixture("https://cdn.example.test/custom-prefix/assets/missing.js");
    try {
        const result = spawnSync(process.execPath, [budgetScript, fixture], { encoding: "utf8" });
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /dist 中不存在的资源/);
    } finally {
        await rm(fixture, { recursive: true, force: true });
    }
});

test("构建体积门禁在 JavaScript 超出预算时失败", async () => {
    const fixture = await createFixture(
        "https://cdn.example.test/custom-prefix/assets/app.js",
        randomBytes(800 * 1024)
    );
    try {
        const result = spawnSync(process.execPath, [budgetScript, fixture], { encoding: "utf8" });
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /最大 JavaScript 资源/);
    } finally {
        await rm(fixture, { recursive: true, force: true });
    }
});
