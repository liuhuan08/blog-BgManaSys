<template>
	<div class="l-input">
		<div class="ipt-wrap" v-if="type === 'text' || type === 'password'">
            <input :type="iptType" v-model="ipt" :placeholder="placeholder" @input="handleInput($event.target.value)" class="ipt" />
            <i class="iconfont icon-closeCard" :class="type === 'password' ? 'changeposition' : ''" v-show="ipt.length > 0 && clearable !== false" @click="handleClear"></i>
            <i class="iconfont showPsd" :class="showPsd ? 'icon-eye-open' : 'icon-eye-close'" v-if="type === 'password'" @click="changeShowPsd"></i>
        </div>
        <div class="textarea" v-if="type === 'textarea'">
            <textarea v-model="ipt" :rows="rows ? rows : (maxlength <= 50 ? '1' : '4')" :class="maxlength <= 50 ? 'resize-none' : ''" :maxlength="maxlength" :placeholder="placeholder" class="textarea-ipt" @input="handleInput($event.target.value)"></textarea>
            <div class="num">{{ipt.length}}/{{maxlength}}</div>
        </div>
	</div>
</template>

<script>
export default {
    data() {
        return {
            ipt: this.iptValue,
            showPsd: false,
            iptType: ''
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
        },
        changeShowPsd() {
            this.showPsd = !this.showPsd;
            this.showPsd ? this.iptType = 'text' : this.iptType = 'password'
        }
    },
    watch: {
        iptValue(newVal) {
            this.ipt = newVal
        }
    },
    created() {
        this.iptType = this.type;
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
            cursor: pointer;
        }

        .changeposition{
            right: 30px;
        }

        &:hover .icon-closeCard{
            display: block;
        }

        .showPsd{
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            cursor: pointer;
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
        }

        .resize-none{
            padding-right: 40px;
            resize: none;
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