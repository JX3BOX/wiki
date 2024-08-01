<template>
    <div class="p-plan-edit">
        <h3 class="u-plan-header">编辑清单</h3>
        <el-form class="u-form" label-position="left" label-width="80px">
            <!-- 清单名称 -->
            <el-form-item label="标题">
                <el-input
                    v-model="data.title"
                    placeholder="请输入物品清单的标题"
                    maxlength="20"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="可见性">
                <el-radio v-model="data.public" :label="1">公开</el-radio>
                <el-radio v-model="data.public" :label="0">私有</el-radio>
            </el-form-item>
            <!-- 清单描述 -->
            <el-form-item label="描述">
                <el-input
                    type="textarea"
                    :rows="3"
                    v-model="data.description"
                    placeholder="简单说明一下你的物品清单"
                    :maxlength="2000"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <!-- 清单类型 -->
            <el-form-item label="清单">
                <!-- <el-radio-group v-model="data.type" size="medium" @change="resetPages"> -->
                <!-- <el-radio-button label="1">道具清单</el-radio-button> -->
                <!-- <el-radio-button label="2">装备清单</el-radio-button> -->
                <!-- </el-radio-group> -->
                <el-button
                    class="u-add-plan"
                    size="medium"
                    icon="el-icon-plus"
                    @click="addRelation"
                    type="primary"
                    plain
                    >新增分组</el-button
                >
            </el-form-item>
            <!-- 制作清单 -->
            <el-form-item label="">
                <div class="m-plan-list">
                    <div class="u-list-search">
                        <el-input
                            class="u-title"
                            placeholder="请输入物品名称"
                            prefix-icon="el-icon-search"
                            v-model.lazy.trim="keyword"
                            clearable
                        ></el-input>
                        <template v-if="searchList.length">
                            <draggable
                                v-model="searchList"
                                draggable=".u-change"
                                :move="moveHandle"
                                :group="{ name: 'draggable-item', pull: 'clone', put: false }"
                            >
                                <jx3-item-simple
                                    class="u-change"
                                    v-for="(item, index) in searchList"
                                    :key="index"
                                    :item="item"
                                />
                            </draggable>
                        </template>

                        <el-empty description="输入物品名称进行搜索" :image-size="200" v-else></el-empty>

                        <el-pagination
                            small
                            class="m-archive-pages"
                            background
                            layout="prev, pager, next"
                            :hide-on-single-page="true"
                            :page-size="per"
                            :total="total"
                            :current-page.sync="page"
                            size="mini"
                            :page-count="5"
                        ></el-pagination>
                    </div>
                    <el-row v-if="data.type == '1'" class="u-list-box" :gutter="20">
                        <el-col v-for="(relation, index) in data.relation" :key="index" :span="6">
                            <div class="u-list">
                                <i
                                    class="u-list-close el-icon-circle-close"
                                    @click="data.relation.splice(index, 1)"
                                ></i>
                                <el-input
                                    class="u-title"
                                    type="text"
                                    placeholder="子清单标题（选填）"
                                    v-model="relation.title"
                                    maxlength="20"
                                    show-word-limit
                                ></el-input>
                                <draggable
                                    class="u-item-drag"
                                    :list="relation.data"
                                    group="draggable-item"
                                    ghost-class="ghost"
                                >
                                    <template v-if="relation.data && relation.data.length">
                                        <div
                                            v-for="(item, key) in relation.data"
                                            :key="key"
                                            class="u-selected u-selected-item u-selected-count"
                                        >
                                            <ItemIcon :item_id="item.id" :has_title="true" />
                                            <div class="u-count">
                                                <span>数量：</span>
                                                <el-input-number
                                                    size="mini"
                                                    v-model.number="item.count"
                                                    :min="1"
                                                    label="数字"
                                                ></el-input-number>
                                            </div>
                                            <i
                                                class="u-close el-icon-circle-close"
                                                @click="relation.data.splice(key, 1)"
                                            ></i>
                                        </div>
                                    </template>
                                    <div class="u-normal" v-else>拖拽所需道具到此处</div>
                                </draggable>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button
                    class="u-publish"
                    icon="el-icon-s-promotion"
                    type="primary"
                    @click="submit"
                    :loading="loading"
                    >保存</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { pick } from "lodash";
