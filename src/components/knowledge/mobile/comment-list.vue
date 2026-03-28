<template>
    <MiniprogramCommentList :type="resolvedType" :source-id="resolvedSourceId" />
</template>

<script>
import MiniprogramCommentList from "@/components/cj/mobile/comment-list.vue";

export default {
    name: "CommentList",
    components: {
        MiniprogramCommentList,
    },
    props: {
        id: {
            type: [String, Number],
            default: 0,
        },
        sourceId: {
            type: [String, Number],
            default: 0,
        },
        category: {
            type: String,
            default: "knowledge",
        },
        type: {
            type: String,
            default: "",
        },
    },
    computed: {
        resolvedSourceId() {
            return this.sourceId || this.id;
        },
        resolvedType() {
            return this.type || this.category || "knowledge";
        },
    },
};
</script>
