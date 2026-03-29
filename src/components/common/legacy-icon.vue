<template>
    <component
        :is="resolvedIcon"
        v-bind="forwardedAttrs"
        :class="forwardedClass"
        :data-legacy-icon="iconKey || null"
    />
</template>

<script>
const ICON_MAP = {
    "el-icon-aim": "Aim",
    "el-icon-apple": "Apple",
    "el-icon-arrow-down": "ArrowDown",
    "el-icon-arrow-left": "ArrowLeft",
    "el-icon-arrow-right": "ArrowRight",
    "el-icon-arrow-up": "ArrowUp",
    "el-icon-back": "Back",
    "el-icon-bottom": "Bottom",
    "el-icon-caret-bottom": "CaretBottom",
    "el-icon-caret-right": "CaretRight",
    "el-icon-caret-top": "CaretTop",
    "el-icon-chat-dot-round": "ChatDotRound",
    "el-icon-chat-line-round": "ChatLineRound",
    "el-icon-check": "Check",
    "el-icon-cherry": "Cherry",
    "el-icon-circle-close": "CircleClose",
    "el-icon-circle-plus-outline": "CirclePlus",
    "el-icon-close": "Close",
    "el-icon-coin": "Coin",
    "el-icon-collection": "Collection",
    "el-icon-collection-tag": "CollectionTag",
    "el-icon-connection": "Connection",
    "el-icon-coordinate": "Coordinate",
    "el-icon-crop": "Crop",
    "el-icon-d-arrow-left": "DArrowLeft",
    "el-icon-d-arrow-right": "DArrowRight",
    "el-icon-date": "Calendar",
    "el-icon-delete": "Delete",
    "el-icon-discover": "Compass",
    "el-icon-document-add": "DocumentAdd",
    "el-icon-download": "Download",
    "el-icon-edit": "Edit",
    "el-icon-edit-outline": "EditPen",
    "el-icon-film": "Film",
    "el-icon-goblet-square-full": "GobletSquareFull",
    "el-icon-grape": "Grape",
    "el-icon-guide": "Guide",
    "el-icon-ice-drink": "IceDrink",
    "el-icon-info": "InfoFilled",
    "el-icon-link": "Link",
    "el-icon-loading": "Loading",
    "el-icon-location-information": "LocationInformation",
    "el-icon-lock": "Lock",
    "el-icon-map-location": "MapLocation",
    "el-icon-medal": "Medal",
    "el-icon-mic": "Mic",
    "el-icon-minus": "Minus",
    "el-icon-monitor": "Monitor",
    "el-icon-more": "More",
    "el-icon-more-outline": "MoreFilled",
    "el-icon-news": "Notification",
    "el-icon-notebook-1": "Notebook",
    "el-icon-notebook-2": "Memo",
    "el-icon-orange": "Orange",
    "el-icon-pear": "Pear",
    "el-icon-plus": "Plus",
    "el-icon-position": "Position",
    "el-icon-postcard": "Postcard",
    "el-icon-price-tag": "PriceTag",
    "el-icon-question": "QuestionFilled",
    "el-icon-rank": "Rank",
    "el-icon-refresh": "Refresh",
    "el-icon-remove-outline": "RemoveFilled",
    "el-icon-right": "Right",
    "el-icon-school": "School",
    "el-icon-search": "Search",
    "el-icon-setting": "Setting",
    "el-icon-s-fold": "Fold",
    "el-icon-shopping-bag-1": "ShoppingBag",
    "el-icon-shopping-cart-full": "ShoppingCartFull",
    "el-icon-s-opportunity": "Opportunity",
    "el-icon-s-order": "List",
    "el-icon-s-shop": "Shop",
    "el-icon-star-off": "Star",
    "el-icon-star-on": "StarFilled",
    "el-icon-sugar": "Sugar",
    "el-icon-s-unfold": "Expand",
    "el-icon-tickets": "Tickets",
    "el-icon-time": "Clock",
    "el-icon-top": "Top",
    "el-icon-trophy": "Trophy",
    "el-icon-upload": "Upload",
    "el-icon-user": "User",
    "el-icon-video-play": "VideoPlay",
    "el-icon-warning-outline": "Warning",
    "el-icon-watermelon": "Watermelon",
};

const collectClasses = (value) => {
    if (!value) return [];
    if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
    if (Array.isArray(value)) return value.flatMap(collectClasses);
    if (typeof value === "object") {
        return Object.entries(value)
            .filter(([, enabled]) => enabled)
            .map(([className]) => className);
    }
    return [];
};

const resolveLegacyIcon = (value) => {
    const iconClass = collectClasses(value).find((className) => className.startsWith("el-icon-") && className !== "el-icon");
    return ICON_MAP[iconClass] || value || "QuestionFilled";
};

const extractLegacyIconKey = (value) => {
    return collectClasses(value).find((className) => className.startsWith("el-icon-") && className !== "el-icon") || "";
};

const stripLegacyClasses = (value) => {
    return collectClasses(value).filter((className) => !className.startsWith("el-icon-"));
};

export { ICON_MAP, resolveLegacyIcon };

export default {
    name: "LegacyIcon",
    inheritAttrs: false,
    props: {
        name: {
            type: [String, Array, Object],
            default: "",
        },
    },
    computed: {
        rawClass() {
            return this.$attrs.class ?? this.$?.vnode?.props?.class ?? "";
        },
        iconSource() {
            return this.name || this.rawClass;
        },
        iconKey() {
            return extractLegacyIconKey(this.iconSource);
        },
        resolvedIcon() {
            return resolveLegacyIcon(this.iconSource);
        },
        forwardedClass() {
            return ["legacy-icon", ...stripLegacyClasses(this.rawClass)];
        },
        forwardedAttrs() {
            const { class: className, ...attrs } = this.$attrs;
            return attrs;
        },
    },
};
</script>

<style>
.legacy-icon,
.legacy-icon--left,
.legacy-icon--right {
    width: 1em;
    height: 1em;
    fill: currentColor;
    color: inherit;
    vertical-align: middle;
}

.legacy-icon--left {
    margin-right: 5px;
}

.legacy-icon--right {
    margin-left: 5px;
}
</style>
