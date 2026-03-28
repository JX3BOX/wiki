<template>
    <BaseGamePrice class="m-game-price" v-bind="$attrs" :price="price" :align="align" />
</template>

<script>
import BaseGamePrice from "@jx3box/jx3box-ui/src/wiki/GamePrice.vue";

export default {
    name: "GamePrice",
    inheritAttrs: false,
    components: {
        BaseGamePrice,
    },
    props: {
        price: {
            type: [Number, String],
            default: 0,
        },
        align: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped lang="less">
.m-game-price {
    img {
        .y;
    }
}
</style>
