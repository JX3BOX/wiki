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
                <div class="c-var m-other-filter">
<!--                    <div class="m-other-filter__title">-->
<!--                        其他筛选-->
<!--                    </div>-->
                    <div
                        class="m-other-filter-list"
                        ref="filterList"
                        :class="{ 'not-on-bottom': !isAtBottom }"
                    >
                        <div v-for="item in filterGroup"  class="m-filter-group"  :key="item.key">
                            <div class="u-title">
                                {{item.title}}
                            </div>
                            <div class="m-filter-radio-list" :class="[item?.class || '',item?.onlyOneFill &&  item.list?.length===1? 'only-one-fill' : '']">
                                <div class="u-radio" :class="{'active': radio.default ? tmpVal[item.key]?.value == null : tmpVal[item.key]?.value === radio.value}" @click="()=>setVal(item,radio)" v-for="radio in item.list" :key="radio.value">
                                    {{radio.name}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m-op">
                        <button class="u-reset" :class="{active: !isEmptyVal}"  @click="resetSearch">
                            重置
                        </button>
                        <button class="u-confirm" :class="{active: changeTmp}" @click="changeValue">
                            确定
                        </button>
                    </div>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>

import { cloneDeep } from "lodash";

export default {
    name: "CategoryFilterDrawer",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        search: {
            type: Object,
            default: ()=> {}
        },
        menus:{
            type: Object,
            default: () => {}
        },
        autoSelect: {
            type: Number,
            default: 1
        }
    },
    emits: ['update:visible','change'],
    data(){
        return {
            tmpVal: {},
            initVal: false,
            isAtBottom: false
        }
    },
    watch:{
        search:{
            handler(val){
                this.tmpVal ={
                    ...cloneDeep(val || {})
                };
                console.log(val);
            },
            immediate: true,
            deep:true
        },
         menus:{
            immediate: true,
            deep:true,
            handler(val){
                if (val[1] == null){
                    return;
                }
                if (this.initVal) return;
                const tmp = {
                    general:null,
                    type1: this.lv1List?.[0],
                    type2: this.lv1List?.[0]?.children[0],
                };
                this.$emit('change',tmp);
                this.initVal = true;
            },
         },
        visible:{
            handler(val){
                if (val) {
                    this.$nextTick(() => {
                        const scrollContainer = this.$refs.filterList;
                        if (scrollContainer) {
                            scrollContainer.addEventListener('scroll', this.handleScroll);
                            this.handleScroll({ target: scrollContainer });
                        }
                    });
                } else {
                    const scrollContainer = this.$refs.filterList;
                    if (scrollContainer) {
                        scrollContainer.removeEventListener('scroll', this.handleScroll);
                    }
                }
            },
            immediate: true
        }
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
        fbs(){
            return {
                tmpValue: null
            }
        },
        changeTmp(){
            const hasVals = Object.values(this.tmpVal);
            const hasVals2 = Object.values(this.search);
            const hasVals3 = hasVals.filter(i=>i!=null);
            const hasVals4 = hasVals2.filter(i=>i!=null);
            return hasVals3.length !== hasVals4.length || hasVals3.some((val, index) => val !== hasVals4[index]);
        },
        isEmptyVal(){
            return Object.keys(this.tmpVal).filter(i=>this.tmpVal[i]?.value!=null || this.tmpVal[i]?.value!=="").length === 0;
        },
        lv1List(){
            const l1 = this.tmpVal?.general?.value ?? 1;
            const ll1 = this.menus?.[l1];
            return (ll1 || []).map(i=>{
                return {
                    name: i.name,
                    value: i.id,
                    children: i.children?.map(j=>{
                        return {
                            name: j.name,
                            value: j.detail
                        }
                    }) || []
                }
            });
        },
        lv2List(){
            return (this.tmpVal?.type1?.children || []);
        },
        filterGroup(){
            return  [
                {
                    title: "类型",
                    key: "general",
                    class: 'two-line',
                    list: [
                        { name: "常规", value: null, default: true },
                        { name: "五甲", value: 2 },
                    ]
                },
                {
                    title: "分类I",
                    key: "type1",
                    list: [
                        ...this.lv1List
                    ]
                },
                {
                    title: "分类II",
                    key: "type2",
                    onlyOneFill: this.lv2List?.length === 0,
                    hidden:this.lv2List?.length === 0,
                    class: 'two-line',
                    list: [
                        { name: "当前", value: null, default: true },
                        ...(this.lv2List)
                    ]
                }

            ].filter(i=>!i.hidden);
        }
    },
    methods: {
        onClose() {
            this.show = false;
        },
        resetSearch(){
            this.tmpVal = {
                general: null,
                type1: this.lv1List?.[0] || null, // 重置第一级分类
                type2: this.lv1List?.[0]?.children[0],
            };
        },
        changeValue(){
            this.$emit('change',this.tmpVal)
        },
        setVal(item,val){
            if (val.value == null){
                this.$set(this.tmpVal, item.key, null);
            }else{
                this.$set(this.tmpVal, item.key, val);
            }

            if (item.key === 'general'){
                this.tmpVal.type1 = this.lv1List?.[0]; // 重置第一级分类
                this.tmpVal.type2 = this.lv2List?.[0]; // 重置第二级分类
            }else if(item.key === 'type1'){
                this.tmpVal.type2 = this.lv2List?.[0]; // 重置第二级分类
            }
        },
        setSearch(val){
            this.tmpVal = {
                ...this.tmpVal,
                ...val
            };
        },
        handleScroll(event) {
            const element = event.target;
            const threshold = 5; // 容错值，避免精度问题
            this.isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - threshold;
        }
    },
};
</script>

