<template>
    <div class="p-plan-edit" v-loading="initialLoading">
        <h3 class="u-plan-header">{{ $t("ui.item.editPlan") }}</h3>
        <el-form class="u-form" label-position="left" label-width="80px">
            <el-form-item :label="$t('ui.common.labels.title')">
                <el-input
                    v-model="data.title"
                    :placeholder="$t('ui.item.planTitlePlaceholder')"
                    maxlength="20"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('ui.common.labels.visibility')">
                <el-radio v-model="data.public" :label="1">{{ $t("ui.item.public") }}</el-radio>
                <el-radio v-model="data.public" :label="0">{{ $t("ui.item.private") }}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('ui.common.labels.description')">
                <el-input
                    v-model="data.description"
                    type="textarea"
                    :rows="3"
                    :placeholder="$t('ui.item.planDescriptionPlaceholder')"
                    :maxlength="2000"
                    show-word-limit
                ></el-input>
            </el-form-item>
            <el-form-item :label="$t('ui.common.labels.list')">
                <el-button class="u-add-plan" @click="addRelation" type="primary" plain>
                    {{ $t("ui.item.addGroup") }}
                </el-button>
            </el-form-item>
            <el-form-item label="">
                <div class="m-plan-list">
                    <div class="u-list-search" v-loading="searchLoading">
                        <el-input
                            v-model.lazy.trim="keyword"
                            class="u-title"
                            :placeholder="$t('ui.item.itemNamePlaceholder')"
                            clearable
                        ></el-input>

                        <AsyncState :loading="searchLoading" :error="searchError" @retry="loadItems" />
                        <template v-if="!searchError && searchList.length">
                            <draggable
                                v-model="searchList"
                                item-key="__dragKey"
                                draggable=".u-change"
                                :move="moveHandle"
                                :group="{ name: 'draggable-item', pull: 'clone', put: false }"
                                :clone="cloneSearchItem"
                            >
                                <template #item="{ element }">
                                    <div class="u-change">
                                        <jx3-item-simple :item="element" />
                                    </div>
                                </template>
                            </draggable>
                        </template>

                        <el-empty
                            v-else-if="!searchError && !searchLoading"
                            :description="$t('ui.item.itemSearchTip')"
                            :image-size="200"
                        ></el-empty>

                        <el-pagination
                            v-if="!searchError"
                            v-model:current-page="page"
                            size="small"
                            class="m-archive-pages"
                            background
                            layout="prev, pager, next"
                            :hide-on-single-page="true"
                            :page-size="per"
                            :total="total"
                            :pager-count="5"
                        ></el-pagination>
                    </div>
                    <el-row v-if="data.type == 1" class="u-list-box" :gutter="20">
                        <el-col v-for="(relation, index) in data.relation" :key="index" :span="6">
                            <div class="u-list">
                                <div class="u-button-group">
                                    <LegacyIcon
                                        v-if="index != 0"
                                        class="u-to-left el-icon-d-arrow-left"
                                        @click="data.relation.splice(index, 0, data.relation.splice(index - 1, 1)[0])"
                                     />
                                    <LegacyIcon
                                        v-if="index != data.relation.length - 1"
                                        class="u-to-right el-icon-d-arrow-right"
                                        @click="data.relation.splice(index, 0, data.relation.splice(index + 1, 1)[0])"
                                     />
                                    <LegacyIcon class="u-list-close el-icon-circle-close" @click="data.relation.splice(index, 1)" />
                                </div>

                                <el-input
                                    v-model="relation.title"
                                    class="u-title"
                                    type="text"
                                    :placeholder="$t('ui.item.groupTitlePlaceholder')"
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
                                            <ItemIcon :item_id="element.id" :has_title="true" :size="24" />
                                            <div class="u-count">
                                                <span>{{ $t("ui.common.labels.quantity") }}</span>
                                                <el-input-number
                                                    v-model.number="element.count"
                                                    size="small"
                                                    :min="1"
                                                    :label="$t('ui.common.labels.number')"
                                                ></el-input-number>
                                            </div>
                                            <LegacyIcon class="u-close el-icon-circle-close" @click="relation.data.splice(key, 1)" />
                                        </div>
                                    </template>
                                    <template #footer>
                                        <div v-if="!relation.data || !relation.data.length" class="u-normal">
                                            {{ $t("ui.item.dragItemsHere") }}
                                        </div>
                                    </template>
                                </draggable>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button class="u-publish" type="primary" @click="submit" :loading="loading">{{
                    $t("ui.common.actions.save")
                }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import pick from "lodash/pick";
import draggable from "vuedraggable";
import ItemSimple from "@jx3box/jx3box-editor/src/ItemSimple";
import ItemIcon from "@/components/common/item-icon.vue";
import { getItemsByName } from "@/service/item";
import { getItemPlanID, updatePlan } from "@/service/item-plan";
import AsyncState from "@/components/common/async-state.vue";
import { createLatestRequestGuard } from "@/utils/latest-request";

const createDragKey = (item) => {
    const sourceId = item.id || item.ID || item.Name || "item";
    return `${sourceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export default {
    name: "PlanEdit",
    components: {
        draggable,
        ItemIcon,
        AsyncState,
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
            initialLoading: false,
            searchLoading: false,
            searchError: false,
            searchRequestGuard: createLatestRequestGuard(),
            initialRequestGuard: createLatestRequestGuard(),
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
            const token = this.searchRequestGuard.begin();
            this.searchLoading = true;
            this.searchError = false;
            getItemsByName(this.keyword, this.params)
                .then((res) => {
                    if (!this.searchRequestGuard.isCurrent(token)) return;
                    this.searchList = (res.data.list || []).map((item) => this.normalizeDragItem(item));
                    this.total = res.data.total || 0;
                })
                .catch(() => {
                    if (!this.searchRequestGuard.isCurrent(token)) return;
                    this.searchList = [];
                    this.total = 0;
                    this.searchError = true;
                })
                .finally(() => {
                    if (this.searchRequestGuard.isCurrent(token)) this.searchLoading = false;
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
            if (this.loading) return;
            this.loading = true;
            const payload = pick(this.data, ["title", "type", "public", "relation", "description"]);
            updatePlan(this.id, payload)
                .then(() => {
                    this.$message({
                        message: this.$t("ui.item.submitSuccess"),
                        type: "success",
                    });
                    this.$router.push({ name: "plan_view", params: { plan_id: this.id } });
                })
                .catch(() => {
                    this.$message.error(this.$t("ui.common.status.networkError"));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        loadData() {
            const token = this.initialRequestGuard.begin();
            this.initialLoading = true;
            getItemPlanID(this.id)
                .then((res) => {
                    if (!this.initialRequestGuard.isCurrent(token)) return;
                    this.data = this.extractID(res);
                })
                .catch(() => {
                    if (!this.initialRequestGuard.isCurrent(token)) return;
                    this.$message.error(this.$t("ui.common.status.loadFailed"));
                })
                .finally(() => {
                    if (this.initialRequestGuard.isCurrent(token)) this.initialLoading = false;
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
    beforeUnmount() {
        this.searchRequestGuard.invalidate();
        this.initialRequestGuard.invalidate();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/item/item-plan.less";
</style>
