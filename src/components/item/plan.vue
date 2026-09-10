<template>
    <el-popover popper-class="w-plans m-item-plan-picker" placement="bottom" trigger="click" v-model:visible="visible" width="300">
        <el-input class="m-input" v-model="search" :placeholder="$t('ui.item.planKeyword')" size="default" prefix-icon="Search"></el-input>
        <div class="m-list" ref="listViewport" @scroll.passive="loadMoreOnScroll">
            <div class="u-list" v-for="(item, index) in list" :key="item.id">
                <button type="button" class="u-title" :class="{ 'is-expanded': relation_index === index }" :aria-expanded="relation_index === index" @click="showRelation(item, index)">
                    <LegacyIcon :class="relation_index == index ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" />
                    <span class="u-value" :class="hasInPlan(item) ? 'u-has' : ''">
                        {{ item.title }}
                        <span v-if="hasInPlan(item)" class="u-added">{{ $t("ui.item.alreadyAdded") }}</span>
                    </span>
                </button>
                <template v-if="relation_index == index && item.relation">
                    <button type="button" class="u-child" v-for="(plan, k) in item.relation" :key="k" @click="addToPlan(item, k)">
                        <span>{{ plan.title || `${$t("ui.item.subPlan")}${k + 1}` }}</span>
                    </button>
                </template>
            </div>
            <div v-if="loading" class="u-load-state" role="status">{{ $t("ui.common.status.loading") }}</div>
            <div v-else-if="loadError" class="u-load-state" role="status">
                <span>{{ $t("ui.common.status.loadFailed") }}</span>
                <el-button text size="small" @click="loadPlans()">{{ $t("ui.common.actions.retry") }}</el-button>
            </div>
            <el-alert v-else-if="!list.length" :title="$t('ui.item.noPlans')" type="info" center show-icon :closable="false" />
        </div>

        <el-popover popper-class="w-add-plans m-item-plan-create" placement="top" width="160" trigger="click" v-model:visible="add">
            <el-input class="u-input" v-model="new_plan" :placeholder="$t('ui.item.newPlanName')"></el-input>
            <div class="m-create-actions">
                <el-button size="small" @click="add = false">{{ $t("ui.common.actions.cancel") }}</el-button>
                <el-button type="primary" size="small" @click="createPlan">{{ $t("ui.common.actions.confirm") }}</el-button>
            </div>
            <template #reference>
                <div class="m-create">
                    <el-button class="u-create-plan" plain>
                        <LegacyIcon class="el-icon-document-add" />
                        <span>{{ $t("ui.item.createPlan") }}</span>
                    </el-button>
                </div>
            </template>
        </el-popover>

        <template #reference>
            <el-button size="small" type="success" @click="openPlans"
                ><LegacyIcon class="el-icon-shopping-cart-full" /> <span>{{ $t("ui.item.addToPlan") }}</span></el-button
            >
        </template>
    </el-popover>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user";