import { getItemsByName } from "@/service/item";
import { getItemPlanID, updatePlan } from "@/service/item-plan";
// components
import draggable from "vuedraggable";
import ItemIcon from "@/components/common/item-icon.vue";
import ItemSimple from "@jx3box/jx3box-editor/src/ItemSimple";
export default {
    name: "planEdit",
    data() {
        return {
            data: {
                title: "",
                public: 1,
                description: "",
                type: 1,
                relation: [],
            },
            loading: false,

            keyword: "",
            page: 1,
            per: 10,
            total: 0,
            searchList: [],
        };
    },
    components: {
        draggable,
        ItemIcon,
        "jx3-item-simple": ItemSimple,
    },
    computed: {
        id: function () {
            return this.$route.params.plan_id;
        },
        params() {
            return {
                per: this.per,
                page: this.page,
            };
        },
    },
    watch: {
        keyword: function (val) {
            this.resetPages();
        },
        page: function (val) {
            this.loadItems();
        },
    },
    mounted() {
        this.id && this.loadData();
        // this.loadItems();
    },
    methods: {
        loadItems() {
            getItemsByName(this.keyword, this.params).then((res) => {
                // console.log(res)
                this.searchList = res.data.list.map((item) => {
                    item.count = 1;
                    return item;
                });
                this.total = res.data.total;
            });
        },
        resetPages() {
            if (this.page != 1) {
                this.page = 1;
            } else {
                this.loadItems();
            }
        },
        // 清单
        // ===================================
        // 新增清单
        addRelation() {
            this.data.relation.unshift({
                title: "",
                data: [],
            });
        },
        // 装备清单的移动
        moveHandle(e) {
            if (e.to.classList.contains("u-item-drag")) return;
            let AucGenre = e.to.getAttribute("data-AucGenre");
            let AucSubType = e.to.getAttribute("data-AucSubType");
            let result = e.draggedContext.element.AucGenre == AucGenre;
            if (AucSubType !== null) result = result && e.draggedContext.element.AucSubType == AucSubType;
            return result;
        },
        submit() {
            this.loading = true;
            const _data = pick(this.data, ["title", "type", "public", "relation", "description"]);
            console.log(_data);
            updatePlan(this.id, _data)
                .then(() => {
                    this.$message({
                        message: "提交成功",
                        type: "success",
                    });
                    this.$router.push({ name: "plan_view", params: { plan_id: this.id } });
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        // 获取清单数据
        loadData() {
            getItemPlanID(this.id).then((res) => {
                this.data = this.extractID(res);
            });
        },
        //处理旧数据
        extractID(data) {
            if (data.type == 1) {
                data.relation = data.relation.map((item) => {
                    item.data = item.data.map((el) => {
                        if (typeof el == "string") el = { id: el, count: 1 };
                        if (typeof el == "object") el = { id: el.id, count: el.count };
                        return el;
                    });
                    return item;
                });
            } else {
                data.relation = this.equipItem(data.relation);
            }
            return data;
        },
        // 将装备object转换为string
        equipItem(data) {
            for (const key in data) {
                data[key] = data[key].map((item) => {
                    if (typeof item == "object") item = item.id;
                    return item;
                });
            }
            return data;
        },
        // 装备分组
        toEquipList(_obj) {
            this.equipList.map((list) => {
                list.map((el) => {
                    if (_obj.hasOwnProperty(el.title)) {
                        el.list = _obj[el.title];
                    }
                });
            });
        },
        // 装备提交数据转换
        toEquip() {
            let obj = {};
            this.equipList.forEach((list) => {
                list.forEach((el) => {
                    obj[el.title] = el.list;
                });
            });
            obj = this.equipItem(obj);
            this.data.relation = obj;
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/item-plan.less";
</style>
