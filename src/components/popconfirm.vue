<template>
    <div class="popconfirm-container" ref="popconfirm">
        <div @click="toggleShow"><slot name="reference" ref="reference"></slot></div>
        <transition name="fade">
            <div v-if="show" class="pop-wrap" ref="popWrap" :class="position">
                <div class="title"><i class="iconfont icon-isConfirm"></i> {{ title }}</div>
                <div class="operation">
                    <l-botton
                        class="l-btn"
                        type="info"
                        size="mini"
                        @click="handelCancle"
                    >
                        取消
                    </l-botton>
                    <l-botton
                        class="l-btn"
                        type="primary"
                        size="mini"
                        @click="handelConfirm"
                    >
                        确认
                    </l-botton>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import LBotton from "@/components/botton.vue";

export default {
    data() {
        return {
            show: false,
            position: 'center',
        }
    },
    props: {
        title: {
            type: String
        }
    },
    components: {
        LBotton
    },
    methods: {
        toggleShow() {
            this.show = true;
            this.$nextTick(() => {
                this.changePosition();
            })
        },
        handelCancle() {
            this.show = false;
            this.$emit('cancle');
        },
        handelConfirm() {
            this.show = false;
            this.$emit('confirm');
        },
        changePosition() {
            if(!this.show) return;
            let w = this.$refs.popWrap.offsetWidth - this.$refs.popconfirm.offsetWidth;
            if(this.$refs.popconfirm.offsetLeft < w) {
                    this.position = 'left'
            }else if((document.querySelector('body').offsetWidth - this.$refs.popconfirm.offsetLeft - this.$refs.popconfirm.offsetWidth) < w) {
                    this.position = 'right'
            }else {
                    this.position = 'center'
            };
        }
    },
    mounted() {
        this.changePosition();
        window.addEventListener('resize', this.changePosition);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.changePosition);
    }
}
</script>

<style lang="less" scoped>
.popconfirm-container{
    display: inline-block;
    position: relative;
    z-index: 9999;

    .pop-wrap{
        position: absolute;
        top: calc(~"100% + 15px");
        left: 0;
        padding: 20px 15px 15px;
        min-width: 220px;
        border-radius: 6px;
        background-color: #fff;
        box-shadow: 0px 0px 5px #ccc;

        .title{
            .icon-isConfirm{
                line-height: 16px;
                color: #ff9900;
            }
        }

        .operation{
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
            
            .l-btn{
                margin-left: 10px;
                width: 50px;
            }
        }

        &::before{
            display: block;
            position: absolute;
            top: -5px;
            left: 20px;
            transform: rotateZ(45deg);
            width: 6px;
            height: 6px;
            border-top: 1px solid #ddd;
            border-left: 1px solid #ddd;
            background-color: #fff;
            content: '';
        }
    }

    .center{
        left: 50%;
        transform: translateX(-50%);

        &::before{
            left: 50%;
            transform: translateX(-50%) rotateZ(45deg);
        }
    }

    .right{
        transform: translateX(-70%);

        &::before{
            left: calc(~"100% - 30px");
            transform: rotateZ(45deg);
        }
    }

    .left{
        left: 0;

        &::before{
            left: 20px;
            transform: rotateZ(45deg);
        }
    }
}

.fade-leave-active,
.fade-enter-active {
	transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>