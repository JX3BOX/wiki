<template>
	<router-link v-if="data" class="m-knowledge-item" :to="{ name: 'view', params: { source_id: data.id } }">
		<div class="u-name">
			<span class="u-type"><LegacyIcon class="u-icon" :name="icons[data.type]" /> {{ data.label }}</span>
			<span class="u-title">{{ data.name }}</span>
		</div>
		<div class="u-tags" v-if="hasTag(data.post)">
			<LegacyIcon class="el-icon-price-tag" />
			<span class="u-tags-content">
				<span v-for="item in formatTags(data.post.tags)" :key="item">{{ item }}</span>
			</span>
		</div>
		<span class="u-remark" v-if="data.post">
			<LegacyIcon class="el-icon-edit" />
			<span class="u-remark-content">{{ $t("ui.knowledge.lastRevision") }}{{ data.post.remark }}@{{ data.post.user_nickname }}</span>
		</span>
		<div class="u-updated" v-if="data.updated">
			<LegacyIcon class="el-icon-refresh" />
			<span> {{ $t("ui.knowledge.lastUpdated") }}{{ date_format(data.updated) }}</span>
		</div>
	</router-link>
</template>
<script>
import icons from "@/assets/data/icons.json";
import { ts2str } from "@jx3box/jx3box-common/js/utils";
export default {
	name: "item",
	props: ["data"],
	data: function () {
		return {
			icons,
			date_format: ts2str,
		};
	},
	computed: {},
	watch: {},
	methods: {
		// 是否有标签
		hasTag(data) {
			return data && data.tags
		},
        formatTags(val) {
            return val.split(",").map((item) => {
                return item.trim();
            });
        }
	},
	created: function () {},
};
</script>
<style lang="less">
@import "~@/assets/css/knowledge/item.less";
</style>
