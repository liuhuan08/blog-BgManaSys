<template>
    <div>
        <pagination
            :total="100"
            :size="pageSize"
            @size-change="handelSizeChange"
            :sizeArr="[10, 20, 30, 40, 50]"
        ></pagination>
    </div>
</template>

<script>
import pagination from "../components/pagination.vue"
    export default {
        data() {
            return {
                pageSize: 10
            }
        },
        components: {
            pagination
        },
        methods: {
            handelSizeChange(val) {
                this.pageSize = val;
            }
        }
    }
</script>

<style lang="less" scoped>

</style>