<template>
    <div class="m-robot__wiki-tip">
        <div class="m-qq">
            <span>添加魔盒QQ机器人</span>
            <span class="u-qq" @click="copy('3889010020')">
                <img class="u-icon" src="@/assets/img/jx3box_qqbot_qq.svg" alt="" />
                <span>3889010020</span>
            </span>
        </div>
        <div class="m-reply">
            <span>回复</span>
            <span class="u-reply" @click="copy(`${typeName} ${reply}`)">{{ typeName }} {{ reply }}</span>
            <span>获取一图流攻略</span>
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
                    title: "复制成功",
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
    gap: 48px;
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
    @media screen and (max-width: @phone) {
        gap: 10px;
    }
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
}
</style>
