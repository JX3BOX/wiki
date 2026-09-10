<template>
    <div class="c-wiki-nav">
        <Menu class="c-wiki-menu" :class="{ 'is-vertical': !/^zh(?:-|$)/i.test($i18n.locale) }"></Menu>
        <div class="c-nav-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import Menu from "@/components/common/menu.vue";
export default {
    name: "CommonNav",
    components: {
        Menu,
    },
};
</script>

<style lang="less">
.c-wiki-nav {
    position: relative;
    .flex;
    height: 100%;
    width: 100%;
    gap: 10px;
    @w: 30px;
    // padding: 10px 0;
    .c-wiki-menu {
        position: fixed;
        top: 0;
        background-color: #ebeef5;
        height: 100%;
        .w(@w);
        flex-shrink: 0;
        &.is-vertical .u-menu {
            writing-mode: vertical-rl;
            text-orientation: mixed;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 5px;
            line-height: 20px;
        }

        .m-menus {
            // position: fixed;
            // top: 10px;
            .flex;
            flex-direction: column;
            gap: 10px;
        }
        .u-menu {
            box-sizing: border-box;
            padding: 8px 5px;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            width: 100%;
            text-align: center;
            // background-color: #eee;
            font-size: 12px;
            // letter-spacing: 1px;
            color: @color;
            cursor: pointer;
            &:hover {
                background-color: #f5f7fa;
                color: #000;
            }
            &.is-active {
                color: #fff;
                background-color: @color;
            }
        }
    }
    .c-nav-content {
        padding: 10px 0 10px 40px;
        flex: 1;
    }
}
</style>
