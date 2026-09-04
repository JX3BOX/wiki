import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const distRoot = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(repoRoot, "dist");
const entries = ["cj", "item", "quest", "knowledge"];
const budgets = {
    initialEntryGzipKiB: 440,
    initialUnionGzipKiB: 450,
    largestJavaScriptGzipKiB: 768,
};

const gzipSizeCache = new Map();

function formatKiB(bytes) {
    return `${(bytes / 1024).toFixed(2)} KiB`;
}

function readAttribute(tag, name) {
    return tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1] || "";
}

function collectInitialAssetUrls(html) {
    const scriptUrls = [...html.matchAll(/<script\b[^>]*>/gi)].map((match) => readAttribute(match[0], "src"));
    const stylesheetUrls = [...html.matchAll(/<link\b[^>]*>/gi)]
        .filter((match) => readAttribute(match[0], "rel").toLowerCase().split(/\s+/).includes("stylesheet"))
        .map((match) => readAttribute(match[0], "href"));

    return [...scriptUrls, ...stylesheetUrls].filter(Boolean);
}

function createAssetInventory(files) {
    return files
        .filter((file) => /\.(?:js|css)$/.test(file))
        .map((file) => ({
            file,
            relativePath: path.relative(distRoot, file).split(path.sep).join("/"),
        }))
        .sort((left, right) => right.relativePath.length - left.relativePath.length);
}

function resolveAssetPath(url, inventory) {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(url, "https://bundle-budget.invalid").pathname);
    } catch {
        throw new Error(`无法解析构建资源 URL：${url}`);
    }

    const match = inventory.find(({ relativePath }) => {
        return pathname === `/${relativePath}` || pathname.endsWith(`/${relativePath}`);
    });
    if (!match) throw new Error(`HTML 引用了 dist 中不存在的资源：${url}`);
    return match.file;
}

async function gzipSize(filePath) {
    if (!gzipSizeCache.has(filePath)) {
        const content = await readFile(filePath);
        gzipSizeCache.set(filePath, gzipSync(content, { level: 9 }).byteLength);
    }
    return gzipSizeCache.get(filePath);
}

async function collectFiles(directory) {
    const directoryEntries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        directoryEntries.map((entry) => {
            const target = path.join(directory, entry.name);
            return entry.isDirectory() ? collectFiles(target) : [target];
        })
    );
    return files.flat();
}

async function checkInitialEntries(failures, inventory) {
    const limit = budgets.initialEntryGzipKiB * 1024;
    const union = new Set();

    for (const entry of entries) {
        const htmlPath = path.join(distRoot, entry, "index.html");
        const html = await readFile(htmlPath, "utf8");
        const assetUrls = collectInitialAssetUrls(html);
        const assetPaths = [...new Set(assetUrls.map((url) => resolveAssetPath(url, inventory)))];
        if (!assetPaths.length) throw new Error(`${entry}/index.html 没有可检查的首屏 JS/CSS 资源`);

        assetPaths.forEach((assetPath) => union.add(assetPath));
        const sizes = await Promise.all(assetPaths.map(gzipSize));
        const total = sizes.reduce((sum, size) => sum + size, 0);

        console.log(`${entry.padEnd(9)} initial gzip ${formatKiB(total)} / ${budgets.initialEntryGzipKiB} KiB`);
        if (total > limit) {
            failures.push(`${entry} 首屏资源 ${formatKiB(total)} 超过 ${budgets.initialEntryGzipKiB} KiB`);
        }
    }

    const unionSizes = await Promise.all([...union].map(gzipSize));
    const unionTotal = unionSizes.reduce((sum, size) => sum + size, 0);
    console.log(`initial union gzip ${formatKiB(unionTotal)} / ${budgets.initialUnionGzipKiB} KiB`);
    if (unionTotal > budgets.initialUnionGzipKiB * 1024) {
        failures.push(`四入口首屏资源并集 ${formatKiB(unionTotal)} 超过 ${budgets.initialUnionGzipKiB} KiB`);
    }
}

async function checkLargestJavaScript(failures, inventory) {
    const javaScriptFiles = inventory.filter(({ file }) => file.endsWith(".js")).map(({ file }) => file);
    const sizes = await Promise.all(javaScriptFiles.map(async (file) => [file, await gzipSize(file)]));
    const [largestFile, largestSize] = sizes.sort((left, right) => right[1] - left[1])[0] || [];

    if (!largestFile) throw new Error("dist 中没有 JavaScript 构建产物");

    const relativePath = path.relative(distRoot, largestFile);
    console.log(`${relativePath.padEnd(24)} gzip ${formatKiB(largestSize)} / ${budgets.largestJavaScriptGzipKiB} KiB`);
    if (largestSize > budgets.largestJavaScriptGzipKiB * 1024) {
        failures.push(
            `最大 JavaScript 资源 ${relativePath} 为 ${formatKiB(largestSize)}，超过 ${
                budgets.largestJavaScriptGzipKiB
            } KiB`
        );
    }
}

const failures = [];

try {
    const files = await collectFiles(distRoot);
    const inventory = createAssetInventory(files);
    await checkInitialEntries(failures, inventory);
    await checkLargestJavaScript(failures, inventory);
} catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
}

if (failures.length) {
    console.error("\n构建体积检查失败：");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
} else {
    console.log("Bundle budget passed.");
}
