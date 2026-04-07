import { createApp } from "vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import vi from "element-plus/es/locale/lang/vi";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createHead } from "@vueuse/head";
import {
    createJx3boxUiI18n,
    getJx3boxUiAvailableLocales,
    install as JX3BOX_UI,
} from "@jx3box/jx3box-ui";
import { mergeAppLocaleMessages } from "@/locale";
import { initRouterI18nHead } from "@/router/i18n-head";
import LegacyIcon from "@/components/common/legacy-icon.vue";

import "@jx3box/jx3box-common/css/font.css";
import "@jx3box/jx3box-common/css/normalize.css";
import "@jx3box/jx3box-common/css/element-plus-theme.scss";
import "@jx3box/jx3box-common/css/element-fonticon.css";
import "@/assets/css/tailwind.css";

export const bootstrapApp = (RootComponent, { router, store } = {}) => {
    const app = createApp(RootComponent);

    if (router) app.use(router);
    if (store) app.use(store);

    const head = createHead();
    app.use(head);

    const langKey = (localStorage.getItem("lang") || "zh-cn").toLowerCase();
    const langMap = {
        "zh-cn": "zh-CN",
        "en-us": "en-US",
        "zh-tw": "zh-TW",
        vi: "vi",
    };
    const preferredLocale = langMap[langKey] || "zh-CN";
    const supportedLocales = getJx3boxUiAvailableLocales();
    const locale = supportedLocales.includes(preferredLocale) ? preferredLocale : "zh-CN";

    const i18n = createJx3boxUiI18n({ locale });
    mergeAppLocaleMessages(i18n);
    i18n.global.missingWarn = false;
    i18n.global.fallbackWarn = false;
    app.use(i18n);

    if (router) {
        initRouterI18nHead(router, i18n, head);
    }

    app.use(JX3BOX_UI);
    const elementLocaleMap = {
        "zh-CN": zhCn,
        "en-US": en,
        "zh-TW": zhTw,
        vi,
    };
    app.use(ElementPlus, {
        locale: elementLocaleMap[locale] || zhCn,
    });

    Object.entries(ElementPlusIconsVue).forEach(([name, component]) => {
        if (!app.component(name)) {
            app.component(name, component);
        }
    });
    app.component("LegacyIcon", LegacyIcon);

    return app;
};
