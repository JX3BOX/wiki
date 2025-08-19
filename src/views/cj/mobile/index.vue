<template>
    <div class="c-var p-achievement">
        <div v-if="currentRole" class="m-title">{{ currentRole?.name }}的{{ categoryName }}成就</div>
        <div class="m-cj-list" v-loading="loading">
            <wiki-item v-for="item in currAchievements" @detail="openCurrent" :key="item.id" :item="item" />
        </div>

        <suspend-common
            v-if="!isFromTarget"
            class="u-suspend-common"
            :btn-options="btnOptions"
            :drawer-options="drawerOptions"
            style="width: 100%"
            @search="onSearch"
            ref="suspendCommon"
        >
            <template #default>
                <div class="m-more-action">
                    <div class="u-action" @click="() => (userSelectShow = true)">
                        <img src="@/assets/img/cj/mobile/user.svg" svg-inline @click="onOpenMenu" />
                    </div>
                    <div class="u-action" @click="() => (menuShow = true)">
                        <img src="@/assets/img/cj/mobile/menu.svg" svg-inline />
                    </div>
                    <div class="u-action">
                        <img src="@/assets/img/cj/mobile/search.svg" svg-inline />
                    </div>
                    <div class="u-action" @click="() => (mapDrawerShow = true)">
                        <img src="@/assets/img/cj/mobile/map.svg" svg-inline />
                    </div>
                </div>
            </template>
        </suspend-common>

        <user-select-drawer :visible.sync="userSelectShow" :current-role="currentRole" @change="setRole" />
        <map-filter-drawer
            :visible.sync="mapDrawerShow"
            :regions="regions"
            :search="mapSearch"
            @change="setMapSearch"
            :auto-select="1"
        />
        <category-filter-drawer
            :visible.sync="menuShow"
            :search="categorySearch"
            :menus="menus_cache"
            @change="setMenuSearch"
        />
        <wiki-view-drawer v-if="wikiShow" :visible.sync="wikiShow" :current.sync="current" />
    </div>
</template>

<script lang="js">
import SuspendCommon from  '@jx3box/jx3box-common-ui/src/SuspendCommon.vue';
import {
    cancelVirtualRoleAchievements,
    getMapList,
    getMenuAchievements, getMenus, getRoleGameAchievements, getVirtualRoleAchievements, searchAchievements,
    setVirtualRoleAchievements,
} from "@/service/achievement";
import { get } from "lodash";
import UserSelectDrawer from "@/components/cj/mobile/user-select-drawer.vue";
import MapFilterDrawer from "@/components/cj/mobile/map-filter-drawer.vue";
import CategoryFilterDrawer from "@/components/cj/mobile/category-filter-drawer.vue";
import { isMiniProgram, showSchoolIcon } from "@jx3box/jx3box-common/js/utils";
import WikiViewDrawer from "@/components/cj/mobile/wiki-view-drawer.vue";
import WikiItem from "@/components/cj/mobile/wiki-item.vue";
import wx from "weixin-js-sdk";

