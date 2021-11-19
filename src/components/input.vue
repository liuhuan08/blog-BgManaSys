<template>
	<div class="l-input">
		<div class="ipt-wrap" v-if="type === 'text' || type === 'password'">
            <input :type="type" v-model="ipt" :placeholder="placeholder" @input="handleInput($event.target.value)" class="ipt" />
            <i class="iconfont icon-closeCard" v-show="ipt.length > 0 && clearable !== false" @click="handleClear"></i>
        </div>
        <div class="textarea" v-if="type === 'textarea'">
            <textarea v-model="ipt" :rows="rows ? rows : (maxlength <= 20 ? '1' : '4')" :maxlength="maxlength" :placeholder="placeholder" class="textarea-ipt" @input="handleInput($event.target.value)"></textarea>
            <div class="num">{{ipt.length}}/{{maxlength}}</div>
        </div>
	</div>
</template>

<script>
export default {
    data() {
        return {
            ipt: this.iptValue
        }
    },
    props: {
        iptValue: {
            type: String || Number
        },
        type: {
            type: String
        },
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
        maxlength: {
            type: String
        },
        rows: {
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
    width: 100%;

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

    .textarea{
        position: relative;
        width: 100%;

        .textarea-ipt{
            padding: 10px;
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 6px;
            // resize: none;
        }

        .num{
            position: absolute;
            bottom: 10px;
            right: 10px;
            color: #999;
        }
    }
}
</style>