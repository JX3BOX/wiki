<template>
    <div class="m-layout" v-loading="loading">
        <div class="m-left">
            <img class="u-title__img" src="../../assets/img/wiki/overview/left_title.png" alt="" />

            <TreeProgress />

            <div class="m-seniority">
                <img class="u-img" src="../../assets/img/wiki/overview/seniority_bg.png" alt="" />
                <div class="u-text">
                    <span>已收录资历点：</span>
                    <span>182700</span>
                </div>
            </div>
        </div>
        <div class="m-right">
            <div class="m-top">
                <div class="m-info">
                    <div class="m-user">
                        <div class="u-user__name">秋江曲·梦江南</div>
                        <img class="u-sect" src="" alt="" />
                        <div class="m-change">
                            <span class="u-text">切换角色</span>
                            <img class="u-img" src="../../assets/img/wiki/overview/change_icon.svg" alt="" />
                        </div>
                    </div>
                    <div class="m-total">
                        <div class="m-text__info">
                            <span class="u-text">总资历：</span>
                            <img class="u-icon" :src="iconPath('point.svg')" alt="" />
                            <span class="u-num">19342</span>
                            <div class="u-percent">64%</div>
                        </div>
                        <div class="m-progress">
                            <div class="u-progress"></div>
                        </div>
                    </div>
                </div>
                <div class="m-large">
                    <img src="" alt="" />
                    <img src="" alt="" />
                </div>
            </div>
            <div class="m-list">
                <SeniorityItem />
                <SeniorityItem />
                <SeniorityItem />
                <SeniorityItem />
                <SeniorityItem />
                <SeniorityItem />
                <SeniorityItem />
                <SeniorityItem />
                <SeniorityItem />
            </div>
        </div>
    </div>
</template>

<script>
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";

import TreeProgress from "@/components/wiki/TreeProgress.vue";
import SeniorityItem from "@/components/wiki/SeniorityItem.vue";

import { getUserRoles } from "@/service/team";
export default {
    name: "",
    components: {
        TreeProgress,
        SeniorityItem,
    },
    data: function () {
        return {
            loading: false,
        };
    },
    computed: {},
    watch: {},
    created: function () {
        getUserRoles().then(res =>{
            
        })
    },
    methods: {
        iconPath(url) {
            return `${__cdn}img/dashboard/${url}`;
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/wiki/overview.less";
</style>
