<template>
	<div class="v-plan-list" v-loading="loading">
		<!-- 头部 - 标题&搜索 -->
		<div class="m-plan-title">物品清单</div>
		<div class="m-plan-search">
			<el-input placeholder="请输入搜索内容" v-model="search">
				<span slot="prepend">关键词</span>
				<el-button slot="append" icon="el-icon-search"></el-button>
			</el-input>
		</div>
		<!-- 列表 -->
		<div class="m-plan-list">
			<template v-if="plans && plans.length">
				<router-link class="m-item" v-for="(plan, key) in plans" :key="key" :to="{ name: 'plan_view', params: { plan_id: plan.id } }">
					<img class="u-img" :src="listImg(plan.type)" alt="" />
					<div class="u-content">
						<span class="u-title">{{ plan.title }}</span>
						<span class="u-desc" v-if="plan.description">{{ plan.description }}</span>
						<span class="u-user">
							<img class="u-avatar" :src="showAvatar(getUserInfo(plan, 'user_avatar'))" :alt="getUserInfo(plan, 'user_avatar')" />
							<a class="u-name" :href="authorLink(plan.user_id)">{{ getUserInfo(plan, "display_name") || "匿名" }}</a>
							<span class="u-time"><i class="el-icon-time"></i>{{ date_format(plan.updated) }}</span>
						</span>
					</div>
				</router-link>
			</template>
			<el-alert v-else center title="📋 没有对应的物品清单" type="info" :closable="false"></el-alert>
		</div>
		<el-pagination class="m-archive-pages" background layout="total, prev, pager, next, jumper" :hide-on-single-page="true" :page-size="per" :total="total" :current-page.sync="page"></el-pagination>
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
