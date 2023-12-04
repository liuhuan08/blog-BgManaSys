<template>
  <div class="login_page">
    <div class="login_box">
      <div class="title">WELCOME</div>

      <el-form ref="loginFormInstance" :model="loginForm" :rules="rules" size="large" status-icon>
        <el-form-item prop="name">
          <el-input v-model="loginForm.name" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" :prefix-icon="Lock" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(loginFormInstance)">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { Login } from '@/api/Login'
import local from '@/utils/local'

interface LoginFormType {
  name: string
  password: string
}

const router = useRouter();

const loginFormInstance = ref<FormInstance>()
const loginForm = reactive<LoginFormType>({
  name: '',
  password: ''
})

const rules = reactive<FormRules<LoginFormType>>({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginForm)
      Login({ name: loginForm.name, pwd: loginForm.password }).then(res => {
        if (res.status === 200) {
          let data = res.data.data;
          local.set("blog_t&k", data.token);
          let info = {
            bloggerId: data.id,
            name: data.name,
            avatar: data.avatar,
            conciseDesc: data.conciseDesc,
            detailDesc: data.detailDesc,
            createTime: data.createTime
          };
          local.set("blog_userinfo", info);
          ElMessage({
            message: '登录成功',
            type: 'success'
          });
          router.push({ path: '/home' });
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.login_page {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/imgs/login_bg.jpeg');
  background-size: 100%;
  background-repeat: no-repeat;
  background-size: cover;

  .login_box {
    position: absolute;
    top: 50%;
    left: 15%;
    transform: translateY(-50%);
    padding: 0 40px;
    width: 400px;
    height: 400px;
    backdrop-filter: blur(5px);
    border-radius: 5px;
    box-shadow: 0 0 20px 5px rgba(0, 0, 0, .3);

    .title {
      font-size: 24px;
      line-height: 120px;
      font-weight: bold;
      text-align: center;
      color: #fff;
    }

    .el-form-item--large {
      margin-bottom: 32px;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>