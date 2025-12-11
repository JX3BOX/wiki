<template>
    <div>
        <el-drawer
            :visible.sync="show"
            direction="btt"
            :show-close="false"
            :with-header="false"
            append-to-body
            custom-class="other-filter-drawer"
            size="400"
            @close="onClose"
            style="width:100%;"
        >
            <template #default>
                <div class="c-var m-confirm-ok">
                    <div class="u-content">
                        <div class="u-icon">
                            <img src="@/assets/img/cj/mobile/warn.svg" svg-inline />
                        </div>
                        确定要将其设为{{ current ? "未" : "已" }}完成吗
                    </div>
                    <div class="m-op">
                        <button class="u-confirm" @click="confirmResult">
                            确认
                        </button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>

export default {
    name: "ConfirmOkDrawer",
    components: { },
    emits: ["update:visible","confirm"],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        current: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
        }
    },
    watch:{
    },
    computed: {
        show: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            }
        },

    },
    methods: {
        onClose() {
            this.show = false;
        },
        confirmResult(){
            this.$emit("confirm")
            this.onClose();
        }
    },
}
</script>

<style lang="less">

.other-filter-drawer{
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
}

.m-confirm-ok {
    display: flex;
    flex-direction: column;
    background-color: #24292E;
    padding: 20px;
    min-height: 260px;
    position: relative;
    width: 100%;

    .u-content{
        display: flex;
        align-items: center;
        flex-direction:  column;
        width: 100%;

        .u-icon{
            width: 120px;
            height: 120px;
            color: rgba(255, 255, 255, 0.40);
        }

        color: rgba(255, 255, 255, 0.40);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px; /* 142.857% */

    }

    .m-op {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        padding: 20px 12px 30px;
        gap: 20px;
        background-color: #24292E;

        button {
            color:  rgba(28, 28, 28, 0.40);

            /* 16 Bold */
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */

            border-radius: var(--12, 12px);
            padding: var(--12, 12px) var(--16, 16px);
            border: none;

            &.u-reset {
                display: flex;
                justify-content: center;
                align-items: center;
                color: rgba(255, 255, 255, 0.40);
                background: rgba(255, 255, 255, 0.05);

                &.active{
                    color: rgba(255, 255, 255, 1);
                }
            }

            &.u-confirm {
                color: rgba(255, 255, 255, 0.40);

                /* 16 Bold */
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
                flex: 1;

                border-radius: var(--12, 12px);
                background: rgba(255, 255, 255, 0.05);

                &.active{
                    color: #000;
                    background: #FEDAA3;
                }
            }
        }
    }


}
</style>
