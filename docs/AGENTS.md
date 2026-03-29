# 前端 css 命名规范

## 页面局部（单页面内的）

最长限制：`prefix-title-subtitle__block-subblock`

### 页面 p-

-   一级页面 `p-aigrow`（包含视图路由）
-   aigrow 应用标识符，erp，es，sensor
-   二级页面 `p-aigrow-gardens`（包含若干模块，本身业务上可以独立成一个页面）
-   sensor 主题标识符，insights，conf，monitor，setting

查询参数总是作用于页面内部，影响数据层面  
以下以果园概览为例：

### 模块 m-

#### 布局类模块

-   一级布局模块 `m-gardens-header`
-   二级布局模块 `m-gardens-header__left`（二级模块永远强绑定属于一级模块）
-   header 布局模块标识符，container，box，block，content，footer，sidebar

#### 业务类模块

-   一级功能模块 `m-gardens-tabs`、`m-gardens-toolbar`
-   二级功能模块 `m-gardens-list`、`m-gardens-pagination`
-   `m-gardens-null`、`m-gardens-list__item` （二级模块永远强绑定属于一级模块）

**注：模块总数属于一个页面，原则上最好扁平**

### 元素 u-

-   一级元素 `u-create`、`u-search`、`u-group`、`u-sort`
    m-setting-group （脱离举例）
-   二级元素 `u-group-icon`、`u-item-name` 本身不再有复杂的 DOM 结构

**注：元素总是属于一个模块**

## 全局范围

### 模块 c-

全局共用的模块（m-），不具备一个页面中多次复用，有自己的业务逻辑
`c-header`、`c-footer`、`c-sidebar`

### 组件 w-

全局复用的模块（w-），主要是一些功能上的，没有具体的业务
`w-dialog`、`w-codemirror`

**注：全局模块和全局组件，总是要严格 BEM 规范带前缀**  
`w-dialog__header`、`w-dialog__header-menu`

## 状态

### 模块模式 --status

`w-dialog--warning`、`w-dialog--success`

### 元素状态 .is-active

`u-title.is-disabled`、`u-title.is-active`