<style lang="less">

.other-filter-drawer{
    border-radius: 20px 20px 0px 0px;
    overflow: hidden;
    background: transparent;
}

.m-other-filter {
    display: flex;
    flex-direction: column;
    background-color: #24292E;
    padding: 20px;
    min-height: 300px;
    position: relative;


    .m-other-filter__title{
        color: rgba(255, 255, 255, 0.80);
        text-align: center;

        /* 12 Bold */
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: 18px; /* 150% */
    }

    .m-other-filter-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 60px;
        max-height: 345px;
        overflow-y: auto;
        padding-bottom: 20px;


        &.not-on-bottom{
            position: relative;
            &:after{
                width: 100%;
                height: 76px;
                content: '';
                position: fixed;
                box-sizing: border-box;
                bottom: 90px;
                background: linear-gradient(180deg, rgba(36, 41, 46, 0.00) 0%, #24292E 73.94%);
            }
        }

        .m-filter-group {

            .u-title {
                color: rgba(255, 255, 255, 0.40);



                /* 12 Regular */
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px; /* 150% */

                margin-bottom: 12px;
            }

            .m-filter-radio-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;

                .u-radio {
                    display: flex;
                    width: calc(100% / 3 - 10px);
                    padding: var(--4, 4px) var(--16, 16px);
                    justify-content: center;
                    align-items: center;
                    gap: var(--4, 4px);
                    box-sizing: border-box;

                    border-radius: var(--8, 8px);
                    background: rgba(255, 255, 255, 0.05);
                    color: #FFF;


                    /* 14 Regular */
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px; /* 142.857% */

                    &.active {
                        color: #000;
                        background: #FEDAA3;
                    }
                }

                &.two-line{
                    .u-radio {
                        width: calc(100% / 2 - 10px);
                    }
                }

                &.only-one-fill{
                    .u-radio {
                        width: 100%;
                    }
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

    //@media (prefers-color-scheme: dark) {
    //    background-color: #24292E;
    //
    //    .m-op {
    //        background-color: #24292E;
    //    }
    //}
}
</style>
