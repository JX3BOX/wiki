<template>
    <!-- 对公共库版本做了增强 -->
    <BaseWikiPanel v-bind="panelBindings">
        <template v-if="$slots['head-before']" #head-before>
            <slot name="head-before"></slot>
        </template>
        <template v-if="$slots['head-title']" #head-title>
            <slot name="head-title"></slot>
        </template>
        <template v-if="$slots['head-actions']" #head-actions>
            <slot name="head-actions"></slot>
        </template>
        <template v-if="$slots['head-after']" #head-after>
            <slot name="head-after"></slot>
        </template>
        <template v-if="$slots['body-before']" #body-before>
            <slot name="body-before"></slot>
        </template>
        <template v-if="$slots.meta" #meta>
            <slot name="meta"></slot>
        </template>
        <template v-if="$slots.body" #body>
            <slot name="body"></slot>
        </template>
        <template v-if="$slots['body-after']" #body-after>
            <slot name="body-after"></slot>
        </template>
    </BaseWikiPanel>
    <DesignTask v-model="showDesignTask" :post="currentPost"></DesignTask>
</template>

<script>
import BaseWikiPanel from "@jx3box/jx3box-ui/src/wiki/WikiPanel.vue";
import DesignTask from "@/components/common/compat-design-task.vue";

export default {
    name: "WikiPanel",
    inheritAttrs: false,
    components: {
        BaseWikiPanel,
        DesignTask,
    },
    props: {
        wikiPost: {
            type: [Object, String],
            default: null,
        },
        scene: {
            type: String,
            default: "default",
        },
        border: {
            type: Boolean,
            default: true,
        },
        showQR: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            showDesignTask: false,
            currentPost: {},
        };
    },
    computed: {
        panelBindings() {
            return {
                ...this.$attrs,
                ...this.$props,
                class: this.$attrs.class,
                style: this.$attrs.style,
            };
        },
    },
    methods: {
        onPush() {
            this.showDesignTask = true;
            this.currentPost = {
                ...(this.wikiPost?.post || {}),
                post_title: this.wikiPost?.post?.title,
                post_type: this.wikiPost?.post?.type,
                ID: this.wikiPost?.post?.source_id,
            };
        },
    },
};
</script>

