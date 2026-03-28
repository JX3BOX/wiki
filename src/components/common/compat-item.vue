<script>
import LegacyItem from "@jx3box/jx3box-editor/src/Item.vue";

export default {
    name: "CompatItem",
    extends: LegacyItem,
    compatConfig: {
        // LegacyItem watches a computed tuple to react to prop changes, so Vue 3 array
        // mutation semantics are fine here and the compat warning is just noise.
        WATCH_ARRAY: false,
    },
};
</script>
