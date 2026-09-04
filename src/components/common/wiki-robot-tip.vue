<template>
    <div class="m-robot__wiki-tip">
        <div class="m-qq">
            <span>{{ $t("ui.common.robot.addBot") }}</span>
            <span class="u-qq" @click="copy('3889010020')">
                <img class="u-icon" src="@/assets/img/qqbot/jx3box_qqbot_qq.svg" alt="" />
                <span>3889010020</span>
            </span>
        </div>
        <div class="m-reply">
            <span>{{ $t("ui.common.robot.reply") }}</span>
            <span class="u-reply" @click="copy(`${typeName} ${reply}`)">{{ typeName }} {{ reply }}</span>
            <span>{{ $t("ui.common.robot.getGuide") }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "WikiRobotTip",
    props: ["reply", "typeName"],
    methods: {
        copy(txt) {
            navigator.clipboard.writeText(txt).then(() => {
                this.$notify({
                    title: this.$t("ui.common.status.copySuccess"),
                    message: txt,
                    type: "success",
                });
            });
        },
    },
};
</script>

<style lang="less">
.m-robot__wiki-tip {
    .flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    min-height: 40px;
    opacity: 1;
    padding: 8px 12px;
    box-sizing: border-box;
    margin: 10px 0;
    border-radius: 4px;
    background: linear-gradient(to top, rgba(77, 77, 77, 1) 0%, rgba(37, 37, 37, 1) 50%, rgba(0, 0, 0, 1) 100%);

    border: 1px solid rgba(110, 110, 110, 1);
    color: #fff;

    font-size: 12px;
    .u-qq {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 93px;
        height: 24px;
        opacity: 1;
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        padding: 2px 4px 2px 4px;
        color: #000;
        .bold;
        cursor: pointer;
        box-sizing: border-box;
    }
    .m-qq,
    .m-reply {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }
    .u-reply {
        background: #bf8143;
        opacity: 1;
        border-radius: 4px;
        height: 24px;
        line-height: 20px;
        padding: 2px 4px 2px 4px;
        .bold;
        box-sizing: border-box;
        cursor: pointer;
    }

    @media screen and (max-width: @phone) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 10px 12px;
        line-height: 1.5;

        .m-qq,
        .m-reply {
            width: 100%;
            min-width: 0;
            justify-content: flex-start;
        }

        .m-qq {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            gap: 8px;

            .u-qq {
                width: auto;
                min-width: 93px;
            }
        }

        .m-reply {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px 8px;

            > span:first-child,
            > span:last-child {
                min-width: 0;
                white-space: normal;
            }
        }

        .u-reply {
            max-width: 100%;
            min-width: 0;
            height: auto;
            min-height: 24px;
            flex: 0 1 auto;
            white-space: normal;
            word-break: normal;
            overflow-wrap: anywhere;
        }
    }
}
</style>
