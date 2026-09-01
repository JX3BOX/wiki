<template>
    <div>
        <div class="m-menus">
            <a
                class="u-menu"
                :class="pathname.indexOf(menu.value) > -1 && 'is-active'"
                v-for="menu in menus"
                :key="menu.value"
                :href="`/${menu.value}`"
            >
                {{ menu.label }}
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "CommonMenu",
    data() {
        return {
        };
    },
    computed: {
        menus() {
            return [
                {
                    label: this.$t("ui.types.achievement"),
                    value: "cj",
                },
                {
                    label: this.$t("ui.types.item"),
                    value: "item",
                },
                {
                    label: this.$t("ui.types.quest"),
                    value: "quest",
                },
                {
                    label: this.$t("ui.types.knowledge"),
                    value: "knowledge",
                },
            ];
        },
        pathname() {
            return location.pathname;
        },
    },
};
</script>
