Vue.config.productionTip = false;

// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

// 通用UI模块
import JX3BOX_UI from "@jx3box/jx3box-common-ui";
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";
Vue.use(JX3BOX_UI);

// 数据与路由s
import router from "@/router/wiki";
import store from "@/store/cj";

import reporter from "@jx3box/jx3box-common/js/reporter";

reporter.install(Vue);

import App from "@/views/wiki/index.vue";
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
