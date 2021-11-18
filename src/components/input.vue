<template>
	<div class="l-input" :class="labelPosition === 'top' ? 'flex' : ''">
		<span v-show="label" class="label" :class="labelPosition === 'left' ? 'label-left' : ''" :style="{'width': labelWidth ? labelWidth : '80px'}">{{label}}</span>
		<div class="ipt-wrap">
            <input type="text" v-model="ipt" :placeholder="placeholder" @input="handleInput($event.target.value)" class="ipt" />
            <i class="iconfont icon-closeCard" v-show="ipt.length > 0 && clearable !== false" @click="handleClear"></i>
        </div>
	</div>
</template>

<script>
export default {
    data() {
        return {
            ipt: ''
        }
    },
    props: {
        label: {
            type: String
        },
        labelWidth: {
            type: String
        },
        placeholder: {
            type: String
        },
        clearable: {
            type: String || Boolean
        },
        labelPosition: {
            type: String
        }
    },
    methods: {
        handleInput(e) {
            this.$emit('input', e);
        },
        handleClear() {
            this.ipt = ''
            this.handleInput('')
        }
    },
    mounted() {
        
    }
};
</script>

<style lang="less" scoped>
.l-input{
    display: flex;
    align-items: center;
    width: 100%;

    .label{
        margin-right: 20px;
        text-align: right;
    }

    .label-left{
        text-align: left;
    }

    .ipt-wrap{
        position: relative;
        width: 100%;
        
        .ipt{
            padding: 10px;
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 6px;

            &:focus{
                border: 1px solid #409eff;
            }
        }

        .icon-closeCard{
            display: none;
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
        }

        &:hover .icon-closeCard{
            display: block;
        }
    }
}

.flex{
    flex-direction: column;
    align-items: start;

    .label{
        margin-bottom: 10px;
        text-align: left;
    }
}
</style>