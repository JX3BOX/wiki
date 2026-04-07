<template>
    <div class="v-plan-view" v-loading="loading">
        <!-- 返回 & 收藏 -->
        <!-- <div class="m-plan-navigation">
			<el-button class="u-goback" size="medium" icon="ArrowLeft" @click="goBack" plain>返回列表</el-button>
		</div> -->
        <!-- 内容展示 -->
        <div class="m-plan-content" :wiki-post="plan" :showQR="false">
            <!-- 头部标题 -->
            <div class="m-plan-head">
                <span class="u-title">
                    {{ plan.title }}
                    <span class="u-time"><LegacyIcon class="el-icon-time" />{{ date_format(plan.updated) }}</span>
                </span>
                <!-- 编辑 & 删除 & 收藏 -->
                <div class="m-plan-actions">
                    <template v-if="isAuthor || isEditor">
                        <el-button type="primary" size="small" plain @click="editPlan(plan.id)">
                            <LegacyIcon class="el-icon-edit" />
                            <span>编辑</span>
                        </el-button>
                        <el-button type="info" size="small" plain @click="deletePlan(plan.id)">
                            <LegacyIcon class="el-icon-delete" />
                            <span>删除</span>
                        </el-button>
                    </template>
                    <!-- <Fav post-type="item_plan" :post-id="plan.id" :post-title="plan && plan.title" /> -->
                </div>
            </div>
            <!-- 详细内容 -->
            <div class="m-plan-body">
                <!-- 内容备注 -->
                <div class="m-plan-desc">
                    <div class="u-desc">{{ plan.description || "-" }}</div>
                    <!-- <span class="u-user">
                        <img
                            class="u-avatar"
                            :src="showAvatar(getUserInfo(plan, 'user_avatar')) || default_avatar"
                            :alt="getUserInfo(plan, 'display_name')"
                        />
                        <a class="u-name" :href="authorLink(plan.user_id)">{{
                            getUserInfo(plan, "display_name") || "匿名"
                        }}</a>
                        <span class="u-time"
                            >最后更新于 <LegacyIcon class="el-icon-time" />{{ date_format(plan.updated) }}</span
                        >
                    </span> -->
                </div>
                <!-- 物品 -->
                <div class="m-plan-item" v-if="plan.type == '1'">
                    <div v-for="(item, index) in plan.relation" :key="index">
                        <div class="m-border" v-if="item.data && item.data.length">
                            <div class="u-title" v-if="item.title">{{ item.title }}</div>
                            <div class="u-content">
                                <router-link
                                    class="u-item"
                                    v-for="(el, key) in item.data"
                                    :key="key"
                                    :to="{ name: 'view', params: { item_id: el.id } }"
                                >
                                    <span class="u-img">
                                        <ItemIcon :item="el" :size="48" />
                                        <span class="u-count">{{ el.count }}</span>
                                    </span>
                                    <span class="u-name" :class="`quality-${el.Quality}`"> {{ el.Name }}</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 装备 -->
                <div class="m-border m-plan-equips" v-else-if="plan.type == '2'">
                    <Equip :data="plan" />
                    <div class="u-content">
                        <div class="u-list" v-for="(list, index) in equipList" :key="index">
                            <div class="u-item" v-for="(item, key) in list" :key="key">
                                <span class="u-title"> {{ item.label }}</span>
                                <div v-if="item.list.length">
                                    <ItemIcon
                                        class="u-equip"
                                        v-for="(eq, i) in item.list"
                                        :key="i"
                                        :has_title="true"
                                        :item="eq"
                                    />
                                </div>
                                <div v-else class="u-equip-null">- 暂无物品 -</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getItemPlanID, delItemPlan } from "@/service/item-plan.js";
import { get_items_by_node as getItemsByNode } from "@/service/item";
import ItemIcon from "@/components/common/item-icon.vue";
import Equip from "@/components/item/equip.vue";
import WikiPanel from "@/components/common/wiki-panel.vue";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { __Links, default_avatar } from "@/utils/config";
import { showAvatar, authorLink, ts2str } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
import bus from "@/store/bus.js";

