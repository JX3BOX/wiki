<template>
    <div>
        <el-drawer
            :visible="visible"
            class="c-var"
            direction="btt"
            :show-close="false"
            :with-header="false"
            custom-class="item-search-drawer"
            append-to-body
            size="400"
            @close="onClose"
            style="width: 100%"
            v-bind="$attrs"
        >
            <template #default>
                <div class="c-var m-item-search-drawer">
                    <template v-if="!showMode">
                        <div class="m-user-select__title">关键词</div>
                        <el-input class="u-input" v-model="searchKey" placeholder="请输入关键词"></el-input>
                        <div class="m-user-select__title">分类</div>
                        <div class="u-menu" @click="openMenu()">{{ currentMenu?.label || "全部" }}</div>
                        <template v-if="aucGenre !== null">
                            <div class="m-user-select__title">子分类</div>
                            <div class="u-menu" @click="openMenu('subtype')">{{ currentSubMenu?.label || "全部" }}</div>
                        </template>
                    </template>
                    <template v-if="showMode == 'type'">
                        <div class="m-user-select__title">分类</div>
                        <div class="m-options-list">
                            <div
                                class="m-options-item"
                                v-for="(item, index) in menus"
                                :key="index"
                                @click="changeAucGenre(item.AucGenre)"
                                :class="{ 'is-active': item.AucGenre == aucGenre }"
                            >
                                {{ item.label }}
                                <div class="w-mp-checkbox__icon">
                                    <div class="w-mp-checkbox__checkmark"></div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-if="showMode == 'subtype'">
                        <div class="m-user-select__title">子分类</div>
                        <div class="m-options-list">
                            <div
                                class="m-options-item"
                                v-for="(item, index) in subAucGenreOptions"
                                :key="index"
                                @click="changeSubAucGenre(item.AucSubType)"
                                :class="{ 'is-active': item.AucSubType == subAucGenre }"
                            >
                                {{ item.label }}
                            </div>
                        </div>
                    </template>
                    <div class="m-op">
                        <button class="u-reset" @click="resetVal">重置</button>
                        <button class="u-confirm" @click="changeValue">确定</button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: "SearchDrawer",
    components: {},
    props: ["menus"],
    data() {
        return {
            visible: false,

            showMode: "",

            searchKey: "",
            aucGenre: null,
            subAucGenre: null,

            callback: {},
        };
    },
    computed: {
        client() {
            return this.$store.state.client;
        },
        subAucGenreOptions() {
            return this.menus.find((item) => item.AucGenre == this.aucGenre)?.children || [];
        },
        currentMenu() {
            return this.menus.find((item) => item.AucGenre == this.aucGenre);
        },
        currentSubMenu() {
            return this.currentMenu?.children.find((item) => item.AucSubType == this.subAucGenre);
        },
        showSearchDesc() {
            let str = "";
            if (this.currentMenu) str += this.currentMenu.label;
            if (this.currentSubMenu) str += `-${this.currentSubMenu.label}`;
            if (this.keyword) {
                if (str) str += ", ";
                str += `${this.keyword}`;
            }
            return str;
        },
    },
    methods: {
        open(current) {
            this.visible = true;
            this.searchKey = current?.searchKey || "";
            this.aucGenre = current?.aucGenre || null;
            this.subAucGenre = current?.subAucGenre || null;
            return new Promise((resolve, reject) => {
                this.callback = { resolve, reject };
            });
        },
        onClose() {
            this.visible = false;
            this.callback.reject();
        },
        resetVal() {
            this.searchKey = "";
            this.showMode = "";
            this.aucGenre = null;
            this.subAucGenre = null;
        },
        changeValue() {
            this.showMode = "";
            this.visible = false;
            this.callback.resolve({
                searchKey: this.searchKey,
                aucGenre: this.aucGenre,
                subAucGenre: this.subAucGenre,
            });
        },
        openMenu(type = "type") {
            this.showMode = type;
        },
        changeAucGenre(v) {
            this.aucGenre = v;
            this.showMode = "";
            this.subAucGenre = this.menus.find((item) => item.AucGenre == v)?.children[0]?.AucSubType || null;
        },
        changeSubAucGenre(v) {
            this.subAucGenre = v;
            this.showMode = "";
        },
    },
};
</script>

<style lang="less">
.w-mp-checkbox__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    .size(20px);
    box-sizing: border-box;
    .r(100%);
    padding: 2.5px;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.w-mp-checkbox__checkmark {
    .size(0px);
    .r(100%);
    background-color: #fedaa3;
    transition: all 0.2s ease-in-out;
}

.item-search-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
    min-height: 500px;
}

.m-item-search-drawer {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    padding: 20px;
    min-height: 500px;
    position: relative;
    gap: 12px;
    .m-user-select__title {
        color: rgba(255, 255, 255, 0.6);

        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }

    .m-options-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 400px;
        overflow: auto;
    }

    .u-input .el-input__inner,
    .u-menu,
    .m-options-item {
        display: flex;
        padding: var(--16, 16px) var(--20, 20px);
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        align-self: stretch;

        border-radius: var(--16, 16px);
        background: rgba(255, 255, 255, 0.1);

        color: rgba(255, 255, 255, 0.6);

        font-size: 14px;
        line-height: 20px; /* 142.857% */
        height: auto;
        box-shadow: none;
        border: none;

        &.is-active {
            color: #fedaa3;

            .w-mp-checkbox__icon {
                .w-mp-checkbox__checkmark {
                    .size(8px);
                }
            }
        }
    }

    .m-op {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        padding: 20px 12px 30px;
        gap: 20px;
        background-color: #24292e;

        button {
            color: rgba(28, 28, 28, 0.4);

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
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 1);
            }

            &.u-confirm {
                color: rgba(255, 255, 255, 0.4);

                /* 16 Bold */
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px; /* 150% */
                flex: 1;

                border-radius: var(--12, 12px);
                color: #000;
                background: #fedaa3;
            }
        }
    }
}
</style>
