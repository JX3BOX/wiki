<template>
    <div class="m-group-directory" :class="{ 'is-compact': compact }" v-loading="loading">
        <div v-if="!compact" class="m-directory-toolbar">
            <el-input v-model="keyword" clearable :placeholder="$t('ui.achievement.groupSearch')" :aria-label="$t('ui.achievement.groupSearch')">
                <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <div class="m-directory-filters" :aria-label="$t('ui.achievement.groupRegions')">
                <button type="button" :class="{ 'is-active': !selectedRegion }" :aria-pressed="!selectedRegion" @click="selectedRegion = ''">{{ $t('ui.achievement.groupAll') }}</button>
                <button v-for="region in regionGroups" :key="region.name" type="button" :class="{ 'is-active': selectedRegion === region.name }" :aria-pressed="selectedRegion === region.name" @click="selectedRegion = region.name">{{ region.name }}<span>{{ region.servers.length }}</span></button>
            </div>
        </div>
        <div v-if="failed" role="alert" class="m-directory-error">
            <p>{{ $t("ui.achievement.groupsError") }}</p>
            <el-button @click="loadGroups">{{ $t("ui.achievement.groupsRetry") }}</el-button>
        </div>
        <template v-else-if="!loading">
            <el-collapse v-if="compact" v-model="activeRegion" accordion>
                <el-collapse-item v-for="region in regionGroups" :key="region.name" :name="region.name" >
                    <template #title><span class="u-region-name">{{ region.name }}</span><span class="u-region-count">{{ region.servers.length }}</span></template>
                    <div v-for="server in region.servers" :key="server.id" class="m-directory-server">
                        <span class="u-server">{{ server.server || server.zone }}</span>
                        <div class="m-directory-numbers">
                            <button v-for="number in server.numbers" :key="number" type="button" :title="$t('ui.achievement.groupCopy')" :aria-label="$t('ui.achievement.groupCopy') + ' ' + number" @click="copy(number)">{{ number }}</button>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <template v-else>
            <section v-for="region in filteredRegions" :key="region.name" class="m-directory-region">
                <h2><span>{{ region.name }}</span><span class="u-region-count">{{ region.servers.length }}</span></h2>
                <div class="m-directory-cards">
                    <section v-for="server in region.servers" :key="server.id" class="m-directory-card">
                        <h3>{{ server.server || server.zone }}</h3>
                        <div class="m-directory-numbers">
                            <button v-for="number in server.numbers" :key="number" type="button" :title="$t('ui.achievement.groupCopy')" :aria-label="$t('ui.achievement.groupCopy') + ' ' + number" @click="copy(number)">
                                <span>{{ number }}</span><el-icon><CopyDocument /></el-icon>
                            </button>
                        </div>
                    </section>
                </div>
            </section>
            </template>
            <el-empty v-if="!regionGroups.length" :description="$t('ui.achievement.groupsEmpty')" />
            <el-empty v-else-if="!compact && !filteredRegions.length" :description="$t('ui.achievement.groupNoMatch')" />
        </template>
    </div>
</template>

<script>
import { Search, CopyDocument } from "@element-plus/icons-vue";
import { getMenuGroup } from "@/service/group";

export default {
    name: "GroupDirectory",
    components: { Search, CopyDocument },
    props: { compact: { type: Boolean, default: false } },
    data() {
        return { groups: [], loading: false, failed: false, activeRegion: "", keyword: "", selectedRegion: "" };
    },
    computed: {
        filteredRegions() {
            const keyword = this.keyword.trim().toLocaleLowerCase();
            return this.regionGroups
                .filter((region) => !this.selectedRegion || region.name === this.selectedRegion)
                .map((region) => ({
                    ...region,
                    servers: region.servers.filter((server) =>
                        [server.zone, server.server, ...server.numbers].some((value) => value.toLocaleLowerCase().includes(keyword))
                    ),
                }))
                .filter((region) => region.servers.length);
        },
        regionGroups() {
            const regions = new Map();
            this.groups.forEach((group) => {
                if (!regions.has(group.zone)) regions.set(group.zone, { name: group.zone, servers: [] });
                regions.get(group.zone).servers.push(group);
            });
            return [...regions.values()];
        },
    },
    methods: {
        async loadGroups() {
            this.loading = true;
            this.failed = false;
            try {
                const res = await getMenuGroup("wiki_cj_group");
                this.groups = (res.data?.data?.menus || [])
                    .map((item, index) => {
                        const [zone, server = ""] = (item.label || "").split("/");
                        return {
                            id: item.id || index,
                            zone: zone.trim(),
                            server: server.trim(),
                            numbers: [
                                ...new Set(
                                    (item.link || "")
                                        .split("/")
                                        .map((value) => value.trim())
                                        .filter(Boolean)
                                ),
                            ],
                        };
                    })
                    .filter((group) => group.zone && group.numbers.length);
            } catch {
                this.failed = true;
            } finally {
                this.loading = false;
            }
        },
        async copy(number) {
            try {
                await navigator.clipboard.writeText(number);
                this.$notify({ title: this.$t("ui.common.status.copySuccess"), message: number, type: "success" });
            } catch {
                this.$notify({ title: this.$t("ui.common.status.browserUnsupported"), type: "error" });
            }
        },
    },
    mounted() {
        this.loadGroups();
    },
};
</script>

