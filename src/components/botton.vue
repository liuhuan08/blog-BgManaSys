<template>
	<button class="l-button" :class="type + ' ' + size">
		<span v-if="$slots.default"><slot></slot></span>
	</button>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    props: {
        type: {
            type: String,
        },
        size: {
            type: String,
        }
    }
};
</script>

<style lang="less" scoped>
.l-button{
    width: 98px;
    height: 40px;
    font-size: 14px;
    color: #666;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    border-radius: 4px;

    &:hover{
        color: #40a9ff;
        background-color: #ecf5ff;
    }
}

.primary{
    color: #fff;
    border: 1px solid #409eff;
    background-color: #409eff;

    &:hover{
        color: #fff;
        background-color: #66b1ff;
        border: 1px solid #66b1ff;
    }
}

.success{
    color: #fff;
    border: 1px solid #67c23a;
    background-color: #67c23a;

    &:hover{
        color: #fff;
        background-color: #85ce61;
        border: 1px solid #85ce61;
    }
}

.info{
    color: #fff;
    border: 1px solid #909399;
    background-color: #909399;

    &:hover{
        color: #fff;
        background-color: #a6a9ad;
        border: 1px solid #a6a9ad;
    }
}

.warning{
    color: #fff;
    border: 1px solid #e6a23c;
    background-color: #e6a23c;

    &:hover{
        color: #fff;
        background-color: #ebb563;
        border: 1px solid #ebb563;
    }
}

.danger{
    color: #fff;
    border: 1px solid #f56c6c;
    background-color: #f56c6c;

    &:hover{
        color: #fff;
        background-color: #f78989;
        border: 1px solid #f78989;
    }
}

.medium{
    height: 36px;
}

.small{
    width: 80px;
    height: 32px;
    font-size: 12px;
}

.mini{
    width: 80px;
    height: 28px;
    font-size: 12px;
}
</style>