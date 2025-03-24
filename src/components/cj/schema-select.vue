<!-- 用于将成就添加进渡劫方案的时候可以选择目标方案 -->
<template>
    <el-dialog :visible="visible" class="m-schema-select" title="添加至方案" append-to-body :before-close="onFinish">
        <el-table size="mini" :data="schemas" style="width: 100%">
            <el-table-column prop="title" label="方案名称"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button
                        v-if="!row.schema.includes(achievement_id)"
                        type="primary"
                        size="mini"
                        @click="addToSchema(row)"
                        :loading="loading"
                        >添加</el-button
                    >
                    <el-button v-else type="info" size="mini" @click="removeFromSchema(row)" :loading="loading">
                        移出
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <el-button size="mini" type="primary" @click="onFinish">完成</el-button>
        </template>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getWikiAchievementLeapSchemaList, updateWikiAchievementLeapSchema } from "@/service/wiki";

export default {
    name: "SchemaSelect",
    data: () => ({
        visible: false,
        schemas: [],
        loading: false,

        achievement_id: 0,
    }),
    methods: {
        open(achievement_id) {
            this.visible = true;
            this.achievement_id = achievement_id;
        },
        addToSchema(row) {
            const schema_id = row.id;
            const achievement_id = this.achievement_id;
            const schema = [...row.schema, achievement_id];
            this.loading = true;
            updateWikiAchievementLeapSchema(schema_id, { schema })
                .then((res) => {
                    const newSchema = res.data.data;
                    this.$message.success("添加成功");
                    this.schemas = this.schemas.map((item) => {
                        if (item.id === schema_id) {
                            return newSchema;
                        }
                        return item;
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        removeFromSchema(row) {
            const schema_id = row.id;
            const achievement_id = this.achievement_id;
            const schema = row.schema.filter((id) => id !== achievement_id);
            this.loading = true;
            updateWikiAchievementLeapSchema(schema_id, { schema })
                .then((res) => {
                    const newSchema = res.data.data;
                    this.$message.success("移出成功");
                    this.schemas = this.schemas.map((item) => {
                        if (item.id === schema_id) {
                            return newSchema;
                        }
                        return item;
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onFinish() {
            this.visible = false;
        },
    },
    mounted() {
        if (User.isLogin()) {
            getWikiAchievementLeapSchemaList({
                is_official: 0,
                _no_page: 1,
            }).then((res) => {
                this.schemas = res.data.data;
            });
        }
    },
};
</script>

<style lang="less">
.m-schema-select {
    .el-dialog__body {
        padding: 10px;
    }
}
</style>
