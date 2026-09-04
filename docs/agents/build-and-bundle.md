# Wiki 构建与体积门禁

## 构建入口

正式构建包含四个 Wiki 入口：

- `cj`
- `item`
- `quest`
- `knowledge`

## CI 顺序

正式发布：

1. 安装依赖。
2. 执行 `npm test`。
3. 执行 `npm run lint`。
4. 执行 `npm run build`。
5. 执行 `npm run check:bundle`。
6. 发布构建产物。

预览发布：

1. 安装依赖。
2. 执行 `npm test`。
3. 执行 `npm run lint`。
4. 执行 `npm run build:dev`。
5. 发布预览产物。

## 体积预算

`scripts/check-bundle-budget.mjs` 执行以下 gzip 门禁：

| 指标 | 上限 |
| --- | ---: |
| 单入口首屏资源 | 440 KiB |
| 四入口首屏资源并集 | 450 KiB |
| 最大单个 JavaScript 文件 | 768 KiB |

首屏统计以入口 HTML 直接引用的 JS/CSS 为准，忽略 prefetch。带 CDN 前缀的资源应按构建路径后缀映射到本地 `dist` 文件；HTML 引用无法对应构建产物时必须失败。

## 2026-09-04 验证快照

| 入口/指标 | gzip |
| --- | ---: |
| cj 首屏 | 405.20 KiB |
| item 首屏 | 405.02 KiB |
| quest 首屏 | 404.84 KiB |
| knowledge 首屏 | 404.62 KiB |
| 四入口并集 | 414.10 KiB |
| 最大 JavaScript | 757.60 KiB |

最大 JavaScript 距门禁约 10.4 KiB，后续新增代码时应优先检查依赖入口和重复打包，但不能通过改变默认页面加载行为来换取体积。

## 依赖边界

本轮没有升级公共依赖、增加第三方依赖或修改公共库源码。`package.json` 只新增 `check:bundle` 命令，依赖版本和 `package-lock.json` 保持不变。

相关验证：

- `tests/bundle-budget.test.js`
- `tests/legacy-bundle-regressions.test.js`
- `tests/jx3box-ui-on-demand.test.js`
- `tests/source-contracts.test.js`
