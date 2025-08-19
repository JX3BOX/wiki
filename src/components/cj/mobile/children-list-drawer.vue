<template>
    <div>
        <el-drawer
            :visible.sync="show"
            direction="btt"
            :show-close="false"
            :with-header="false"
            append-to-body
            custom-class="children-list-drawer"
            size="400"
            @close="onClose"
            style="width: 100%"
        >
            <template #default>
                <div v-if="current" class="c-var m-children-list">
                    <div class="u-title">查看成就</div>
                    <Carousel
                      class="m-children-wrapper"
                      :items="current?.SeriesAchievementList || [current]"
                      :itemWidth="240"
                      :itemGap="12"
                      :showCount="1.2"
                      :initial="index"
                      @change="changeCurrentIndex"
                    >
                      <template #default="{ item }">
                        <div class="u-child-wrap">
                          <child-item :item="item" :active="item.ID===tmpVal.ID" />
                        </div>
                      </template>
                    </Carousel>
                    <div class="m-op">
                        <button class="u-reset" @click="resetSearch">设为已完成</button>
                        <button class="u-confirm"  @click="changeRole">切换</button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
import { cloneDeep, pick } from "lodash";
import ChildItem from "@/components/cj/mobile/child-item.vue";
import Carousel from "@/components/cj/mobile/carousel.vue";

export default {
    name: "ChildrenListDrawer",
    components: { ChildItem, Carousel },
    emits: ["update:visible", "change", "complete"],
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        currentRole: {
            type: Object,
            default: () => ({}),
        },
        current: {
            default: () => ({}),
        },
    },
    data() {
        return {
            tmpVal: null,
            index: 0
        };
    },
    watch: {
        visible:{
            handler(val) {
                // 轮播已自带拖动，无需额外事件
            },
            immediate: true,
        },
        current:{
            handler(newVal) {
                this.tmpVal = cloneDeep(newVal);
                this.index = newVal?.SeriesAchievementList?.findIndex(item => item.ID === newVal.ID) || 0;
            },
            immediate: true,
        }
    },
    computed: {
        show: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit("update:visible", val);
            },
        },
        changeActive(){
            return this.current.SeriesAchievementList[this.index]?.ID !== this.current.ID;
        }
    },
    mounted() {
    },
    methods: {
        onClose() {
            this.show = false;
        },
        resetSearch() {
            this.tmpVal = pick(this.tmpVal);
        },
        changeValue() {
            this.tmpVal = this.current.SeriesAchievementList[this.index];
            this.$emit("change",this.tmpVal );
        },
        changeRole(){
            // 切换角色
        },
        changeCurrentIndex(val){
            this.index = val;
            this.changeValue();
        }
    },
};
</script>

<style lang="less">
.children-list-drawer {
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
}

.m-children-list {
    display: flex;
    flex-direction: column;
    background-color: #24292e;
    min-height: 300px;
    position: relative;

    .u-title{
        display: flex;
        padding: 20px 0 24px 0;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        color: rgba(255, 255, 255, 0.60);

        /* 16 Bold */
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }

    .m-children-wrapper {
        .el-carousel__container {
            display: flex;
            padding: 16px;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--8, 8px);
            height: auto;
        }
        .el-carousel__item{
            box-sizing: border-box;
            width: calc(100% - 40px);
        }

        .u-child-wrap{

        }

        .el-carousel__indicators--outside {
            .el-carousel__button {
                width: 9px;
                height: 9px;
                border-radius: 50%;
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
                color: rgba(255, 255, 255, 0.4);
                background: rgba(255, 255, 255, 0.05);
                flex: 1;

                &.active {
                    color: rgba(255, 255, 255, 1);
                }
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
                background: rgba(255, 255, 255, 0.05);

                &.active {
                    color: #000;
                    background: #fedaa3;
                }
            }
        }
    }
}
</style>
