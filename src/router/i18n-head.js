import { ref, watch } from "vue";

function normalizeHtmlLang(locale) {
    if (!locale) return "zh-CN";
    if (locale === "vi") return "vi";
    return String(locale);
}

function isMissingI18nValue(value, key) {
    if (value === undefined || value === null) return true;
    const str = String(value).trim();
    if (!str) return true;
    // vue-i18n 默认：找不到 key 会返回 key 本身
    return key ? str === String(key) : false;
}

function translateOrEmpty(i18n, key) {
    const value = i18n.global.t(key);
    return isMissingI18nValue(value, key) ? "" : value;
}

function withSuffix(title, suffix) {
    const base = String(title || "").trim();
    const normalizedSuffix = String(suffix || "");
    if (!base) return "";
    if (!normalizedSuffix) return base;
    if (base.endsWith(normalizedSuffix)) return base;
    return `${base}${normalizedSuffix}`;
}

function buildHeadObjFromRoute(to, i18n) {
    if (!to) return;
    if (!i18n || !i18n.global || typeof i18n.global.t !== "function") return;

    const locale =
        i18n.global.locale && typeof i18n.global.locale === "object" && "value" in i18n.global.locale
            ? i18n.global.locale.value
            : i18n.global.locale;

    const htmlLang = normalizeHtmlLang(locale);

    const i18nMeta = to.meta && to.meta.i18n ? to.meta.i18n : null;

    const rawTitleKey = i18nMeta && i18nMeta.title ? i18nMeta.title : "";
    const rawKeywordsKey = i18nMeta && i18nMeta.keywords ? i18nMeta.keywords : "";
    const rawDescriptionKey = i18nMeta && i18nMeta.description ? i18nMeta.description : "";

    const rawTitle = rawTitleKey ? i18n.global.t(rawTitleKey) : "";
    const rawKeywords = rawKeywordsKey ? i18n.global.t(rawKeywordsKey) : "";
    const rawDescription = rawDescriptionKey ? i18n.global.t(rawDescriptionKey) : "";
    const fallbackTitleKey = "pages.common.fallbackTitle";
    const fallbackKeywordsKey = "pages.common.fallbackKeywords";
    const fallbackDescriptionKey = "pages.common.fallbackDescription";
    const suffixKey = "pages.common.appendTitle";

    const fallbackTitle = translateOrEmpty(i18n, fallbackTitleKey);
    const fallbackKeywords = translateOrEmpty(i18n, fallbackKeywordsKey);
    const fallbackDescription = translateOrEmpty(i18n, fallbackDescriptionKey);
    const suffix = translateOrEmpty(i18n, suffixKey);
    const title = isMissingI18nValue(rawTitle, rawTitleKey) ? fallbackTitle : rawTitle;
    const keywords = isMissingI18nValue(rawKeywords, rawKeywordsKey) ? fallbackKeywords : rawKeywords;
    const description = isMissingI18nValue(rawDescription, rawDescriptionKey) ? fallbackDescription : rawDescription;

    const meta = [];
    if (keywords) meta.push({ name: "keywords", content: String(keywords) });
    if (description) meta.push({ name: "description", content: String(description) });

    return {
        title: withSuffix(title, suffix) || undefined,
        htmlAttrs: { lang: htmlLang },
        meta,
    };
}

export function initRouterI18nHead(router, i18n, head) {
    if (!router || !i18n || !head || typeof head.addHeadObjs !== "function") return;

    const headObjRef = ref({
        title: undefined,
        htmlAttrs: undefined,
        meta: [],
    });
    head.addHeadObjs(headObjRef);

    router.afterEach((to) => {
        headObjRef.value = buildHeadObjFromRoute(to, i18n) || headObjRef.value;
        head.updateDOM();
    });

    // 语言切换不会触发路由变化，额外监听 locale 变化后重刷当前路由 head
    const localeRef = i18n.global && i18n.global.locale;
    if (localeRef && typeof localeRef === "object" && "value" in localeRef) {
        watch(
            () => localeRef.value,
            () => {
                headObjRef.value = buildHeadObjFromRoute(router.currentRoute.value, i18n) || headObjRef.value;
                head.updateDOM();
            }
        );
    }

    // 首次进入时也补一遍（避免首屏 title 没被覆盖）
    headObjRef.value = buildHeadObjFromRoute(router.currentRoute.value, i18n) || headObjRef.value;
    head.updateDOM();
}
