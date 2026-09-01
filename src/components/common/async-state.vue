<script>
export default {
    name: "AsyncState",
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        error: {
            type: Boolean,
            default: false,
        },
        empty: {
            type: Boolean,
            default: false,
        },
        retryable: {
            type: Boolean,
            default: true,
        },
    },
    emits: ["retry"],
};
</script>

<template>
    <div v-if="error" class="m-list-empty w-async-state is-error">
        <slot name="error"><span>{{ $t("ui.common.status.loadFailed") }}</span></slot>
        <el-button v-if="retryable" link type="primary" @click="$emit('retry')">
            {{ $t("ui.common.actions.retry") }}
        </el-button>
    </div>
    <div v-else-if="!loading && empty" class="m-list-empty w-async-state is-empty">
        <slot name="empty">{{ $t("ui.common.status.noRecords") }}</slot>
    </div>
</template>
