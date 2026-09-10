# Wiki 构建与体积统计

## 构建入口

正式构建包含 `cj`、`item`、`quest`、`knowledge` 四个 Wiki 入口。

## CI 顺序

正式发布：

1. 安装依赖。
2. 执行 `npm test`。
3. 执行 `npm run lint`。
4. 执行 `npm run build`。
5. 发布构建产物。

预览发布使用 `npm run build:dev`，其余质量检查不变。

## 可选体积统计

需要分析构建体积时，可在构建后手动执行 `npm run check:bundle`。保留原命令和脚本路径以兼容已有调用，但只输出四个入口、首屏资源并集和最大 JavaScript 文件的 gzip 体积，不设置体积阈值，不因资源变大而失败。Actions 不执行此命令。

首屏统计以入口 HTML 直接引用的 JS/CSS 为准，忽略 prefetch。带 CDN 前缀的资源按构建路径后缀映射到本地 `dist` 文件。手动统计时，构建目录缺失或 HTML 引用的资源不存在仍会报错，表示无法生成有效报告。

## 维护约定

2026-09-11 按用户要求移除体积门禁。原门禁用于发现体积增长，但固定阈值会阻断正常依赖更新后的发布，因此不再作为发布条件。保留 Element Plus 完整安装及默认页面加载行为。

相关验证：

- `tests/bundle-budget.test.js`
- `tests/legacy-bundle-regressions.test.js`
- `tests/jx3box-ui-on-demand.test.js`
- `tests/source-contracts.test.js`
