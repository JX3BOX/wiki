<template>
    <div class="m-knowledge-panel m-knowledge-home-section">
        <div class="m-title">
            <span class="u-text"
                ><LegacyIcon class="el-icon-orange" /><span> {{ $t("ui.knowledge.guide") }}</span></span
            >
            <router-link class="u-wiki-more" :to="{ name: 'normal', params: { type_slug: 'game' } }">{{ $t("ui.common.actions.more") }}</router-link>
        </div>
        <div class="m-guide m-panel">
            <div v-for="(item, index) in data" :key="index" class="u-guide">
                <div class="u-title">{{ item.label }}</div>
                <div class="u-list">
                    <a
                        class="u-label"
                        v-for="(menu, key) in item.menus"
                        :key="key"
                        :href="menu.link"
                        v-html="menu.label"
                    ></a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getMenuGroups } from "@/service/knowledge.js";
export default {
    name: "Guide",
    data: function () {
        return {
            data: "",
        };
    },
    computed: {},
    watch: {},
    methods: {
        // 获取玩法指南
        getGuideData() {
            getMenuGroups({ key: ["guide-pve", "guide-pvx", "guide-pvp"].join(",") }).then((res) => {
                this.data = res.reduce((acc, cur) => {
                    acc[cur.name] = cur;
                    return acc;
                }, {});
            });
        },
    },
    created: function () {
        this.getGuideData();
    },
};
</script>

<style scoped lang="less">
.m-guide {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    .u-guide {
        min-width: 0;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
    }

    .u-title {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: #f7f8fa;
        border-bottom: 1px solid #e9ebef;
        color: #454b57;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;

        &::before {
            content: "";
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #a6acb5;
        }
    }

    .u-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 2px 4px;
        padding: 8px;
    }

    .u-label {
        min-width: 0;
        padding: 4px 8px;
        border-radius: 5px;
        color: #596170;
        font-size: 13px;
        line-height: 20px;
        overflow-wrap: anywhere;
        transition: color 0.16s, background-color 0.16s;

        &:hover {
            color: @v4primary;
            background: #f5f3ff;
            text-decoration: none;
        }

        &:focus-visible {
            outline: 2px solid #a6acb5;
            outline-offset: -2px;
        }
    }
}

@media screen and (max-width: 1280px) {
    .m-guide .u-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media screen and (max-width: @phone) {
    .m-guide {
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
    }
}
</style>
