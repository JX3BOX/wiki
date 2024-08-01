<template>
    <div class="m-items-my">
        <div class="m-items-myFav" v-if="isLogin">
            <h3 class="c-sidebar-right-title">
                <i class="u-icon u-icon-mycollection">
                    <img svg-inline src="@/assets/img/my.svg" />
                </i>
                <span>收藏物品</span>
            </h3>
            <div class="m-items-my-list">
                <div class="u-list" v-if="data && data.length">
                    <div class="u-item" v-for="(item, key) in data" :key="key">
                        <router-link :to="{ name: 'view', params: { item_id: item.id } }">
                            <ItemIcon :item="item" />
                        </router-link>
                        <img class="u-remove" src="@/assets/img/close.svg" svg-inline @click.stop="remove(item.fId)" />
                    </div>
                </div>
                <el-pagination
                    class="u-my-items__pagination"
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :total="total"
                    background
                    small
                    hide-on-single-page
                    @current-change="pageChange"
                >
                </el-pagination>
                <!-- <a class="u-more" href="/dashboard/#/fav/item" target="_blank"
                    ><i class="el-icon-arrow-left"></i> <i class="el-icon-more"></i> <i class="el-icon-arrow-right"></i
                ></a> -->
            </div>
            <div v-if="isLogin && !data.length" class="u-tip"><i class="el-icon-warning-outline"></i> 暂无收藏物品</div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import ItemIcon from "@/components/common/item-icon.vue";
import { getStatRank } from "@jx3box/jx3box-common/js/stat";
import { get_items, getMyFav, delMyFav } from "@/service/item.js";
import { get } from "lodash";
export default {
    name: "MyItems",
    components: {
        ItemIcon,
    },
    props: [],
    data: function () {
        return {
            isLogin: User.isLogin(),
            data: [],
            hotitems: [],
            pageSize: 24,
            total: 0,
            pageIndex: 1,
        };
    },
    computed: {
        favChangeFlag() {
            return this.$store.state.favChangeFlag;
        },
    },
    watch: {
        favChangeFlag() {
            this.loadMyItems();
        },
    },
    methods: {
        remove(fId) {
            delMyFav(fId).then((res) => {
                this.data = this.data.filter((item) => item.fId !== fId);
                this.$store.commit("SET_STATE", {
                    key: "myFavorites",
                    value: this.data,
                });
            });
        },
        loadItems: function (ids, limit) {
            return get_items({ ids: ids.join(","), limit: limit });
        },
        loadHotItems: function () {
            // 获取热门物品
            getStatRank("item").then((data) => {
                data = data.data;

                let ranks = [],
                    item_ids = [];
                for (let i in data) {
                    let name = get(data, `${i}.name`, "-");
                    let item_id = get(name.split("-"), 1, "");
                    if (item_id) {
                        item_ids.push(item_id);
                        ranks[item_id] = get(data, `${i}.value`, {});
                    }
                }

                this.loadItems(item_ids, this.pageSize).then((res) => {
                    this.hotitems = res.data.data.data;
                    // this.data = res.data.data.data;
                });
            });
        },
        pageChange(val) {
            this.pageIndex = val;
            this.loadMyItems();
        },
        loadMyItems: function () {
            // 我收藏的物品
            getMyFav({ post_type: "item", pageSize: this.pageSize, pageIndex: this.pageIndex }).then((res) => {
                let list = res.data.data.list;
                this.total = res.data.data.page.total;
                let ids = [];
                if (list) {
                    list.forEach((item) => {
                        ids.push(item.post_id);
                    });
                }

                this.loadItems(ids, this.pageSize).then((res) => {
                    this.data = res.data.data.data.map((item) => {
                        return {
                            ...item,
                            fId: list ? list.find((k) => k.post_id === item.id)?.id : null,
                        };
                    });
                });
            });
        },
    },
    mounted: function () {
        if (this.isLogin) {
            this.loadMyItems();
        }
    },
};
</script>
