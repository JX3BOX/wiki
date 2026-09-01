<template>
    <div class="m-knowledge-panel">
        <div class="m-title">
            <span class="u-title-left"
                ><LegacyIcon class="el-icon-location-information" /><span>
                    {{ $t("ui.common.home.quickEntry") }}</span
                ></span
            >
            <!-- <a class="u-title-right" target="_blank" :href="feedback">反馈建议 &raquo;</a> -->
        </div>
        <div class="m-entry m-panel">
            <a class="u-entry" v-for="(item, index) in list" :key="index" :href="item.link" target="_blank">
                <LegacyIcon :name="item.icon" />
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
        };
    },
    computed: {
        list() {
            return [
                {
                    link: "/cj",
                    name: this.$t("ui.apps.achievement"),
                    icon: "el-icon-medal",
                },
                {
                    link: "/item",
                    name: this.$t("ui.apps.item"),
                    icon: "el-icon-apple",
                },
                {
                    link: "#/pet",
                    name: this.$t("ui.achievement.quick.pets"),
                    icon: "el-icon-pear",
                },
                {
                    link: "/quest",
                    name: this.$t("ui.apps.quest"),
                    icon: "el-icon-discover",
                },
            ];
        },
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
		background-color: @v4primary;
		i {
			.mr(5px);
		}
		&:hover {
			filter: brightness(110%);
		}
	}
}
</style>
