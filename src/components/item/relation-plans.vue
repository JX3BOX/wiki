<template>
	<div class="m-relation-plans">
		<template v-if="relation_plans.length">
			<el-table :data="relation_plans" @cell-click="openLink">
				<el-table-column prop="title" label="清单名称">
					<template slot-scope="scope">
						<div class="u-title">
                            <i class="el-icon-tickets"></i>
                            {{ scope.row.title }}
                            </div>
					</template>
				</el-table-column>
				<el-table-column prop="description" label="描述"> </el-table-column>
				<el-table-column prop="user_nickname" label="作者">
					<template slot-scope="scope">
						<a :href="author_url(scope.row.user_id)" class="u-name" target="_blank" @click.stop>
							<img :src="scope.row.user_avatar" :alt="scope.row.user_nickname" />
							<span>{{ scope.row.user_nickname }}</span>
						</a>
					</template>
				</el-table-column>
				<el-table-column prop="updated" label="更新日期">
					<template slot-scope="scope">
						<span>{{ date_format(scope.row.updated) }}</span>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-row :gutter="20">
				<el-col :span="12" v-for="(plan, key) in relation_plans" :key="key">
					<div class="u-plan">
						<span v-if="plan.type == 1" class="u-type" :class="'u-type-' + plan.type">
							<img :src="plan_1_icon" />
						</span>
						<span v-if="plan.type == 2" class="u-type" :class="'u-type-' + plan.type">
							<img :src="plan_2_icon" />
						</span>
						<router-link
							class="u-name"
							v-text="plan.title"
							:to="{
								name: 'plan_view',
								params: { plan_id: plan.id },
							}"
						></router-link>
						<span class="u-desc" v-text="plan.description"></span>
					</div>
				</el-col>
			</el-row> -->
		</template>
		<div v-else style="text-align: center">🐖 暂无记录</div>
	</div>
</template>

<script>
// 已弃用该文件
import { get_item_relation_plans } from "@/service/item";
import { date_format, author_url } from "@/filters/";
import { __iconPath } from "@/utils/config";

export default {
	name: "RelationPlans",
	props: ["item_id"],
	data() {
		return {
			relation_plans: [],
			avatar: __iconPath + "icon/2410.png",
			plan_1_icon: __iconPath + "icon/3089.png",
		};
	},
	watch: {
		item_id: {
			immediate: true,
			handler() {
				if (this.item_id) {
					get_item_relation_plans(this.item_id, { limit: 10 }).then(
						(data) => {
							data = data.data;
							this.relation_plans = data.data.data;
						},
						(err) => {
							this.relation_plans = [];
						}
					);
				}
			},
		},
	},
	methods: {
		date_format,
		author_url,
		openLink(row) {
            this.$router.push({ name: 'plan_view', params: { plan_id: row.id } });
		},
	},
};
</script>

<style lang="less">
@import "~@/assets/css/item/relation-plans.less";
</style>
