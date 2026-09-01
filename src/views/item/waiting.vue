<template>
    <div class="m-waiting-view m-waiting-view--item">
        <el-alert
            v-if="old"
            :title="$t('ui.item.oldGuides')"
            type="success"
        ></el-alert>
        <Items :items="items"></Items>
        <el-pagination
            background
            :total="total"
            hide-on-single-page
            layout="prev, pager, next, jumper"
            :page-size="15"
            @current-change="getData"
            style="text-align: center"
        ></el-pagination>
    </div>
</template>

<script>
import Items from "@/components/item/items.vue";

import { get_waiting } from "@/service/item";

export default {
    name: "Waiting",
    props: [],
    data: function () {
        return {
            items: null,
            total: 0,
            old: false,
        };
    },
    computed: {
        client: function () {
            return this.$store.state.client;
        },
    },
    methods: {
        async getData(page = 1) {
            let params = {
                page,
                client: this.client,
                per: 15,
                type: 'item'
            };
            let res = (await get_waiting(params)).data;
            this.total = res.data.total;
            this.old = res.data.old;
            this.items = res.data.list;
        },
    },
    components: {
        Items,
    },
    mounted() {
        this.getData();
    },
};
</script>
