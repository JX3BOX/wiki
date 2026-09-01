<template>
    <div class="c-wiki-side-msg">
        <RightSideMsg>
            <em>{{ $t("ui.achievement.groups") }}</em> :
            <strong>
                <a href="https://jq.qq.com/?_wv=1027&k=5S50j08">{{ qq }}</a>
            </strong>
        </RightSideMsg>
    </div>
</template>

<script>
export default {
    name: "CommonSideMsg",
    data() {
        return {
            qq: "614370825",
        };
    },
};
</script>

<style lang="less"></style>
