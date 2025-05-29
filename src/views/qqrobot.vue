<template>
    <div class="p-qqrobot-wiki-detail">
        <div class="m-wiki__container">
            <AchievementDetail v-if="type === 'cj'" :is-robot="true" :source-id="id"></AchievementDetail>
            <knowledgeSingle v-if="type === 'knowledge'" :is-robot="true" :source-id="id"></knowledgeSingle>
            <questSingle v-if="type === 'quest'" :is-robot="true" :source-id="id"></questSingle>
            <ItemDetail v-if="type === 'item'" :is-robot="true" :source-id="id"></ItemDetail>
        </div>
    </div>
</template>

<script>
import AchievementDetail from "@/views/cj/detail.vue";
import knowledgeSingle from "@/views/knowledge/knowledge-single.vue";
import questSingle from "@/views/quest/single.vue";
import ItemDetail from "@/views/item/detail.vue";
export default {
    name: "QQRobotWikiDetail",
    components: {
        AchievementDetail,
        knowledgeSingle,
        questSingle,
        ItemDetail,
    },
    computed: {
        type() {
            return this.$route.query.type || "";
        },
        id() {
            return this.$route.query.id || "";
        },
    },
};
</script>

<style lang="less">
.p-qqrobot-wiki-detail {
    position: relative;
    width: 560px;
    background-color: #000;
    box-sizing: border-box;
    .m-wiki__container {
        margin: 0 auto;
        width: 560px;
        height: 100%;
        overflow: hidden;
        .r(12px);
        padding: 10px;
        box-sizing: border-box;
        color: rgba(#ffffff, 0.75);
        border: 0.5px solid transparent;
        background-clip: padding-box, border-box;
        background-origin: padding-box, border-box;
        background-image: linear-gradient(to top, rgba(64, 64, 64, 1), rgba(87, 87, 87, 1)),
            linear-gradient(to top, #000, rgba(255, 255, 255, 0.75));

        overflow-y: auto;
    }
}
</style>
