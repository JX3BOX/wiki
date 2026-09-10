<template>
    <WikiPanel :border="false">
        <template #head-title>
            <LegacyIcon class="el-icon-location-information" />
            <span>{{ $t("ui.common.home.quickEntry") }}</span>
        </template>
        <template #body>
            <ul class="m-qlinks">
                <li class="u-qlink">
                    <a class="u-bigbang" href="/event/bigbang" target="_blank" rel="noopener noreferrer">
                        <LegacyIcon class="el-icon-trophy" />
                        <span>{{ $t("ui.knowledge.bigbang") }}</span>
                    </a>
                </li>
                <li class="u-qlink">
                    <a :href="publishLink('knowledge')" target="_blank" rel="noopener noreferrer">
                        <LegacyIcon class="el-icon-edit-outline" />
                        <span>{{ $t("ui.knowledge.quickCreate") }}</span>
                    </a>
                </li>
                <li class="u-qlink">
                    <a class="u-team" href="/team" target="_blank" rel="noopener noreferrer">
                        <LegacyIcon class="el-icon-user" />
                        <span>{{ $t("ui.knowledge.quickTeam") }}</span>
                    </a>
                </li>
                <li class="u-qlink">
                    <a href="/exam" target="_blank" rel="noopener noreferrer">
                        <LegacyIcon class="el-icon-edit-outline" />
                        <span>{{ $t("ui.knowledge.quickExam") }}</span>
                    </a>
                </li>
                <li class="u-qlink">
                    <a href="/community?category=story" target="_blank" rel="noopener noreferrer">
                        <LegacyIcon class="el-icon-collection" />
                        <span>{{ $t("ui.knowledge.quickStory") }}</span>
                    </a>
                </li>
            </ul>
        </template>
    </WikiPanel>
</template>

<script>
import { publishLink } from "@jx3box/jx3box-common/js/utils";
import WikiPanel from "@/components/common/wiki-panel.vue";

export default {
    name: "KnowledgeEntry",
    components: { WikiPanel },
    methods: { publishLink },
};
</script>

<style scoped lang="less">
.m-qlinks .u-qlink .u-bigbang {
    background-color: #fe7979;
}
.m-qlinks .u-qlink .u-team {
    background-color: #f7b044;
}
</style>