import { getMyPlans, updatePlan, addMyPlan } from "@/service/item-plan.js";
import pick from "lodash/pick";
export default {
    name: "plan",
    props: [],
    data: function () {
        return {
            visible: false,
            add: false,

            search: "",
            list: [],

            relation_index: -1,
            new_plan: "",

            page: 0,
            total: 0,
            per: 10,
            loading: false,
            loadError: false,
            hasMore: true,
            requestVersion: 0,
        };
    },
    computed: {
        item_id: function () {
            return this.$route.params.item_id;
        },
    },
    watch: {
        search() {
            this.resetPlans();
        },
    },
    beforeUnmount() {
        this.requestVersion++;
    },
    methods: {
        // 数据
        // ========================
        // 打开我的清单列表，未登录则跳转登录页
        openPlans() {
            if (!User.isLogin()) return User.toLogin();
            this.resetPlans();
        },
        resetPlans() {
            this.requestVersion++;
            this.loading = false;
            this.loadError = false;
            this.list = [];
            this.page = 0;
            this.total = 0;
            this.hasMore = true;
            this.relation_index = -1;
            if (this.$refs.listViewport) this.$refs.listViewport.scrollTop = 0;
            return this.loadPlans();
        },
        loadMoreOnScroll() {
            const viewport = this.$refs.listViewport;
            if (!this.visible || !viewport || !viewport.clientHeight || this.loadError) return;
            if (viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 40) {
                this.loadPlans();
            }
        },
        async loadPlans() {
            if (this.loading || !this.hasMore) return;
            const version = this.requestVersion;
            const nextPage = this.page + 1;
            this.loading = true;
            this.loadError = false;
            try {
                const res = await getMyPlans({ type: 1, search: this.search, page: nextPage, per: this.per });
                if (version !== this.requestVersion) return;
                const items = res.list || [];
                const existing = new Set(this.list.map((item) => item.id));
                this.list.push(...items.filter((item) => !existing.has(item.id)));
                this.total = Number(res.total) || 0;
                this.page = nextPage;
                this.hasMore = items.length === this.per && nextPage * this.per < this.total;
            } catch (error) {
                if (version === this.requestVersion) this.loadError = true;
            } finally {
                if (version === this.requestVersion) {
                    this.loading = false;
                    this.$nextTick(() => this.loadMoreOnScroll());
                }
            }
        },

        // 交互
        // =========================
        // 是否在清单内
        hasInPlan(item) {
            let plan_items = [];
            item.relation.forEach((subplan) => {
                subplan?.data.forEach((e) => {
                    if (e) plan_items.push(e?.id);
                });
            });
            return plan_items.includes(this.item_id);
        },
        // 显示子清单
        showRelation(item, index) {
            if (this.relation_index == index) return (this.relation_index = -1);
            this.relation_index = index;
            if (!item.relation?.length) {
                item.relation = [];
                item.relation.push({
                    title: this.$t("ui.item.subPlan"),
                    data: [],
                });
            }
        },
        // 加入物品清单
        addToPlan(item, k) {
            // 鍔犲埌瀵瑰簲鐨勫瓙娓呭崟
            item.relation[k].data.push({
                id: this.item_id,
                count: 1,
            });
            this.postPlan(item.id, item);
        },
        // 鎻愪氦娓呭崟
        postPlan(id, data) {
            const _data = pick(data, ["title", "type", "public", "relation", "description"]);
            updatePlan(id, _data)
                .then(() => {
                    this.$message({
                        message: this.$t("ui.common.status.addSuccess"),
                        type: "success",
                    });
                    this.visible = false;
                })
                .finally(() => {
                    this.relation_index = -1;
                });
        },
        // 创建新清单
        createPlan() {
            let data = {
                title: this.new_plan,
                relation: [
                    {
                        title: this.$t("ui.item.subPlan"),
                        data: [{ id: this.item_id, count: 1 }],
                    },
                ],
                public: 1,
                type: 1,
                description: "",
            };
            this.list.push(data);
            addMyPlan(data)
                .then(() => {
                    this.$notify({
                        title: this.$t("ui.item.planCreated"),
                        message: this.$t("ui.item.planCreatedWithItem"),
                        type: "success",
                    });
                })
                .finally(() => {
                    this.add = false;
                    this.visible = false;
                    this.new_plan = "";
                });
        },
    },
};
</script>
<style lang="less">
.el-popover.el-popper.m-item-plan-picker,
.el-popover.el-popper.m-item-plan-create {
    max-width: calc(100vw - 32px);
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid #e7e9f1;
    border-radius: 8px;
    box-shadow: 0 8px 28px rgba(52, 43, 89, 0.1);
    color: #596170;
    font-size: 12px;

    .el-input__wrapper {
        min-height: 34px;
        padding: 1px 10px;
        border-radius: 6px;
        background: #fafbfc;
        box-shadow: 0 0 0 1px #e5e7ee inset;

        &.is-focus { box-shadow: 0 0 0 1px #b8a9e8 inset; }
    }

    .el-input__inner {
        font-size: 12px;
        &::placeholder { color: #a0a6b1; font-weight: 400; }
    }

    .el-input__prefix { color: #a0a6b1; }
}

.m-item-plan-picker {
    .m-list {
        max-height: min(360px, 50vh);
        overflow-y: auto;
        padding-top: 8px;
        .scrollbar();
    }

    .u-list {
        margin: 2px 0;
        font-size: 12px;

        .u-title,
        .u-child {
            display: flex;
            align-items: center;
            gap: 7px;
            width: 100%;
            min-height: 34px;
            padding: 7px 8px;
            box-sizing: border-box;
            border: 0;
            border-radius: 5px;
            background: transparent;
            color: #606876;
            font: inherit;
            line-height: 20px;
            text-align: left;
            cursor: pointer;
            transition: background-color 0.15s, color 0.15s;

            &:hover,
            &.is-expanded {
                background: #f5f2fc;
                color: #7863c5;
            }

            &:focus-visible {
                outline: 2px solid #a99adf;
                outline-offset: -2px;
            }
        }

        .u-title > .legacy-icon {
            flex-shrink: 0;
            color: #a5aab5;
            font-size: 11px;
        }

        .u-value {
            flex: 1;
            min-width: 0;
            overflow-wrap: anywhere;
        }

        .u-added {
            display: inline-block;
            margin-left: 6px;
            padding: 0 5px;
            border-radius: 4px;
            background: #eee8fc;
            color: #8a78b9;
            font-size: 11px;
            font-weight: 400;
            white-space: nowrap;
        }

        .u-child {
            width: calc(100% - 14px);
            margin: 2px 0 2px 14px;
            padding-left: 15px;
            border-left: 1px solid #e8e3f5;
            border-radius: 0 5px 5px 0;
            overflow-wrap: anywhere;

            &::after {
                content: "+";
                margin-left: auto;
                color: #a49abf;
                flex-shrink: 0;
            }
        }
    }

    .u-load-state {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px 0;
        color: #969da9;
        font-size: 12px;
    }

    .m-create {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #eef0f4;
    }

    .u-create-plan {
        width: 100%;
        height: 32px;
        gap: 5px;
        border-color: #e5dff8;
        border-radius: 6px;
        background: #f5f2ff;
        color: #7863c5;
        font-size: 12px;
        font-weight: 400;

        > span {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        &:hover,
        &:focus-visible {
            border-color: #cfc3f0;
            background: #ede7fc;
            color: #6854dc;
        }
    }
}

.m-item-plan-create {
    .u-input { margin-bottom: 10px; }
    .m-create-actions {
        display: flex;
        justify-content: flex-end;
        gap: 6px;
        .el-button { margin: 0; border-radius: 5px; font-weight: 400; }
    }
}
</style>
