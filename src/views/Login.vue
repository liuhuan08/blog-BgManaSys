<template>
    <div class="login-page" :style="`background-image: url(${bg_url});`">
        <div class="modal">
            <div class="title">blog后台系统登录</div>
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px">
                <el-form-item label="" prop="name">
                    <el-input v-model="loginForm.name" clearable>
                        <i slot="prefix" class="iconfont icon-account"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="pwd">
                    <el-input v-model="loginForm.pwd" clearable show-password>
                        <i slot="prefix" class="iconfont icon-psd"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <button @click="handleLogin" class="btn">登录</button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import { Login } from "../api/Login";

export default {
    data() {
        return {
            loginForm: {
                name: '',
                pwd: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ],
                pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ]
            },
            bgList: [
                'http://blogqn.excellentlld.com/blog/bgImages/b8369206-0eb9-4db1-81e4-9cdd89a75ee1.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/fa7d19f0-0044-42bf-984b-c49a88de628a.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/2eb87a99-7844-470b-9564-f376ea21d99a.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/72f7c73a-a9fc-4b58-834e-b67e3c02e510.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/2781c805-fd29-4d03-8442-322c5a4f03a8.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/e2f35b6c-c2e0-460b-bea9-95b48371241b.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/878e0d4c-12ea-44fe-984c-867c8bd7b348.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/8cd40b03-f69f-4496-84e8-15033dd34a71.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/39cfd133-9042-4a07-9ba9-fc6f635a11c7.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/ce9dd49c-8eec-4b98-8774-e956619e15f8.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/5b91b19c-4921-437e-b884-6db03235e745.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/1861eda5-5fb0-43f6-afb0-829378ed28c9.jpg',
                'http://blogqn.excellentlld.com/blog/bgImages/0fa6a0a4-3aff-44e7-9401-0fcbacb13e94.jpg'
            ],
            bg_url: ''
        }
    },
    methods: {
        setBgIamge() {
            const num = Math.floor(Math.random() * (13 - 1 + 1) + 1);
            this.bg_url = this.bgList[num - 1]
        },
        // 登录
        handleLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    Login(this.loginForm).then(res => {
                        if(res.status === 200) {
                            let data = res.data.data;
                            Cookies.set('blog_t&k', data.token)
                            let info = {
                                bloggerId: data.id,
                                name: data.name,
                                avatar: data.avatar,
                                conciseDesc: data.conciseDesc,
                                detailDesc: data.detailDesc,
                                createTime: data.createTime
                            }
                            this.$store.dispatch('set_userinfo', info)
                            this.$modal.msgSuccess('登录成功 ~');
                            this.$router.push({path:'/'})
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    created() {
        this.setBgIamge()
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
    background-repeat: no-repeat;
    background-size: cover;

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
            margin-bottom: 20px;
            font-size: 20px;
            line-height: 30px;
        }

        .iconfont{
            color: #666;
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
.fade-enter {
    transform: translateX(20px);
    opacity: 0;
}
.fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}
</style>