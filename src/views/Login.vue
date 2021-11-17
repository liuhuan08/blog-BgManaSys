<template>
    <div class="login-page">
        <div class="modal">
            <div class="title">blog后台系统登录</div>
            <p class="item">
                <i class="iconfont icon-account"></i>
                <input v-model="account.text" @keyup="toggleShow(account)" @mouseenter="toggleShow(account)" @mouseleave="account.isClear = false" @blur="validate(account)" type="text" :class="account.validate ? '' : 'err'">
                <i v-if="account.isClear" @click="handleClear(account)" @mouseenter="toggleShow(account)" class="iconfont icon-closeCard"></i>
                <transition name="fade">
                    <span v-if="account.validate ? '' : 'err'" class="msg">*长度在 2 到 12 字符*</span>
                </transition>
            </p>
            <p class="item">
                <i class="iconfont icon-psd"></i>
                <input v-model="psd.text" @keyup="toggleShow(psd)" @mouseenter="toggleShow(psd)" @mouseleave="psd.isClear = false" @blur="validate(psd)" :type="psd.isClose ? 'password' : 'text'" :class="psd.validate ? '' : 'err'">
                <i v-if="!psd.isClose && psd.isClear" @click="psd.isClose = !psd.isClose" class="iconfont icon-eye-open"></i>
                <i v-if="psd.isClose && psd.isClear" @click="psd.isClose = !psd.isClose" class="iconfont icon-eye-close"></i>
                <i v-if="psd.isClear" @click="handleClear(psd)" @mouseenter="toggleShow(psd)" class="iconfont icon-closeCard"></i>
                <transition name="fade">
                    <span v-if="psd.validate ? '' : 'err'" class="msg">*长度在 2 到 12 字符*</span>
                </transition>
            </p>
            <button @click="handleLogin" class="btn">登录</button>
        </div>
    </div>
</template>

<script>
import Msg from "../utils/msg";
import { Login } from "../api/Login";
import local from "../utils/local"

    export default {
        data() {
            return {
                account: {
                    type: 'account',
                    text: '',
                    isClear: false,
                    validate: true
                },
                psd: {
                    type: 'psd',
                    text: '',
                    isClose: true,
                    isClear: false,
                    validate: true
                },
            }
        },
        methods: {
            // 控制清空按钮显示隐藏
            toggleShow(val) {
                if(val.text.toString().length > 0) {
                    val.isClear = true;
                }else {
                    val.isClear = false;
                };
            },
            // 清空
            handleClear(val) {
                val.text = '';
                val.isClear = false;
                this.validate(val);
            },
            // 前端验证
            validate(val) {
                if(val.type === 'account') {
                    let res;
                    val.text.toString().length > 1 && val.text.toString().length < 13 ? res = true : res = false;
                    this.account.validate = res;
                }else {
                    let res;
                    val.text.toString().length > 1 && val.text.toString().length < 13 ? res = true : res = false;
                    this.psd.validate = res;
                };
            },
            // 登录
            handleLogin() {
                this.validate(this.account);
                this.validate(this.psd);
                if(this.account.validate && this.psd.validate) {
                    Login({name: this.account.text, pwd: this.psd.text}).then(res => {
                        if(res.status === 200) {
                            let data = res.data.data;
                            local.set("blog_t&k", data.token);
                            local.set("blog_userinfo", {
                                bloggerId: data.id,
                                name: data.name,
                                avatar: data.avatar,
                                conciseDesc: data.conciseDesc,
                                detailDesc: data.detailDesc,
                                createTime: data.createTime
                            })

                            Msg('登录成功 ~', 'success', 2000);
                            setTimeout(() => {
                                this.$router.push({path:'/'})
                            }, 1000);
                        }
                    })

                };
            }
        },
        mounted() {
            // 回车登录
            window.addEventListener('keyup', (e) => {
                if(e.key === 'Enter') {
                    this.handleLogin();
                };
            });
        }
    }
</script>

<style lang="less" scoped>
.login-page{
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #999;

    .modal{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 300px;
        color: #fff;

        .title{
            font-size: 20px;
            line-height: 30px;
        }

        .item{
            position: relative;
            margin-top: 20px;

            input{
                width: 400px;
                height: 40px;
                text-indent: 30px;
                border-radius: 5px;
                color: #333;
                border: 1px solid #eee;
                box-shadow: 0px 0px 1px #eee;

                &:focus{
                    border: 1px solid #409eff;
                    box-shadow: 0px 0px 1px #409eff;
                }
            }

            .err{
                border: 1px solid #f56c6c;
            }

            .iconfont{
                color: #666;
            }

            .icon-account, .icon-psd{
                position: absolute;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
            }

            .icon-eye-open, .icon-eye-close{
                position: absolute;
                top: 50%;
                right: 30px;
                transform: translateY(-50%);
                cursor: pointer;
            }

            .icon-closeCard{
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                cursor: pointer;
            }

            .msg{
                position: absolute;
                bottom: -14px;
                left: 0;
                font-size: 12px;
                line-height: 12px;
                color: #f34134;
            }
        }

        .btn{
            margin-top: 20px;
            width: 400px;
            height: 40px;
            border-radius: 5px;
            border: 1px solid #409eff;
            background-color: #409eff;
            box-shadow: 0px 0px 1px #409eff;

            &:hover{
                border: 1px solid #66b1ff;
                background-color: #66b1ff;
                box-shadow: 0px 0px 1px #66b1ff;
            }
        }
    }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>