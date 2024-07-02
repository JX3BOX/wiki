<template>
    <div class="m-knowledge-panel">
        <div class="m-title">
            <span class="u-title-left"> <i class="el-icon-postcard"></i><span> 术语大全</span> </span>
            <router-link class="u-more" to="/type/jargon">查看更多 &raquo;</router-link>
        </div>
        <div class="m-panel m-jargon">
            <div v-for="(item, index) in list" :key="index" class="u-jargon">
                <i class="el-icon-collection-tag"></i
                ><router-link class="u-name" :to="'/view/' + item.id">{{ item.name }}</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { getKnowledgeList } from "@/service/knowledge.js";
export default {
    name: "Jargon",
    props: [],
    data: function () {
        return {
            list: "",
        };
    },
    computed: {},
    watch: {},
    methods: {
        getJargon: function () {
            getKnowledgeList({
                type: "jargon",
                per: 48,
            }).then((res) => {
                this.list = res.data.data?.list || [];
            });
        },
    },
    created: function () {
        this.getJargon();
    },
};
</script>
<style lang="less" scoped>
.m-jargon {
    // .flex;
    .r(5px);
    .fz(14px);
    .mb(10px);
    // flex-wrap: wrap;
    background-color: #fafbfc;
    padding: 10px 20px;
    border: 1px solid #eee;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    overflow: hidden;
    .u-jargon {
        .flex;
        padding:5px;
        // .mb(10px);
        flex-shrink: 0;
        align-items: center;
        .u-name {
            .db;
            .nobreak;
            .color(#0366d6,@pink);
        }
        i {
            .mr(2px);
        }
    }
}
@media screen and (max-width: @phone) {
    .m-jargon {
        // grid-template-columns: repeat(2, 1fr);
        grid-template-columns: repeat(2, minmax(100px, 1fr));
    }
}
</style>
