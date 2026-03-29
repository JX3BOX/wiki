import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createJx3boxUiI18n, install as JX3BOX_UI } from "@jx3box/jx3box-ui";
import reporter from "@jx3box/jx3box-common/js/reporter";
import * as filters from "@/filters";
import LegacyIcon from "@/components/common/legacy-icon.vue";

import "@jx3box/jx3box-common/css/normalize.css";
import "@jx3box/jx3box-common/css/font.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
import "@jx3box/jx3box-common/css/element-fonticon.css";
import "@/assets/css/tailwind.css";

const installLegacyRuntime = (app) => {
    app.config.globalProperties.$filters = filters;
};

export const bootstrapApp = (RootComponent, { router, store } = {}) => {
    const app = createApp(RootComponent);

    if (router) app.use(router);
    if (store) app.use(store);

    const i18n = createJx3boxUiI18n({ locale: "zh-CN" });
    i18n.global.missingWarn = false;
    i18n.global.fallbackWarn = false;
    app.use(i18n);

    app.use(JX3BOX_UI);
    app.use(ElementPlus, { locale: zhCn });

    Object.entries(ElementPlusIconsVue).forEach(([name, component]) => {
        if (!app.component(name)) {
            app.component(name, component);
        }
    });
    app.component("LegacyIcon", LegacyIcon);

    installLegacyRuntime(app);

    if (typeof reporter.installVue3 === "function") {
        reporter.installVue3(app);
    }

    return app;
};
