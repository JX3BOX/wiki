

<template>
    <div v-if="item" class="m-cj-item" @click="$emit('detail', item)">
        <div class="m-cj-item__header">
            <div class="m-sub-cj-list">
                <div v-for="sub in item.SeriesAchievementList" :key="sub.ID" class="u-sub-item" :class="[sub.ID === item.ID?'is-active':'']">
                </div>
                <div v-if="!item.SeriesAchievementList" class="u-sub-item is-active">
                </div>
            </div>
            <div class="u-cj-status" :class="[hadCompleted(item.ID)?'is-complete':'']">
                <div class="u-top">
                    <div class="u-num">
                        {{item.Point}}
                    </div>
                    <div class="u-icon">
                        <img src="@/assets/img/cj/mobile/point.svg" svg-inline >
                    </div>
                </div>
                <div class="u-complete" v-if="hadCompleted(item.ID)">完成</div>
            </div>
        </div>
        <div class="u-title">{{item.Name}}</div>
        <div class="m-cj-item__content" :class="[contentAlignClass]">
            <div class="u-img">
                <img
                    :src="icon_url(item.IconID)"
                     @error.once="
                            () => {
                                $event.target.src = icon_url();
                            }
                        "
                >
            </div>
            <div ref="desc" class="u-desc">
                {{item.Desc}}
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { iconLink } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "WikiItem",
    props: {
        item: {
            type: Object,
            default: () => {},
        },
    },
    emits: ["detail"],
    data() {
        return {
            isOneLine: true
        };
    },
    computed: {
        contentAlignClass() {
            return this.isOneLine ? 'is-center' : 'is-start';
        },
        currentRole() {
            return this.$store.state.role;
        },
        completeAchievements() {
            return this.$store.state.achievements || [];
        },
        achievementsVirtual() {
            return this.$store.state.achievementsVirtual || [];
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.checkLineCount();
        });
    },
    updated() {
        this.$nextTick(() => {
            this.checkLineCount();
        });
    },
    methods: {
        icon_url: function (id) {
            return iconLink(id, this.client);
        },
        hadCompleted(id) {
            const list = this.isVirtual ? this.achievementsVirtual : this.completeAchievements;
            return list.includes(id + "");
        },
        checkLineCount() {
            const descEl = this.$refs.desc;
            if (!descEl) return;

            // 临时移除行数限制来检测实际高度
            const actualHeight = descEl.scrollHeight;
            // 20px 是单行高度
            this.isOneLine = actualHeight <= 20;
        }
    },
}
</script>

<style lang="less">
.m-cj-item{
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    box-sizing: border-box;

    border-radius: 12px;
    background: var(--primary-brand-4, #282828);
    overflow: hidden;

    .m-cj-item__header{
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        gap: 8px;

        .m-sub-cj-list{
            display: flex;
            align-items: center;
            gap: 4px;

            .u-sub-item{
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color:  var(--black-10, rgba(28, 28, 28, 0.10));

                &.is-active{
                    background-color: var(--black-20, rgba(28, 28, 28, 0.20));
                }
            }
        }

        .u-cj-status{
            position: absolute;
            top: 0px;
            right: 0px;
            z-index: 2;

            .u-top{
                display: flex;
                gap: 4px;
                align-items: center;
            }
            .u-num{
                color: var(--black-20, rgba(255, 255, 255, 0.20));

                /* 12 Regular */
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }

            .u-complete{
                color: var(--secondary-orange, #FF9500);
                /* 12 Bold */
                font-size: 12px;
                font-style: normal;
                font-weight: 700;
                line-height: 18px; /* 150% */
                display: block;
                text-align: right;
            }

            .u-icon{
                width: 16px;
                height: 16px;
                color: var(--black-20, rgba(28, 28, 28, 0.20));
            }

            &.is-complete{
                .u-num{
                    color: var(--secondary-orange, #FF9500);
                }

                .u-icon{
                    color: var(--secondary-orange, #FF9500);
                }

                &:before{
                    content: "";
                    position: absolute;
                    right: -104px;
                    top: -45px;
                    background: #FEDAA3;
                    width: 226px;
                    height: 90px;
                    transform: rotate(30deg);
                    z-index: -1;
                }

            }
        }



    }
    .u-title{
        color: var(--black-80, rgba(255, 255, 255, 0.80));
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }

    .m-cj-item__content{
        display: flex;
        gap: 8px;

        .u-img{
            width: 32px;
            height: 32px;
            border-radius: 4px;
            overflow:  hidden;
        }

        .u-desc{
            color: var(--black-80, rgba(255, 255, 255, 0.80));
            /* 14 Regular */
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px; /* 142.857% */

            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        &.is-center{
            align-items:  center;
        }
        &.is-start{
            align-items:  flex-start;
        }
    }

}
</style>
