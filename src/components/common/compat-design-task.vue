<script>
import DesignTask from "@jx3box/jx3box-ui/src/bread/DesignTask.vue";

export default {
    name: "CompatDesignTask",
    extends: DesignTask,
    compatConfig: {
        INSTANCE_ATTRS_CLASS_STYLE: "suppress-warning",
    },
};
</script>