export default {
    name: "PlanDetail",
    props: [],
    components: { ItemIcon, Equip },
    data: function () {
        return {
            loading: false,

            isAuthor: false,
            plan: {},
            date_format: ts2str,
            default_avatar,
            equipList: [
                [
                    { title: "melee_weapon", label: "武器", AucGenre: 1, list: [] },
                    { title: "range_weapon", label: "暗器", AucGenre: 2, list: [] },
                ],
                [
                    { title: "helm", label: "帽子", AucGenre: 3, AucSubType: 2, list: [] },
                    { title: "chest", label: "上衣", AucGenre: 3, AucSubType: 1, list: [] },
                    { title: "waist", label: "腰带", AucGenre: 3, AucSubType: 3, list: [] },
                ],
                [
                    { title: "bangle", label: "护腕", AucGenre: 3, AucSubType: 6, list: [] },
                    { title: "pants", label: "下装", AucGenre: 3, AucSubType: 4, list: [] },
                    { title: "boots", label: "鞋子", AucGenre: 3, AucSubType: 5, list: [] },
                ],
                [
                    { title: "amulet", label: "项链", AucGenre: 4, AucSubType: 1, list: [] },
                    { title: "pendant", label: "腰坠", AucGenre: 4, AucSubType: 3, list: [] },
                    { title: "ring_1", label: "戒指", AucGenre: 4, AucSubType: 2, list: [] },
                    { title: "ring_2", label: "戒指", AucGenre: 4, AucSubType: 2, list: [] },
                ],
            ],
        };
    },
    computed: {
        plan_id() {
            return this.$route.params.plan_id;
        },
        type() {
            return 1;
        },
        isEditor() {
            return User.isEditor();
        },
    },
    watch: {
        plan_id(val) {
            val && this.getItemData();
        },
    },
    methods: {
        // 获取数据
        getItemData() {
            this.loading = true;
            getItemPlanID(this.plan_id)
                .then((res) => {
                    this.converted(res);
                    if (res.type == 2) this.toEquipList(res.relation);
                    this.isAuthorUser(res.user_id);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 判断用户权限
        isAuthorUser(user_id) {
            let _user = User.getInfo();
            if (_user.uid == user_id) this.isAuthor = true;
        },
        // 返回列表
        goBack() {
            history.length ? this.$router.go(-1) : this.$router.push({ name: "plan_list" });
        },
        // 兼容旧数据,转换数据
        converted(data) {
            if (data.type == 1) {
                data.relation = data.relation.map((item) => {
                    item.data = item.data.map((el) => {
                        if (typeof el == "string") el = { id: el, count: 1 };
                        if (typeof el == "object") el = { id: el.id, count: el.count };
                        return el;
                    });
                    return item;
                });

                // 统一获取物品信息
                let _arr = [];
                data.relation.forEach((list) => {
                    list.data.forEach((el) => {
                        _arr.push(el.id);
                    });
                });

                getItemsByNode({ ids: _arr, per: _arr.length }).then((res) => {
                    let items = res.data.list;

                    data.relation = data.relation.map((item) => {
                        item.data = item.data.map((el) => {
                            let a = items.filter((k) => {
                                if (k.id == el.id) return { ...k, ...el };
                            });
                            el = { ...el, ...a[0] };
                            return el;
                        });
                        return item;
                    });
                    this.plan = data;
                });
            } else {
                data.relation = this.equipItem(data.relation);
                let _arr = [];
                for (const key in data.relation) {
                    _arr.push(...data.relation[key]);
                }
                getItemsByNode({ ids: _arr, per: _arr.length }).then((res) => {
                    let items = res.data.list;

                    for (const key in data.relation) {
                        data.relation[key] = data.relation[key].map((el) => {
                            el = items.filter((k) => {
                                if (el == k.id) return k;
                            });
                            return el[0];
                        });
                    }
                    this.plan = data;
                    this.equipList.map((list) => {
                        list.map((item) => {
                            item.list = item.list.map((el) => {
                                el = items.filter((k) => {
                                    if (k.id == el) return k;
                                });
                                return el[0];
                            });
                            return item;
                        });
                        return list;
                    });
                });
            }
        },
        // 将装备object转换为string
        equipItem(data) {
            for (const key in data) {
                data[key] = data[key].map((item) => {
                    if (typeof item == "object") item = item.id;
                    return item;
                });
            }
            return data;
        },
        // 装备分组
        toEquipList(_obj) {
            this.equipList.map((list) => {
                list.map((el) => {
                    if (_obj.hasOwnProperty(el.title)) {
                        el.list = _obj[el.title];
                    }
                });
            });
        },
        // 装备提交数据转换
        toEquip() {
            let obj = {};
            this.equipList.forEach((list) => {
                list.forEach((el) => {
                    obj[el.title] = el.list;
                });
            });
            obj = this.equipItem(obj);
            this.plan.relation = obj;
        },
        // 编辑清单
        editPlan(plan_id) {
            this.$router.push({ name: "plan_edit", params: { plan_id } });
        },
        // 删除清单
        deletePlan(plan_id) {
            this.$confirm("确认是否删除该物品清单？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                delItemPlan(plan_id).then((res) => {
                    this.$message.success("删除成功");
                    bus.emit("plan_list_refresh");
                    this.$router.push({ name: "plan_list" });
                });
            });
        },

        iconLink,
        showAvatar,
        authorLink,
        getUserInfo: function (plan, key) {
            return plan?.user_info?.[key];
        },
    },
    created: function () {
        this.getItemData();
    },
};
</script>
<style lang="less" scoped>
@import "~@/assets/css/item/plan-detail.less";
</style>
<style lang="less">
.v-plan-view {
    .m-plan-item {
        .u-name {
            .fz(12px,2) !important;
        }
    }
    .m-item-icon {
        .u-item-icon {
            .size(48px);
            max-height: 48px;
            .z(0);
            .r(4px);
        }
        .u-border {
            .z(1);
        }
        .u-border-quest {
            .z(2);
        }
    }
}

.m-item-icon-popup {
    padding: 0;
}
</style>