<style lang="less" scoped>
.m-group-directory { min-height: 180px; }
.m-directory-toolbar {
    padding: 16px;
    margin-bottom: 24px;
    border: 1px solid #eceef4;
    border-radius: 12px;
    background: #fafbfc;
    .el-input { max-width: 420px; }
    :deep(.el-input__wrapper) { min-height: 36px; border-radius: 8px; }
}
.m-directory-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 30px;
        padding: 4px 12px;
        border: 1px solid transparent;
        border-radius: 7px;
        background: transparent;
        color: #767e8d;
        font: inherit;
        font-size: 12px;
        cursor: pointer;
        &.is-active { background: #eee9fc; color: @v4primary; border-color: #e2daf9; }
        &:hover { color: @v4primary; }
        span { font-size: 11px; opacity: 0.7; }
    }
}
.m-directory-region {
    margin-bottom: 24px;
    h2 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 12px;
        font-size: 14px;
        font-weight: 600;
        color: #4b5362;
    }
}
.u-region-count {
    padding: 1px 7px;
    border-radius: 5px;
    background: #f0f1f6;
    color: #9299a6;
    font-size: 11px;
    font-weight: 400;
    line-height: 20px;
    font-variant-numeric: tabular-nums;
}
.m-directory-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
    gap: 12px;
}
.m-directory-card {
    min-width: 0;
    padding: 16px;
    border: 1px solid #e9ecf2;
    border-radius: 10px;
    background: #fff;
    transition: border-color 0.18s, box-shadow 0.18s;
    &:hover { border-color: #d9d0f0; box-shadow: 0 3px 12px #55409908; }
    h3 { margin: 0 0 12px; color: #555d6b; font-size: 13px; font-weight: 500; overflow-wrap: anywhere; }
}
.m-directory-numbers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        padding: 5px 10px;
        min-height: 30px;
        border-radius: 6px;
        background: #f6f3fd;
        color: #7b65bc;
        border: 1px solid #ece6f9;
        cursor: pointer;
        font: inherit;
        font-size: 12px;
        font-variant-numeric: tabular-nums;
        overflow-wrap: anywhere;
        span { min-width: 0; }
        .el-icon { flex-shrink: 0; opacity: 0.65; }
        &:hover { background: #eee8fb; border-color: #cfc1f0; color: @v4primary; }
    }
}
button:focus-visible { outline: 2px solid #aa98e0; outline-offset: 2px; }
.m-group-directory.is-compact {
    min-height: 60px;
    margin-top: 12px;
    :deep(.el-collapse) { border: 0; }
    :deep(.el-collapse-item__header) {
        gap: 8px;
        height: auto;
        min-height: 40px;
        padding: 0 10px;
        margin-bottom: 4px;
        border: 0;
        border-radius: 7px;
        background: #f7f8fa;
        font-size: 12px;
        font-weight: 500;
        color: #687181;
    }
    :deep(.el-collapse-item__header.is-active) { color: @v4primary; background: #f3effb; }
    :deep(.el-collapse-item__wrap) { border: 0; }
    :deep(.el-collapse-item__content) { padding: 4px 2px 10px; }
    .u-region-name { min-width: 0; text-align: left; line-height: 20px; overflow-wrap: anywhere; }
    .m-directory-server { padding: 8px; border-bottom: 1px solid #f0f1f5; }
    .m-directory-server:last-child { border-bottom: 0; }
    .u-server { display: block; margin-bottom: 6px; font-size: 12px; color: #858d9a; overflow-wrap: anywhere; }
    .m-directory-numbers { min-width: 0; gap: 5px; button { padding: 3px 7px; min-height: 24px; } }
}
@media (max-width: @phone) {
    .m-directory-toolbar { padding: 12px; }
    .m-directory-cards { grid-template-columns: 1fr; }
}
</style>
