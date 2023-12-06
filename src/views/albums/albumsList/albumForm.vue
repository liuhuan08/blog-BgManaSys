<template>
  <el-form ref="albumFormRef" :model="albumForm" :rules="rules" label-width="80px" status-icon>
    <el-form-item label="相册名称" prop="name">
      <el-input v-model="albumForm.name" />
    </el-form-item>
    <el-form-item label="相册封面" prop="albumCover">
      <div class="select_coverUrl_box" @click="selectPic">
        <el-icon v-if="!albumForm.albumCover">
          <Plus />
        </el-icon>
        <el-icon v-if="albumForm.albumCover" class="icon-change">
          <Refresh />
        </el-icon>
        <img v-if="albumForm.albumCover" :src="albumForm.albumCover">
      </div>
    </el-form-item>
    <el-form-item label="是否私密" prop="isPrivate">
      <el-switch v-model="albumForm.isPrivate" :active-value="1" :inactive-value="2" inline-prompt />
    </el-form-item>
    <el-form-item label="进入密码" prop="password" v-if="albumForm.isPrivate == 1" :rules="[
        {
          required: true,
          message: '请输入进入密码',
          trigger: 'blur',
        }
      ]">
      <el-input v-model="albumForm.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(albumFormRef)">保存</el-button>
      <el-button @click="resetForm(albumFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import local from "@/utils/local";

const props = defineProps({
  albumEditForm: Object,
  imgUrl: String,
})

const emit = defineEmits(['on-selPic', 'on-confirm'])

let bloggerId = local.get("blog_userinfo").bloggerId;
const albumFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入相册名称', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 之间', trigger: 'blur' },
  ],
  albumCover: [
    { required: true, message: '请选择您要设置的相册封面图片', trigger: 'blur' },
  ]
});
const albumForm = reactive<any>(
  {
    name: '',
    isPrivate: 1,
    albumCover: '',
    password: ''
  }
);

watch(() => props.albumEditForm, (newVal) => {
  if (newVal) {
    albumForm.name = newVal.name;
    albumForm.isPrivate = newVal.isPrivate;
    albumForm.albumCover = newVal.albumCover;
    albumForm.password = newVal.password;
  }
}, { immediate: true, deep: true })

watch(() => props.imgUrl, (newVal) => {
  if (newVal) {
    albumForm.albumCover = newVal;
  }
}, { immediate: true, deep: true })

const selectPic = () => {
  emit("on-selPic")
}

const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return
  await form.validate((valid, fields) => {
    if (valid) {
      emit("on-confirm", albumForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.resetFields();
  albumForm.name = '';
  albumForm.isPrivate = 1;
  albumForm.albumCover = '';
  albumForm.password = '';
}
</script>

<style lang="scss" scoped>
.el-form {
  padding: 10px 20px;
  width: 100%;
  height: calc(100% - 30px);
}

.select_coverUrl_box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 110px;
  height: 154px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }

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
</style>