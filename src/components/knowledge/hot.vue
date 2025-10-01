<template>
	<div class="m-knowledge-panel">
		<div class="m-title">
			<span class="u-title-left">
				<i :class="icon"></i><span> {{ title }}</span>
			</span>
			<router-link v-if="link" class="u-title-right" to="link">查看更多 &raquo;</router-link>
		</div>
		<div class="m-panel">
			<el-carousel height="66" direction="vertical" indicator-position="none" v-if="list.length">
				<el-carousel-item class="m-hot" v-for="(line, index) in list" :key="index">
					<router-link v-for="(item, key) in line" :key="key" class="u-hot" :to="{ name: 'view', params: { source_id: item.id } }">
						<img class="u-icon" :src="hot_img" />
						<div class="u-content">
							<div class="u-title" v-text="item.name"></div>
							<div class="u-desc" v-if="item.post">
								<span :title="item.post.remark">{{ "By " + item.post.user_nickname }}</span>
							</div>
						</div>
					</router-link>
				</el-carousel-item>
			</el-carousel>
			<div v-else>😂 暂无热门事件</div>
		</div>
	</div>
</template>
<script>
import { __iconPath } from "@/utils/config";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";
import { getKnowledgeSearch } from "@/service/knowledge.js";
export default {
	name: "Hot",
	props: [],
	data: function () {
		return {
			hot_img: __iconPath + "icon/243.png",
			hotList: "",
		};
	},
	computed: {
		icon() {
			return this.data?.icon || "el-icon-collection";
		},
		title() {
			return this.data?.title || "热门剧情";
		},
		link() {
			return this.data?.link || "";
		},
		list() {
			let _list = [];
			if (this.data?.list) {
				let list = this.data.list.filter(Boolean);
				for (let i = 0; i < list.length; i += 3) {
					_list.push(list.slice(i, i + 3));
				}
			} else {
				_list = this.hotList;
			}
			return _list;
		},
	},
	methods: {
		// 获取热门
		getHotData() {
			getStatRank("plot", "views", 18).then((res) => {
				let list = [];
				res.data.forEach((item) => {
					if (item.name.startsWith("plot")) {
						let id = item.name.split("-").pop();
						list.push(id);
					}
				});
				getKnowledgeSearch({ ids: list.join() }).then((res) => {
					this.hotList = res.data;
				});
			});
		},
	},
	created() {
		this.getHotData();
	},
};
</script>
<style scoped>
.m-panel {
	height: 66px;
	margin-bottom: 10px;
	overflow: hidden;
}
/* .m-hot {
	.flex;
	.size(100%,66px);
	.u-hot {
		.size(33.3%,66px);
		.flex;
		.r(5px);
		.mr(20px);
		.mb(10px);
		padding: 8px 5px;
		flex-wrap: nowrap;
		box-sizing: border-box;
		border: 1px solid #d7dae1;
		border-left: 5px solid #3a97eb;
		background-color: #f5f7fa;

		&:nth-child(3n) {
			.mr(0);
		}
	}
	.u-icon {
		.size(48px);
		.mr(10px);
	}
	.u-content {
		.flex;
		flex-direction: column;
		justify-content: center;
		.color(@color);
		.u-desc {
			.fz(12px);
			opacity: 0.6;
		}
	}
} */
</style>
