<template>
    <div class="wrap" :class="msg.type" v-if="msg.show && show">
        <i class="iconfont icon-success"></i>
        {{msg.text}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show: true,
                timer: null
            }
        },
        props: {
            msg: {
                type: Object
            }
        },
        mounted() {
            if(this.timer) clearTimeout(this.timer);
            if(this.msg.show) {
                setTimeout(() => {
                    this.show = false;
                },this.msg.duration);
            }
        },
        beforeDestroy() {
            clearTimeout(this.timer);
        }
    }
</script>

<style lang="less" scoped>
.wrap{
    display: flex;
    align-items: center;
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    padding-left: 30px;
    width: 300px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;

    .iconfont{
        margin-right: 10px;
    }
}

.msg{
    color: #909399;
    background-color: #edf2fc;
}

.success{
    color: #67c23a;
    background-color: #f0f9eb;
}

.warning{
    color: #e6a23c;
    background-color: #fdf6ec;
}

.error{
    color: #f56c6c;
    background-color: #fef0f0;
}
</style>