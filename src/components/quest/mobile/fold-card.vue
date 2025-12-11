<template>
    <div class="c-var w-fold-card" :class="{ 'is-fold': isFold }" :style="componentStyle">
        <div class="w-fold-card-title">
            <slot name="title">
                {{ title }}
            </slot>
        </div>
        <div class="w-fold-card-content" ref="contentContainer">
            <slot></slot>
        </div>
        <div class="w-fold-card-footer" v-if="!fixed && showFold">
            <el-button @click="toggleFold" type="text">
                {{ isFold ? "展示全部" : "收起全部" }}
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "FoldCard",
    props: {
        title: {
            type: String,
            default: "",
        },
        fixed: {
            type: Boolean,
            default: false,
        },
        maxHeight: {
            type: Number,
            default: 200,
        },
    },
    data() {
        return {
            isFold: true,

            contentHeight: 0,
            observer: null,
        };
    },
    computed: {
        showFold() {
            return this.contentHeight > this.maxHeight - 100;
        },
        componentStyle() {
            const style = {
                maxHeight: `${this.maxHeight}px`,
            };

            if (this.fixed || !this.isFold) {
                delete style.maxHeight;
            }
            return style;
        },
    },
    methods: {
        toggleFold() {
            this.isFold = !this.isFold;
        },
    },
    mounted() {
        const targetEl = this.$refs.contentContainer;
        this.observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === targetEl) {
                    this.contentHeight = entry.contentRect.height;
                }
            }
        });
        this.observer.observe(targetEl);
    },
    beforeDestroy() {
        this.observer.disconnect();
        this.observer = null;
    },
};
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.w-fold-card {
    padding: 16px;
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    .r(12px);
    background: var(--primary-brand-4, #282828);
}

.w-fold-card.is-fold .w-fold-card-footer::before {
    content: "";
    .pa;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 73.94%);
    height: 76px;
    width: 100%;
    left: 0;
    top: -76px;
}
@media (prefers-color-scheme: dark) {
    .w-fold-card.is-fold .w-fold-card-footer::before {
        background: linear-gradient(180deg, rgba(40, 40, 40, 0) 0%, #282828 73.94%);
    }
}

.w-fold-card-title {
    flex-shrink: 0;
    color: var(--black-80, rgba(28, 28, 28, 0.8));

    /* 16 Bold */
    font-size: 16px;
    font-weight: 700;
    line-height: 24px; /* 150% */
}

.w-fold-card-footer {
    .pr;
    flex-shrink: 0;
    display: flex;
    justify-content: center;

    .el-button {
        color: var(--black-40, rgba(28, 28, 28, 0.4));

        /* 12 Regular */
        font-family: "Microsoft YaHei UI";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px; /* 150% */

        padding: 0;
    }
}

.w-fold-card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
}
</style>
