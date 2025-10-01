<template>
    <div class="m-knowledge-panel">
        <div class="m-title">
            <span class="u-title-left"><i class="el-icon-location-information"></i><span> 便捷入口</span></span>
            <!-- <a class="u-title-right" target="_blank" :href="feedback">反馈建议 &raquo;</a> -->
        </div>
        <div class="m-entry m-panel">
            <a class="u-entry" v-for="(item, index) in list" :key="index" :href="item.link" target="_blank">
                <i :class="item.icon"></i>
                <span>{{ item.name }}</span>
            </a>
        </div>
    </div>
</template>
<script>
import { feedback } from "@/utils/config";
export default {
    name: "Entry",
    data: function () {
        return {
            feedback,
            list: [
                {
                    link: "/cj",
                    name: "成就百科",
                    icon: "el-icon-medal",
                },
                {
                    link: "/item",
                    name: "物品百科",
                    icon: "el-icon-apple",
                },
                {
                    link: "#/pet",
                    name: "宠物百科",
                    icon: "el-icon-pear",
                },
                {
                    link: "/quest",
                    name: "任务百科",
                    icon: "el-icon-discover",
                },
            ],
        };
    },
};
</script>

<style scoped lang="less">
.m-entry {
	.flex;
	.u-entry {
		.mr(20px);
		.db;
		.r(4px);
		.color(#fff);
		padding: 8px 20px;
		background-color: #3a97eb;
		i {
			.mr(5px);
		}
		&:hover {
			filter: brightness(110%);
		}
	}
}
</style>
