<!--
 * @Author: iRuxu
 * @Date: 2022-07-09 19:40:42
 * @LastEditTime: 2022-07-12 14:57:34
 * @Description:
-->
<template>
    <div class="u-chain">
        <div class="list" v-if="showCurrent">
            <div class="u-chain-name" v-for="(item, i) in display_data.current" :key="item.id">
                <span v-if="item.logic !== undefined">
                    <span :class="{ all: item.logic, one: !item.logic }" v-for="b in item.quests" :key="b.id">
                        「<router-link
                            class="u-chain-link"
                            :class="{ current: current == b.id }"
                            :to="{ name: 'view', params: { quest_id: b.id } }"
                            >{{ b.name }}</router-link
                        >」
                    </span>
                </span>
                <span v-else>
                    「<router-link
                        class="u-chain-link"
                        :class="{ current: current == item.id }"
                        :to="{ name: 'view', params: { quest_id: item.id } }"
                        >{{ item.name }}</router-link
                    >」
                </span>
                <span v-if="i != display_data.current.length - 1"> &gt; </span>
            </div>
        </div>
        <div class="branch" v-if="showBranch">
            <div class="u-more-branch">任务分支</div>
            <span class="u-chain-name" v-for="item in display_data.branch" :key="item.id">
                「<router-link class="u-chain-link" :to="{ name: 'view', params: { quest_id: item.id } }">{{
                    item.name
                }}</router-link
                >」
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuestChain",
    props: {
        data: {
            type: Object,
        },
        current: {
            type: Number,
        },
    },
    computed: {
        display_data() {
            let current = this.data.current;
            if (current?.[0]?.id?.startsWith("b_")) {
                current[0].quests = current[0].quests.filter((item) => item.visible);
                if (current[0].quests.length == 1) {
                    current[0] = current[0].quests[0];
                }
            }
            current = current.filter((item) => item.hasOwnProperty("logic") || item.visible);
            let branch = this.data.branch.filter((item) => item.visible);
            if (branch && branch.length == 1) {
                current.push(...branch);
                branch = [];
            }
            return {
                current,
                branch,
            };
        },
        showBranch() {
            return this.display_data.branch.length > 0;
        },
        showCurrent() {
            return this.display_data.current.length > 1;
        },
    },
};
</script>

<style lang="less" scoped>
.u-chain {
    .lh(1.5);
    color: var(--black-80, rgba(28, 28, 28, 0.8));
    .fz(14px);
}

.u-chain-name {
    display: inline-block;

    & .u-chain-link.current {
        color: var(--primary-brand-2, #fedaa3);

        .bold;
    }

    & .u-chain-link:not(.current) {
        color: var(--black-80, rgba(28, 28, 28, 0.8));
    }

    i {
        .fz(12px);
    }
}

.branch > .u-chain-name:not(:last-of-type)::after {
    content: "|";
}

.u-chain-name .all:not(:last-of-type)::after {
    content: "&";
}

.u-chain-name .one:not(:last-of-type)::after {
    content: "|";
}

.u-more-branch {
    .mt(16px);
    
    flex-shrink: 0;
    color: var(--black-80, rgba(28, 28, 28, 0.8));

    /* 16 Bold */
    font-size: 16px;
    font-weight: 700;
    line-height: 24px; /* 150% */
}
</style>
