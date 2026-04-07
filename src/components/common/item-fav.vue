<template>
    <el-button class="w-fav" size="small" type="primary" @click="doFav">
        <LegacyIcon :class="favorite ? 'el-icon-star-on' : 'el-icon-star-off'" />
        <span>{{ favorite ? "取消收藏" : "收藏" }}</span>
    </el-button>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { hasFav, addFav, delFav } from "@jx3box/jx3box-ui/service/fav";
export default {
    name: "Fav",
    props: ["postType", "postId", "postTitle"],
    data: function () {
        return {
            login: User.isLogin(),
            favorite: false,
        };
    },
    computed: {
        favList() {
            return this.$store.state.myFavorites;
        },
        favChangeFlag() {
            return this.$store.state.favChangeFlag;
        },
    },
    methods: {
        doFav: function () {
            if (this.login) {
                this.favorite ? this.delFav() : this.addFav();
            } else {
                User.toLogin();
            }
        },
        hasFav: function () {
            hasFav(this.postType, this.postId).then((res) => {
                this.favorite = res.id || false;
            });
        },
        addFav: function () {
            addFav(this.postType, this.postId, this.postTitle).then((res) => {
                this.favChange();
                this.favorite = res.id;
            });
        },
        delFav: function () {
            delFav(this.favorite).then(() => {
                this.favChange();
                this.favorite = false;
            });
        },
        favChange() {
            const val = this.favChangeFlag + 1;
            this.$store.commit("SET_STATE", {
                key: "favChangeFlag",
                value: val,
            });
        },
        fail: function (err) {
            if (err.response && err.response.data && err.response.data.code) {
                this.$message.error(`[${err.response.data.code}] ${err.response.data.msg}`);
            } else {
                this.$message.error(typeof err === "string" ? err : "网络请求异常");
            }
            console.log(err);
        },
    },
    watch: {
        postId: {
            immediate: true,
            handler() {
                if (this.login && this.postType && this.postId) this.hasFav();
            },
        },
        favList: {
            deep: true,
            handler(list) {
                if (!list.find((item) => item.id === this.postId)) {
                    this.favorite = false;
                }
            },
        },
    },
};
</script>

<style lang="less">
    .w-fav{
        .legacy-icon{
            margin-right: 4px;
        }
    }
</style>
