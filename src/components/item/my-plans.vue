<template>
    <div class="m-plans-my">
        <div class="m-my-item-plans">
            <h3 class="c-sidebar-right-title">
                <span class="u-title">
                    <i class="u-icon u-icon-mycollection"><img svg-inline src="@/assets/img/item/plan.svg" /></i>
                    <span>{{ $t("ui.item.myPlans") }}</span>
                </span>
                <a class="fr el-button el-button--success el-button--small" @click="onAddPlan" v-if="isLogin">
                    <LegacyIcon class="el-icon-document-add" />
                    <span>{{ $t("ui.common.actions.create") }}</span>
                </a>
            </h3>
            <template v-if="isLogin">
                <template v-if="data && data.length">
                    <router-link
                        class="m-my-item-plan"
                        v-for="(plan, key) in data"
                        :key="key"
                        :to="{
                            name: 'plan_view',
                            params: { plan_id: plan.id },
                        }"
                    >
                        <h5 class="u-title">
                            <LegacyIcon class="el-icon-lock" v-if="!plan.public" />
                            <span>{{ plan.title }}</span>
                        </h5>
                        <!-- <div class="u-misc">
                            <div class="u-delete" @click.stop="delete_plan($event, plan.id)">
                                <LegacyIcon class="el-icon-delete " :title="$t('ui.common.actions.delete')" />
                            </div>
                            <div class="u-edit" @click.stop="edit_plan($event, plan.id)">
                                <LegacyIcon class="el-icon-edit " :title="$t('ui.common.actions.edit')" />
                            </div>
                            <span class="u-updated">{{ $t("ui.item.editedAt") }}{{ date_format(plan.updated) }}</span>
                        </div> -->
                    </router-link>
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
                </template>
                <div v-else class="u-tip">
                    <LegacyIcon class="el-icon-warning-outline" /> {{ $t("ui.item.noPlanRecords") }}
                </div>
            </template>
            <template v-else
                ><div class="u-tip"><LegacyIcon class="el-icon-warning-outline" /> {{ $t("ui.item.loginFirst") }}</div></template
            >
        </div>
    </div>
</template>

<script>
import { getMyPlans, addMyPlan } from "@/service/item-plan.js";
import { __Links } from "@/utils/config";
import User from "@jx3box/jx3box-common/js/user";
import { date_format } from "@/filters";
import bus from "@/store/bus";
export default {
    name: "",
    props: [],
    data: function () {
        return {
            isLogin: User.isLogin(),
            data: [],

            page: 1,
            per: 8,
            total: 0,
        };
    },
    computed: {
        params: function () {
            return {
                page: this.page,
                per: this.per,
            };
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler() {
                this.loadData();
            },
        },
    },
    mounted() {
        bus.on("plan_list_refresh", this.handlePlanListRefresh);
    },
    beforeUnmount() {
        bus.off("plan_list_refresh", this.handlePlanListRefresh);
    },
    methods: {
        date_format,
        handlePlanListRefresh() {
            this.loadData();
        },
        loadData() {
            if (!this.isLogin) {
                return;
            }
            getMyPlans(this.params).then((res) => {
                this.data = res.list;
                this.total = res.total;
            });
        },
        onAddPlan() {
            this.$prompt(this.$t("ui.item.newPlanName"), this.$t("ui.item.createPlan"), {
                confirmButtonText: this.$t("ui.common.actions.confirm"),
                cancelButtonText: this.$t("ui.common.actions.cancel"),
                inputPlaceholder: this.$t("ui.item.newPlanName"),
                inputValidator: (value) => {
                    if (!value) {
                        return this.$t("ui.item.newPlanName");
                    }
                },
                callback: (action, instance) => {
                    if (action === "confirm") {
                        const data = {
                            title: instance.inputValue,
                            type: 1, // 1: 物品清单
                            public: 1,
                            relation: [],
                            description: "",
                        };
                        addMyPlan(data).then((res) => {
                            this.$message({
                                message: this.$t("ui.common.status.createSuccess"),
                                type: "success",
                            });
                            this.data.unshift(res.data.data);
                            this.$router.push({
                                name: "plan_edit",
                                params: { plan_id: res.data.data.id },
                            });
                        });
                    }
                },
            });
        },
    },
};
</script>
