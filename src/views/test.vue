<template>
    <div>
        <pagination
            :total="80"
            :size="pageSize"
            @size-change="handelSizeChange"
            :sizeArr="[10, 20, 30, 40, 50]"
            @current-change="handelCurrentChange"
            :current-page="currentPage"
            layout="total, sizes, jumper"
        ></pagination>
    </div>
</template>

<script>
import pagination from "../components/pagination.vue"
    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1
            }
        },
        components: {
            pagination
        },
        methods: {
            handelSizeChange(val) {
                this.pageSize = val;
            },
            handelCurrentChange(val) {
                this.currentPage = val;
            }
        }
    }
</script>

<style lang="less" scoped>

</style>