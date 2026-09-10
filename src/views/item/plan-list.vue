<template>
    <div class="v-plan-list" v-loading="loading">
        <header class="m-plan-list-header">
            <div class="m-plan-heading">
                <span class="u-heading-icon"><LegacyIcon class="el-icon-notebook-1" /></span>
                <h1 class="m-plan-title">{{ $t("ui.item.planTitle") }}</h1>
            </div>
            <el-input
                class="m-plan-search"
                :placeholder="$t('ui.item.planKeyword')"
                :aria-label="$t('ui.item.planKeyword')"
                v-model="search"
                prefix-icon="Search"
                clearable
            />
        </header>
        <div class="m-plan-results" v-if="plans && plans.length">
            <article class="m-item" v-for="plan in plans" :key="plan.id">
                <router-link class="u-cover" :to="{ name: 'plan_view', params: { plan_id: plan.id } }" :aria-label="plan.title">
                    <img class="u-img" :src="listImg(plan.type)" alt="" />
                </router-link>
                <div class="u-content">
                    <router-link class="u-title" :to="{ name: 'plan_view', params: { plan_id: plan.id } }">{{ plan.title }}</router-link>
                    <p class="u-desc" v-if="plan.description">{{ plan.description }}</p>
                    <div class="u-user">
                        <a class="u-author" :href="authorLink(plan.user_id)">
                            <img class="u-avatar" :src="showAvatar(getUserInfo(plan, 'user_avatar'))" alt="" />
                            <span class="u-name">{{ getUserInfo(plan, "display_name") || $t("ui.common.labels.anonymous") }}</span>
                        </a>
                        <span class="u-time" v-if="plan.updated"><LegacyIcon class="el-icon-time" />{{ date_format(plan.updated) }}</span>
                    </div>
                </div>
            </article>
        </div>
        <div v-else-if="!loading" class="m-plan-empty">
            <LegacyIcon class="el-icon-document" />
            <span>{{ $t("ui.item.noMatchingPlan") }}</span>
        </div>
        <el-pagination v-model:current-page="page" class="m-archive-pages" background layout="total, prev, pager, next, jumper" :pager-count="5" :hide-on-single-page="true" :page-size="per" :total="total" />
    </div>
</template>
<script>
import { __iconPath } from "@/utils/config";
import { getItemPlans } from "@/service/item-plan.js";
import { showAvatar, authorLink, ts2str } from "@jx3box/jx3box-common/js/utils";
export default {
	name: "PlanList",
	data: function () {
		return {
			loading: false,
			search: "",
			plans: [],

			page: 1,
			per: 10,
			total: 1,
			pages: 1,

			date_format: ts2str,
		};
	},
	computed: {
		params() {
			let params = {
				page: this.page,
				per: this.per,
			};
			if (this.search) params.search = this.search;
			return params;
		},
	},
	watch: {
		params: {
			immediate: true,
			deep: true,
			handler: function () {
				this.getPlansData();
			},
		},
	},
	methods: {
		// 获取数据
		// =========================
		getPlansData() {
			this.loading = true;
			getItemPlans(this.params)
				.then((res) => {
					this.plans = res.list;
					this.total = res.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 转换展示数据
		// =========================
		listImg(val) {
			return val == 1 ? __iconPath + "icon/3089.png" : __iconPath + "icon/2410.png";
		},
		showAvatar,
		authorLink,
		getUserInfo: function (plan, key) {
			return plan?.user_info?.[key];
		},
	},
};
</script>
<style lang="less">
@import "~@/assets/css/item/plan-list.less";
</style>
