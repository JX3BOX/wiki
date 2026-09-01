<template>
    <div class="m-wiki-top">
        <div class="m-wiki-top__header">
            <h3 class="u-title"><LegacyIcon class="el-icon-news" />{{ $t("ui.quest.specialNotice") }}</h3>
        </div>
        <div class="m-wiki-top__content" v-html="data"></div>
    </div>
</template>

<script>
import { getBreadcrumb } from "@/service/quest";
export default {
    name: "WikiNotice",
    data() {
        return {
            data: [],
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            try {
                const data = sessionStorage.getItem("wiki_quest_ac");

                if (data) {
                    this.data = JSON.parse(data);
                } else {
                    getBreadcrumb("wiki_quest_ac").then((res) => {
                        this.data = res;
                        sessionStorage.setItem("wiki_quest_ac", JSON.stringify(this.data));
                    });
                }
            } catch (e) {
                this.data = "";
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/notice.less";
</style>
