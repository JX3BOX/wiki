<template>
    <div class="m-wiki-robot__bottom">
        <div class="m-wiki-bottom__top">
            <div class="u-notice">
                <div class="u-title">[公告]</div>
                <div class="u-content">
                    <div>如发现攻略不全，请直接在游戏内或魔盒官方网站百科栏目修订提交或评论。</div>
                    <div>基于玩家共建的魔盒百科平台，人人都可参与。</div>
                    <div>{{ qrcodeUrl }}</div>
                </div>
            </div>
            <qrcode-vue class="u-qrcode" :value="qrcodeUrl" :size="60" level="H"></qrcode-vue>
        </div>
        <div class="m-wiki-bottom__bottom">—剑三魔盒QQ机器人—</div>
    </div>
</template>

<script>
import { __Root, __OriginRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import QrcodeVue from "qrcode.vue";
export default {
    name: "WikiRobotBottom",
    props: ["type", "id"],
    components: {
        QrcodeVue,
    },
    data() {
        return {};
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
        rootPath: function () {
            return this.client == "origin" ? __OriginRoot : __Root;
        },
        qrcodeUrl() {
            return `${this.rootPath}${this.type}/view/${this.id}`;
        },
    },
    mounted() {},
    methods: {},
};
</script>

<style lang="less">
.m-wiki-robot__bottom {
    margin: 12px 0;
    width: 100%;
    .m-wiki-bottom__top {
        .flex;
        justify-content: space-between;
    }
    .u-notice {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.75);
        width: 420px;
        .flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .u-qrcode {
        .size(68px);
        padding: 4px;
        background-color: #fff;
        .r(4px);
        box-sizing: border-box;
    }
    .m-wiki-bottom__bottom {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        font-weight: 400;
        letter-spacing: 10px;
        text-align: center;
        width: 100%;
        margin-top: 12px;
    }
}
</style>
