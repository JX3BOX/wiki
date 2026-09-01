<template>
    <div class="m-plan-equip" v-if="plan">
        <div class="u-plan-equip" :class="'u-equip-' + label" v-for="(item, label) in plan.relation" :key="label">
            <template v-if="item.length">
                <ItemIcon :item="item[0]" />
                <span class="u-name" :class="`quality-${item[0].Quality}`">{{ item[0].Name }}</span>
            </template>
        </div>
        <div class="u-info">
            <div class="u-title">{{ plan.title }}</div>
            <a class="u-author" :href="userpage" target="_blank">
                <img :src="avatar" class="u-author-avatar" />
                <span class="u-author-name">{{ username }}</span>
            </a>
            <div class="u-time">
                <LegacyIcon class="el-icon-date" />
                {{ showTime(plan.updated * 1000) }}
            </div>
            <div class="u-qrcodebox">
                <QRcode :href="link" :s="120" v="static" />
            </div>
        </div>
        <div class="u-misc">
            <a class="u-logo" :href="link" target="_blank">
                <img svg-inline src="@/assets/img/brand/jx3box.svg" />
                <span>{{ $t("ui.item.equipId") }}{{ plan.id }}</span>
            </a>
        </div>
    </div>
</template>

<script>
import QRcode from "@jx3box/jx3box-ui/src/interact/QRcode.vue";

import ItemIcon from "@/components/common/item-icon.vue";
import { authorLink } from "@jx3box/jx3box-common/js/utils";
import { showTime } from "@jx3box/jx3box-common/js/moment.js";
import { __Root, default_avatar } from "@/utils/config";

export default {
    name: "equip",
    props: ["data"],
    data: function () {
        return {};
    },
    computed: {
        plan: function () {
            return this.data;
        },
        avatar: function () {
            return this.plan?.user_info?.user_avatar || default_avatar;
        },
        username: function () {
            return this.plan?.user_info?.display_name || this.$t("ui.common.labels.anonymous");
        },
        uid: function () {
            return this.plan.user_id;
        },
        userpage: function () {
            return authorLink(this.uid);
        },
        link: function () {
            return this.plan ? __Root + `item/#/plan_view/${this.plan.id}` : "";
        },
    },
    methods: {
        showTime,
    },
    components: {
        ItemIcon,
        QRcode,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/equip.less";
</style>
