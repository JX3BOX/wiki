<template>
    <div class="m-group-directory" v-loading="loading">
        <div v-if="failed" role="alert" class="m-directory-error">
            <p>{{ $t("ui.achievement.groupsError") }}</p>
            <el-button @click="loadGroups">{{ $t("ui.achievement.groupsRetry") }}</el-button>
        </div>
        <template v-else-if="!loading">
            <section v-for="region in regionGroups" :key="region.name" class="m-directory-region">
                <h2>{{ region.name }}</h2>
                <div class="m-directory-cards">
                    <section v-for="server in region.servers" :key="server.id" class="m-directory-card">
                        <h3>{{ server.server || server.zone }}</h3>
                        <div class="m-directory-numbers">
                            <button v-for="number in server.numbers" :key="number" type="button" @click="copy(number)">
                                {{ number }}
                            </button>
                        </div>
                    </section>
                </div>
            </section>
            <el-empty v-if="!regionGroups.length" :description="$t('ui.achievement.groupsEmpty')" />
        </template>
    </div>
</template>

<script>
import { getMenuGroup } from "@/service/group";

export default {
    name: "GroupDirectory",
    data() {
        return { groups: [], loading: false, failed: false };
    },
    computed: {
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
.m-group-directory {
    min-height: 180px;
}
.m-directory-region {
    margin-bottom: 16px;
    h2 {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 10px;
    }
}
.m-directory-cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
}
.m-directory-card {
    padding: 12px 15px;
    border: 1px solid #d7dae1;
    border-radius: 5px;
    background: #f5f7fa;
    h3 {
        margin: 0 0 10px;
        color: #3d454d;
        font-size: 14px;
        font-weight: 500;
    }
}
.m-directory-numbers {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    button {
        padding: 4px 10px;
        min-height: 28px;
        border-radius: 4px;
        background: mix(@v4primary, #fff, 8%);
        color: @v4primary;
        border: 1px solid mix(@v4primary, #fff, 40%);
        cursor: pointer;
        font: inherit;
        font-size: 12px;
        overflow-wrap: anywhere;
        &:hover {
            background: mix(@v4primary, #fff, 14%);
            border-color: @v4primary;
        }
        &:focus-visible {
            outline: 2px solid @v4primary;
            outline-offset: 3px;
        }
    }
}
@media (max-width: 1100px) {
    .m-directory-cards {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
@media (max-width: @phone) {
    .m-directory-cards {
        grid-template-columns: 1fr;
    }
}
</style>
