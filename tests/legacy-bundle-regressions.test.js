import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const srcRoot = path.join(repoRoot, "src");

async function readSource(relativePath) {
    return readFile(path.join(repoRoot, relativePath), "utf8");
}

async function collectSourceFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const target = path.join(directory, entry.name);
            if (entry.isDirectory()) return collectSourceFiles(target);
            return /\.(?:js|vue)$/.test(entry.name) ? [target] : [];
        })
    );
    return files.flat();
}

test("项目源码只按函数入口加载 lodash", async () => {
    const files = await collectSourceFiles(srcRoot);
    const offenders = [];
    const rootImportPattern = /(?:from\s*["']lodash["']|require\(\s*["']lodash["']\s*\))/;

    for (const file of files) {
        const source = await readFile(file, "utf8");
        if (rootImportPattern.test(source)) offenders.push(path.relative(repoRoot, file));
    }

    assert.deepEqual(offenders, []);
});

test("正式与预览发布均在构建前执行测试和 lint", async () => {
    const workflows = [
        [".github/workflows/build.yml", "npm run build"],
        [".github/workflows/preview.yml", "npm run build:dev"],
    ];

    for (const [workflowPath, buildCommand] of workflows) {
        const workflow = await readSource(workflowPath);
        const testIndex = workflow.indexOf("npm test");
        const lintIndex = workflow.indexOf("npm run lint");
        const buildIndex = workflow.indexOf(buildCommand);

        assert.ok(testIndex >= 0, workflowPath + " 缺少 npm test");
        assert.ok(lintIndex > testIndex, workflowPath + " 应在测试后执行 lint");
        assert.ok(buildIndex > lintIndex, workflowPath + " 应在质量检查后构建");
    }
});

test("正式发布在构建后检查四入口和 JavaScript 体积", async () => {
    const packageJson = JSON.parse(await readSource("package.json"));
    const workflow = await readSource(".github/workflows/build.yml");
    const budgetScript = await readSource("scripts/check-bundle-budget.mjs");

    assert.equal(packageJson.scripts["check:bundle"], "node scripts/check-bundle-budget.mjs");
    assert.ok(workflow.indexOf("npm run check:bundle") > workflow.indexOf("npm run build"));
    assert.match(budgetScript, /const entries = \["cj", "item", "quest", "knowledge"\]/);
    assert.match(budgetScript, /initialEntryGzipKiB:\s*440/);
    assert.match(budgetScript, /initialUnionGzipKiB:\s*450/);
    assert.match(budgetScript, /largestJavaScriptGzipKiB:\s*768/);
    assert.match(budgetScript, /from "node:zlib"/);
});
