<template>
    <div class="p-plan-edit">
        <h3 class="u-plan-header">编辑清单</h3>
        <el-form class="u-form" label-position="left" label-width="80px">
            <el-form-item label="标题">
                <el-input
                    v-model="data.title"
                    placeholder="请输入物品清单标题"
                    maxlength="20"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="可见性">
                <el-radio v-model="data.public" :label="1">公开</el-radio>
                <el-radio v-model="data.public" :label="0">私有</el-radio>
            </el-form-item>
            <el-form-item label="描述">
                <el-input
                    v-model="data.description"
                    type="textarea"
                    :rows="3"
                    placeholder="简单说明一下你的物品清单"
                    :maxlength="2000"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item label="清单">
                <el-button class="u-add-plan" @click="addRelation" type="primary" plain>
                    新增分组
                </el-button>
            </el-form-item>
            <el-form-item label="">
                <div class="m-plan-list">
                    <div class="u-list-search">
                        <el-input
                            v-model.lazy.trim="keyword"
                            class="u-title"
                            placeholder="请输入物品名称"
                            clearable
                        ></el-input>

                        <template v-if="searchList.length">
                            <draggable
                                v-model="searchList"
                                item-key="__dragKey"
                                draggable=".u-change"
                                :move="moveHandle"
                                :group="{ name: 'draggable-item', pull: 'clone', put: false }"
                                :clone="cloneSearchItem"
                            >
                                <template #item="{ element }">
                                    <jx3-item-simple class="u-change" :item="element" />
                                </template>
                            </draggable>
                        </template>

                        <el-empty v-else description="输入物品名称进行搜索" :image-size="200"></el-empty>

                        <el-pagination
                            v-model:current-page="page"
                            size="small"
                            class="m-archive-pages"
                            background
                            layout="prev, pager, next"
                            :hide-on-single-page="true"
                            :page-size="per"
                            :total="total"
                            :page-count="5"
                        ></el-pagination>
                    </div>
                    <el-row v-if="data.type == 1" class="u-list-box" :gutter="20">
                        <el-col v-for="(relation, index) in data.relation" :key="index" :span="6">
                            <div class="u-list">
                                <div class="u-button-group">
                                    <i
                                        v-if="index != 0"
                                        class="u-to-left el-icon-d-arrow-left"
                                        @click="data.relation.splice(index, 0, data.relation.splice(index - 1, 1)[0])"
                                    ></i>
                                    <i
                                        v-if="index != data.relation.length - 1"
                                        class="u-to-right el-icon-d-arrow-right"
                                        @click="data.relation.splice(index, 0, data.relation.splice(index + 1, 1)[0])"
                                    ></i>
                                    <i class="u-list-close el-icon-circle-close" @click="data.relation.splice(index, 1)"></i>
                                </div>

                                <el-input
                                    v-model="relation.title"
                                    class="u-title"
                                    type="text"
                                    placeholder="子清单标题（选填）"
                                    maxlength="20"
                                    show-word-limit
                                ></el-input>

                                <draggable
                                    v-model="relation.data"
                                    class="u-item-drag"
                                    group="draggable-item"
                                    ghost-class="ghost"
                                    item-key="__dragKey"
                                >
                                    <template #item="{ element, index: key }">
                                        <div class="u-selected u-selected-item u-selected-count">
                                            <ItemIcon :item_id="element.id" :has_title="true" />
                                            <div class="u-count">
                                                <span>数量：</span>
                                                <el-input-number
                                                    v-model.number="element.count"
                                                    size="small"
                                                    :min="1"
                                                    label="数字"
                                                ></el-input-number>
                                            </div>
                                            <i class="u-close el-icon-circle-close" @click="relation.data.splice(key, 1)"></i>
                                        </div>
                                    </template>
                                    <template #footer>
                                        <div v-if="!relation.data || !relation.data.length" class="u-normal">
                                            拖拽所需道具到此处
                                        </div>
                                    </template>
                                </draggable>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button class="u-publish" type="primary" @click="submit" :loading="loading">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { pick } from "lodash";
import draggable from "vuedraggable";
import ItemSimple from "@jx3box/jx3box-editor/src/ItemSimple";
import ItemIcon from "@/components/common/item-icon.vue";
import { getItemsByName } from "@/service/item";
import { getItemPlanID, updatePlan } from "@/service/item-plan";

const createDragKey = (item) => {
    const sourceId = item.id || item.ID || item.Name || "item";
    return `${sourceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export default {
    name: "PlanEdit",
    components: {
        draggable,
        ItemIcon,
        "jx3-item-simple": ItemSimple,
    },
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
    computed: {
        id() {
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
        keyword() {
            this.resetPages();
        },
        page() {
            this.loadItems();
        },
    },
    mounted() {
        if (this.id) {
            this.loadData();
        }
    },
    methods: {
        normalizeDragItem(item) {
            return {
                ...item,
                id: item.id ?? item.ID,
                count: item.count ?? 1,
                __dragKey: item.__dragKey || createDragKey(item),
            };
        },
        cloneSearchItem(item) {
            return this.normalizeDragItem({
                ...item,
                count: 1,
                __dragKey: createDragKey(item),
            });
        },
        loadItems() {
            getItemsByName(this.keyword, this.params).then((res) => {
                this.searchList = (res.data.list || []).map((item) => this.normalizeDragItem(item));
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
        addRelation() {
            this.data.relation.unshift({
                title: "",
                data: [],
            });
        },
        moveHandle(e) {
            if (e.to.classList.contains("u-item-drag")) return;
            const aucGenre = e.to.getAttribute("data-AucGenre");
            const aucSubType = e.to.getAttribute("data-AucSubType");
            let result = e.draggedContext.element.AucGenre == aucGenre;
            if (aucSubType !== null) {
                result = result && e.draggedContext.element.AucSubType == aucSubType;
            }
            return result;
        },
        submit() {
            this.loading = true;
            const payload = pick(this.data, ["title", "type", "public", "relation", "description"]);
            updatePlan(this.id, payload)
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
        loadData() {
            getItemPlanID(this.id).then((res) => {
                this.data = this.extractID(res);
            });
        },
        extractID(data) {
            if (data.type == 1) {
                data.relation = data.relation.map((item) => {
                    item.data = item.data.map((el) => {
                        let normalized = el;
                        if (typeof normalized == "string") normalized = { id: normalized, count: 1 };
                        if (typeof normalized == "object") normalized = { id: normalized.id, count: normalized.count ?? 1 };
                        return this.normalizeDragItem(normalized);
                    });
                    return item;
                });
            } else {
                data.relation = this.equipItem(data.relation);
            }
            return data;
        },
        equipItem(data) {
            for (const key in data) {
                data[key] = data[key].map((item) => {
                    if (typeof item == "object") item = item.id;
                    return item;
                });
            }
            return data;
        },
        toEquipList(_obj) {
            this.equipList.map((list) => {
                list.map((el) => {
                    if (_obj.hasOwnProperty(el.title)) {
                        el.list = _obj[el.title];
                    }
                });
            });
        },
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
