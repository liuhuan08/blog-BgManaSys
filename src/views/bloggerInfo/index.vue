<template>
  <div class="title">博主信息</div>
  <el-form ref="bloggerInfoFormRef" :model="bloggerInfoForm" :rules="rules" label-width="100px" class="demo-bloggerInfoForm" status-icon>
    <el-form-item label="博主名" prop="name">
      <el-input v-model="bloggerInfoForm.name" />
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <div class="select_avatar_box" @click="dialogVisible = true">
        <el-icon v-if="!bloggerInfoForm.avatar"><Plus /></el-icon>
        <el-icon v-if="bloggerInfoForm.avatar" class="icon-change"><Refresh /></el-icon>
        <img v-if="bloggerInfoForm.avatar" :src="bloggerInfoForm.avatar">
      </div>
    </el-form-item>
    <el-form-item label="简介" prop="conciseDesc">
      <el-input v-model="bloggerInfoForm.conciseDesc" maxlength="20" show-word-limit />
    </el-form-item>
    <el-form-item label="详细介绍" prop="detailDesc">
      <el-input v-model="bloggerInfoForm.detailDesc" type="textarea" :rows="10" maxlength="200" show-word-limit />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(bloggerInfoFormRef)">保存</el-button>
      <el-button @click="resetForm(bloggerInfoFormRef)">重置</el-button>
    </el-form-item>
  </el-form>

  <div class="dialog" v-if="dialogVisible">
    <el-icon @click="dialogVisible = false"><Close /></el-icon>
    <div class="dialog-title">裁剪图片</div>
    <cropper :proportion="[1, 1]" @on-success="handleAvatarSuccess"></cropper>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Close, Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import cropper from '@/components/cropper.vue'
import local from '@/utils/local';
import { modifyBlogger } from '@/api/user';

interface RuleForm {
  name: string
  avatar: string
  conciseDesc: string
  detailDesc: string
}

const formSize = ref('default')
const bloggerInfoFormRef = ref<FormInstance>()
const bloggerInfoForm = reactive<RuleForm>(local.get("blog_userinfo"))
let dialogVisible = ref(false);

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入您要设置的博主名', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 之间', trigger: 'blur' },
  ],
  avatar: [
    { required: true, message: '请选择您要设置的头像图片', trigger: 'blur' },
  ],
  conciseDesc: [
    { required: true, message: '请输入您的简介', trigger: 'blur' },
  ],
  detailDesc: [
    { required: true, message: '请输入您的详细介绍', trigger: 'blur' },
  ],
})

const handleAvatarSuccess = (data: any) => {
  bloggerInfoForm.avatar = data;
  dialogVisible.value = false;
}


const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return
  await form.validate((valid, fields) => {
    if (valid) {
      modifyBlogger(bloggerInfoForm).then((res: any) => {
        if (res.status === 200) {
          local.set("blog_userinfo", bloggerInfoForm)
          ElMessage({ message: '修改成功', type: 'success'  })
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.resetFields();
  bloggerInfoForm.name = '';
  bloggerInfoForm.avatar = '';
  bloggerInfoForm.conciseDesc = '';
  bloggerInfoForm.detailDesc = ''
}
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 20px;
  padding-left: 100px;
  padding-bottom: 20px;
  font-size: 20px;
  border-bottom: 1px solid #ebebeb;
}

.el-form {
  width: 50%;

  .el-form-item {
    margin-bottom: 24px;

    .select_avatar_box {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 120px;
      height: 120px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;

      &:hover {
        color: #409eff;
        border-color: #409eff;
      }

      .icon-change {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &:hover .icon-change {
        display: block;
      }
    }
  }
}

.dialog{
	position: fixed;
	top: 0;
	left: 0;
	padding: 40px;
	width: 100%;
	min-width: 1450px;
	height: 100%;
	background-color: rgba(255, 255, 255, .8);

	.el-icon{
		position: absolute;
		top: 40px;
		right: 40px;
		font-size: 20px;
		cursor: pointer;
	}

	.dialog-title{
		font-size: 20px;
		color: #000;
	}
}
</style>