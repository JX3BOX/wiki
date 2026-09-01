<template>
    <div class="w-qrcode" @click="togglePic" :class="{ on: active }" v-if="mode == 'cms'">
        <img class="u-icon" svg-inline src="@/assets/img/common/qr-code.svg" />
        <span class="u-text">{{ $t("ui.common.qrcode.title") }}</span>
        <div class="u-qrcode">
            <qrcode-vue class="u-pic" :value="value" :size="size" level="H"></qrcode-vue>
            <span>{{ $t("ui.common.qrcode.scan") }}</span>
        </div>
    </div>
    <div class="w-qrcode-static" v-else-if="mode == 'static'">
        <div class="u-qrcode">
            <qrcode-vue class="u-pic" :value="value" :size="size" level="H"></qrcode-vue>
            <span class="u-txt"
                ><img class="u-icon" svg-inline src="@/assets/img/common/qr-code.svg" />{{
                    $t("ui.common.qrcode.scanMobile")
                }}</span
            >
        </div>
    </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
export default {
    name: "QRcode",
    props: ["href", "v", "s"],
    data: function () {
        return {
            value: this.href || location.href,
            size: this.s || 100,
            active: false,
            mode: this.v || "cms",
        };
    },
    computed: {},
    methods: {
        togglePic: function (e) {
            e.stopPropagation();
            this.active = !this.active;
        },
        handleDocumentClick() {
            this.active = false;
        },
    },
    mounted: function () {
        document.addEventListener("click", this.handleDocumentClick);
    },
    beforeUnmount() {
        document.removeEventListener("click", this.handleDocumentClick);
    },
    components: {
        QrcodeVue,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/common/qrcode.less";
</style>
