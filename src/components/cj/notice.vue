<template>
    <div class="m-wiki-top">
        <div class="m-wiki-top__header">
            <h3 class="u-title"><i class="el-icon-news"></i>公告</h3>
        </div>
        <!-- <div class="m-wiki-top__content" v-html="data"></div> -->
        <div class="m-wiki-top__content">
            如发现攻略不全，请直接在游戏内或魔盒官方网站百科栏目修订提交或评论。
            基于玩家共建的魔盒百科平台，人人都可参与。
            
        </div>
    </div>
</template>

<script>
import { getBreadcrumb } from "@/service/achievement";
export default {
    name: "WikiNotice",
    data() {
        return {
            data: [],
        };
    },
    mounted() {
        // this.loadData();
    },
    methods: {
        loadData() {
            try {
                const data = sessionStorage.getItem("wiki_cj_ac");

                if (data) {
                    this.data = JSON.parse(data);
                } else {
                    getBreadcrumb("wiki_cj_ac").then((res) => {
                        this.data = res
                        sessionStorage.setItem("wiki_cj_ac", JSON.stringify(this.data));
                    });
                }
            } catch (e) {
                this.data = '';
            }
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/notice.less";
</style>
