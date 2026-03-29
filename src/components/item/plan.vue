<template>
    <el-popover popper-class="w-plans" placement="bottom" trigger="click" v-model="visible" width="300">
        <el-input class="m-input" v-model.lazy="search" placeholder="璇疯緭鍏ユ竻鍗曞叧閿瓧" size="large" prefix-icon="Search"></el-input>
        <div class="m-list" v-if="list && list.length">
            <div class="u-list" v-for="(item, index) in list" :key="index">
                <div class="u-title" @click="showRelation(item, index)">
                    <LegacyIcon :class="relation_index == index ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" />
                    <span class="u-value" :class="hasInPlan(item) ? 'u-has' : ''">{{ item.title }} </span>
                </div>
                <template v-if="relation_index == index && item.relation">
                    <div class="u-child" v-for="(plan, k) in item.relation" :key="k" @click="addToPlan(item, k)">
                        <LegacyIcon class="el-icon-arrow-right" />
                        <span>{{ plan.title || `子清单${k + 1}` }}</span>
                    </div>
                </template>
            </div>
        </div>
        <div v-else class="m-list">
            <el-alert title="鏆傛棤娓呭崟" type="info" center show-icon :closable="false"> </el-alert>
        </div>
        <el-pagination
            class="m-pagination"
            background
            layout="prev, pager, next"
            :pager-count="5"
            size="small"
            :hide-on-single-page="true"
            :page-size="per"
            :total="total"
            v-model:current-page="page"
        ></el-pagination>

        <el-popover popper-class="w-add-plans" placement="top" width="160" trigger="click" v-model="add">
            <el-input class="u-input" v-model="new_plan" placeholder="璇疯緭鍏ユ柊娓呭崟鍚嶇О"></el-input>
            <div style="text-align: right; margin: 0">
                <el-button size="small" @click="add = false">鍙栨秷</el-button>
                <el-button type="primary" size="small" @click="createPlan">纭畾</el-button>
            </div>
            <template #reference>
                <div class="m-create">
                    <!-- <a href="/publish/#/item_plan" target="_blank" class="el-button"><LegacyIcon class="el-icon-document-add" /> 鍒涘缓鏂版竻鍗?/a> -->
                    <span class="el-button"><LegacyIcon class="el-icon-document-add" /> 创建新清单</span>
                </div>
            </template>
        </el-popover>

        <template #reference>
            <el-button size="small" type="success" @click="openPlans"
                ><LegacyIcon class="u-el-icon el-icon-shopping-cart-full" /> 鍔犲叆娓呭崟</el-button
            >
        </template>
    </el-popover>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user";
import { getMyPlans, updatePlan, addMyPlan } from "@/service/item-plan.js";
import { pick } from "lodash";
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

            page: 1,
            total: 0,
            per: 5,
        };
    },
    computed: {
        item_id: function () {
            return this.$route.params.item_id;
        },
        params: function () {
            return {
                page: this.page,
                per: this.per,
            };
        },
    },
    watch: {
        search(val) {
            this.loadPlans({ search: val });
        },
        page() {
            this.loadPlans(this.params);
        },
    },
    methods: {
        // 鏁版嵁
        // ========================
        // 鎵撳紑鎴戠殑娓呭崟鍒楄〃锛屾湭鐧诲綍鍒欒烦杞櫥褰曢〉
        openPlans() {
            if (!User.isLogin()) User.toLogin();
            this.loadPlans(this.params);
        },
        // 鍔犺浇娓呭崟鍒楄〃
        loadPlans(params) {
            let _params = Object.assign({ type: 1 }, params);
            getMyPlans(_params).then((res) => {
                this.list = res.list;
                this.total = res.total;
                console.log(this.list);
            });
        },

        // 浜や簰
        // =========================
        // 鏄惁鍦ㄦ竻鍗曞唴
        hasInPlan(item) {
            let plan_items = [];
            item.relation.forEach((subplan) => {
                subplan?.data.forEach((e) => {
                    if (e) plan_items.push(e?.id);
                });
            });
            return plan_items.includes(this.item_id);
        },
        // 鏄剧ず瀛愭竻鍗?
        showRelation(item, index) {
            if (this.relation_index == index) return (this.relation_index = -1);
            this.relation_index = index;
            if (!item.relation?.length) {
                item.relation = [];
                item.relation.push({
                    title: "子清单",
                    data: [],
                });
            }
        },
        // 鍔犲叆鐗╁搧娓呭崟
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
            const _data = pick(data, ['title', 'type', 'public', 'relation', 'description'])
            updatePlan(id, _data)
                .then(() => {
                    this.$message({
                        message: "娣诲姞鎴愬姛",
                        type: "success",
                    });
                    this.visible = false;
                })
                .finally(() => {
                    this.relation_index = -1;
                });
        },
        // 鍒涘缓鏂版竻鍗?
        createPlan() {
            let data = {
                title: this.new_plan,
                relation: [
                    {
                        title: "子清单",
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
                        title: "鏂板娓呭崟鎴愬姛",
                        message: "鏂板娓呭崟鎴愬姛锛岀墿鍝佸凡娣诲姞",
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
<style lang="less" scoped>
.w-plans {
    max-height: 800px;
    overflow-y: auto;
    .m-create {
        .x;
        .mt(10px);
        padding-top: 10px;
        border-top: 1px solid #eee;
        .el-button {
            padding: 8px 20px;
        }
    }
    .m-list {
        .pt(10px);
    }

    .u-list {
        .fz(14px, 2);
        .pointer;
        .u-title,
        .u-child {
            &:hover {
                color: @color-link;
                background-color: @bg-gray;
            }
        }
        .u-title {
            .flex;
            align-items: center;
            .u-value {
                width: 100%;
                .db;
            }
            .u-has::after {
                content: "(已加入)";
                .fr;
                .fz(12px);
            }
        }

        .u-child:hover:after {
            content: "✓";
            .fr;
        }
        .has-child {
            &::after {
                content: "  ";
                .fr;
            }
        }
        .u-status {
            color: #999;
            font-style: normal;
            .mr(5px);
        }

        .u-child {
            .pl(1em);
        }
        i {
            .mr(5px);
        }
    }
}
.w-add-plans {
    .u-input {
        .mb(10px);
    }
}
</style>
<style lang="less">
.w-plans,
.w-add-plans {
    z-index: 99 !important;
    width: 180px;
}
.m-item-icon-popup {
    padding: 0;
}
.m-pagination {
    .mt(10px);
    .w(100%);
}
</style>