export default {
    name: "CjMobileIndex",
    components: {
        WikiViewDrawer,
        CategoryFilterDrawer, MapFilterDrawer, UserSelectDrawer,
        WikiItem,SuspendCommon
    },
    data() {
        return {
            menuShow: false,
            loading: false,

            userSelectShow: false,
            mapDrawerShow: false,
            wikiShow: false,

            current: null,

            achievements:[],
            currAchievements: [],
            regions:[],
            menus_cache:{},

            searchVal: {},
            mapSearch: {},
            currentRole: this.$store.state.role,
            categorySearch:{},
        };
    },
    computed: {
        isFromTarget(){
            return false;
        },
        drawerOptions(){
            return {
                hideType: ['collect', 'rss', 'laterOn', 'user', 'report','pin'], //需要隐藏的type,如['search','pin']

                direction: 'btt', //弹出框方向，btt、ttb、rtl、ltr
            }
        },
        btnOptions(){
            return {
                showHome: true, //是否显示home区域，和Icon区域二选一,home区域优先级高于icon区域
                showIcon: false, //是否显示icon区域,此处为false后，则下列配置无效

                showMore: true, //是否显示更多
            }
        },
        categoryName(){
            const query = this.buildQuery()
            if (query.scene){
                return this.mapSearch?.map?.name;
            }

            return this.categorySearch?.general?.value === 2 ? '五甲' : '常规';
        }
    },
    watch:{
        achievements:{
            handler(val) {
                this.currAchievements = val;
            },
            immediate: true,
            deep: true
        },
        currentRole: {
            deep: true,
            handler(val) {
                if (!val) return;
                localStorage.setItem("wiki_last_sync", val.jx3id || 0);
                this.$store.commit("SET_STATE", { key: "role", value: val });
                const { jx3id } = val;
                if (jx3id) {
                    this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: [] });
                    this.loadRoleAchievements(jx3id);
                } else {
                    if (jx3id === 0) {
                        // 虚拟角色
                        this.loadVirtualAchievements();
                    }
                    this.$store.commit("SET_STATE", { key: "achievements", value: [], isSession: true });
                }
            },
        },
        mapSearch:{
            immediate: true,
            deep: true,
            handler(val){
                this.loadData();
            },
        },
        categorySearch:{
            immediate: true,
            deep: true,
            handler(val){
                this.loadData();
            },
        },
    },
    methods: {
        onSearch(){
            if(isMiniProgram()){
                wx.miniProgram.navigateTo({ url: `/pages/search/search-detail/search-detail?app=wiki&filter_category=成就` });
            }
        },
        onOpenMenu(){

        },
        openCurrent(item){
            this.current = item;
            this.wikiShow = true;
        },
        // 获取角色成就状态
        loadRoleAchievements(jx3id) {
            getRoleGameAchievements(jx3id).then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const jx3id = res.data?.data?.jx3id;
                this.isSync = !!jx3id; // 是否在游戏中同步
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievements", value: list, isSession: true });
            });
        },
        showSchoolIcon,
        // 获取虚拟角色成就列表
        loadVirtualAchievements() {
            if (!this.currentRole || this.currentRole.jx3id) return;
            getVirtualRoleAchievements().then((res) => {
                const achievements = res.data?.data?.achievements || "";
                const list = achievements.split(",");
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
            });
        },
        loadMenus() {
            Promise.all([getMenus({ general:1 }),getMenus({general:2})]).then(res=>{
                const tmp={};
                for (let data of res){
                    const general = data.config.params.general;
                    data = data.data;
                    if (data.code === 200) {
                        let menus = [];
                        for (let i in data.data.menus) menus.push(data.data.menus[i]);
                        tmp[general] = menus;
                    }
                }

                console.log(tmp);
                this.menus_cache = tmp;
            })
        },

        setMapSearch(val){
            this.mapDrawerShow = false;
            this.mapSearch = val;
        },
        setMenuSearch(val) {
            this.mapSearch = {};
            this.categorySearch = val;
            this.menuShow = false;

        },
        setRole(val){
            this.currentRole = val;
            this.userSelectShow = false;
        },
        loadMapList() {
            const client = this.$store.state.client;
            const params = {
                client,
                _no_page: 1,
            };
            getMapList(params).then((res) => {
                const data = res.data.data || [];
                this.regions = Object.values(
                    data.reduce((acc, cur) => {
                        if (!cur.RegionName) return acc;
                        if (!acc[cur.RegionName]) {
                            acc[cur.RegionName] = {
                                value: Number(cur.Region),
                                label: cur.RegionName,
                                children: [],
                            };
                        }
                        acc[cur.RegionName].children.push({
                            value: Number(cur.ID),
                            label: cur.MapName,
                        });

                        return acc;
                    }, {})
                );
                console.log(this.regions);

            });
        },
        buildQuery(){
           const res = {}
            // type1
            // type2
            if (this.categorySearch.type1?.value) {
                res.sub = this.categorySearch.type1.value;
            }
            if (this.categorySearch?.type2?.value){
                res.detail = this.categorySearch.type2.value;
            }
            if (this.mapSearch?.map_1?.value){
                res.scene = this.mapSearch.map_1.value;
            }
            if (this.mapSearch?.map?.value){
                res.scene = this.mapSearch.map.value;
            }
            return res;
        },
        loadData(){
            const query = this.buildQuery();
            this.getAchievementList(query.sub, query.detail, query.scene);
        },
        getAchievementList(sub, detail,scene) {
            if (!sub && !scene) return [];

            const params = {};

            if (scene) params.scene = scene;

            this.loading = true;
            this.achievements = [];

            if (scene){
                searchAchievements({scene:scene,limit:100}).then((data) => {
                    data= data.data;
                    const achievements =
                        data.data.achievements &&
                        data.data.achievements.length &&
                        data.data.achievements.sort((a, b) => {
                            let a_level = get(a.post, "level", 1);
                            let b_level = get(b.post, "level", 1);
                            return a_level - b_level;
                        }) || [];
                    this.achievements = achievements?.map((item) => {
                        return {
                            ...item,
                            checked: false,
                        };
                    }) || [];
                }).finally(()=>{
                    this.loading = false;
                })
            }else{
                getMenuAchievements(sub, detail, params).then(
                    (data) => {
                        data = data.data;
                        const achievements =
                            data.data.achievements &&
                            data.data.achievements.length &&
                            data.data.achievements.sort((a, b) => {
                                let a_level = get(a.post, "level", 1);
                                let b_level = get(b.post, "level", 1);
                                return a_level - b_level;
                            });
                        this.achievements = achievements?.map((item) => {
                            return {
                                ...item,
                                checked: false,
                            };
                        }) || [];
                    },
                    () => {
                        this.achievements = [];
                    }
                ).finally(()=>{
                    this.loading = false;
                });
            }
        },
        finishVirtual() {
            const ids = this.selectedAchievements.map((item) => item.ID + "");
            const data = {
                achievements: ids.join(),
            };
            setVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将选中成就标记为已完成",
                    type: "success",
                });
                const list = Array.from(new Set(this.achievementsVirtual.concat(ids)));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },
        cancelVirtual() {
            const ids = this.selectedAchievements.map((item) => item.ID + "");
            const data = {
                achievements: ids.join(),
            };
            cancelVirtualRoleAchievements(data).then((res) => {
                this.$notify({
                    title: "操作成功",
                    message: "已将选中成就标记为待完成",
                    type: "success",
                });
                const list = this.achievementsVirtual.filter((item) => !ids.includes(item));
                this.$store.commit("SET_STATE", { key: "achievementsVirtual", value: list });
                this.isAll = false;
                this.achievements = this.achievements.map((item) => {
                    return {
                        ...item,
                        checked: false,
                    };
                });
            });
        },

    },
    mounted() {
        this.loadMapList();
        this.loadMenus()
    },
}
</script>

<style lang="less">
@import "../../../assets/css/miniprogram/var.less";

.u-suspend-common {
    padding-bottom: 2rem;
    margin: 0;
    .m-base {
        width: 100%;
        .m-more-action {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;

            .u-action {
                display: flex;
                height: 24px;
                justify-content: center;
                align-items: center;
                flex: 1 0 0;

                &.disabled {
                    img {
                        opacity: 0.5;
                    }
                }
            }
        }
    }
    .m-more {
        .u-icon {
            display: none;
        }
    }
}
.el-loading-mask {
    background: none;
}
.p-achievement {
    background: #f1f1f1;
    @media (prefers-color-scheme: dark) {
        background: #000;
    }

    .m-title {
        padding-top: 20px;
        color: var(--black-20, rgba(28, 28, 28, 0.2));
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        text-align: center;
    }

    .m-cj-list {
        padding: 20px 20px 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        min-height: 100vh;
    }
}
</style>
