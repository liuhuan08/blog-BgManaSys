<template>
  <div class="title">编辑文章</div>
  <el-form ref="articleFormRef" :model="articleForm" :rules="rules" label-width="100px" status-icon>
    <div class="item_group">
      <el-form-item label="文章标题" prop="title" class="form_item_title">
        <el-input v-model="articleForm.title" />
      </el-form-item>
      <el-form-item label="文章副标题" prop="subTitle" class="form_item_subtitle">
        <el-input v-model="articleForm.subTitle" maxlength="50" show-word-limit />
      </el-form-item>
    </div>
    <div class="item_group">
      <el-form-item label="文章封面" prop="coverUrl" class="form_item_coverUrl">
        <div class="select_coverUrl_box" @click="dialogVisible = true">
          <el-icon v-if="!articleForm.coverUrl">
            <Plus />
          </el-icon>
          <el-icon v-if="articleForm.coverUrl" class="icon-change">
            <Refresh />
          </el-icon>
          <img v-if="articleForm.coverUrl" :src="articleForm.coverUrl">
        </div>
      </el-form-item>
      <el-form-item label="文章标签" prop="articleTagList" class="form_item_tag">
        <el-select v-model="articleForm.articleTagList" multiple collapse-tags filterable placeholder="请选择文章标签">
          <el-option v-for="item in tagsList" :key="item.tagId" :label="item.tagName" :value="item.tagId" />
          <template #footer>
            <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
              新增文章标签
            </el-button>
            <template v-else>
              <el-input v-model="optionName" class="option-input" placeholder="请输入标签名称" size="small" />
              <el-button type="primary" size="small" @click="onConfirm">
                确认
              </el-button>
              <el-button size="small" @click="clear">取消</el-button>
            </template>
          </template>
        </el-select>
      </el-form-item>
    </div>
    <el-form-item label="文章内容" prop="content" class="form_item_content">
      <v-md-editor
        v-model="articleForm.content"
        placeholder="请输入文章内容"
        height="300px"
        ></v-md-editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(articleFormRef)">保存</el-button>
      <el-button @click="resetForm(articleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>

  <div class="dialog" v-if="dialogVisible">
    <el-icon @click="dialogVisible = false">
      <Close />
    </el-icon>
    <div class="dialog-title">裁剪图片</div>
    <cropper :proportion="[1, 1]" @on-success="handlePicSuccess"></cropper>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Close, Refresh } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, CheckboxValueType } from 'element-plus'
import cropper from '@/components/cropper.vue'
import local from '@/utils/local';
import { getArticleInfoData, getArticleTagList, addArticleTagList, addArticle, editArticle } from '@/api/article';
import { uploadImgApi } from '@/api/albums';

interface RuleForm {
  bloggerId: any
  title: string
  subTitle: string
  coverUrl: string
  articleTagList: []
  content: string
}

const route = useRoute();
const router = useRouter();

const articleFormRef = ref<FormInstance>()

const articleForm = reactive<RuleForm>(
  {
    bloggerId: local.get("blog_userinfo").bloggerId,
    title: '',
    subTitle: '',
    coverUrl: '',
    articleTagList: [],
    content: ''
  }
)
let tagsList = ref<any>([]);
let isAdding = ref(false);
let value = ref<CheckboxValueType[]>([]);
let optionName = ref('');
let dialogVisible = ref(false);

const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 之间', trigger: 'blur' },
  ],
  coverUrl: [
    { required: true, message: '请选择您要设置的文章封面图片', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
  ],
})

const getArticleInfo = () => {
  if (route.query.id) {
    let id = Number(route.query.id);
    getArticleInfoData(id).then((res) => {
      if (res.status === 200) {
        let data = res.data.data;
        articleForm.title = data.title;
        articleForm.subTitle = data.subTitle;
        articleForm.coverUrl = data.coverUrl;
        articleForm.content = data.content;
        articleForm.articleTagList = data.tags.map((item: any) => item.tagId);
      }
    });
  } else {
    articleForm.title = '';
    articleForm.subTitle = '';
    articleForm.coverUrl = '';
    articleForm.content = '';
    articleForm.articleTagList = [];
  }
}

const getTags = () => {
  let bloggerId = local.get("blog_userinfo").bloggerId;
  articleForm.bloggerId = bloggerId;
  getArticleTagList(bloggerId).then((res) => {
    if (res.status === 200) {
      tagsList.value = res.data.data;
    }
  });
}

const onAddOption = () => {
  isAdding.value = true
}

const onConfirm = () => {
  if (optionName.value) {
    addArticleTagList({
      bloggerId: articleForm.bloggerId,
      tagName: optionName.value,
    }).then((res) => {
      if (res.status === 200) {
        ElMessage({ message: '新增成功', type: 'success' });
        getTags();
        clear()
      }
    }).catch((err) => {
      ElMessage({ message: '新增失败', type: 'error' })
      console.log(err);
    });
  }
}

const clear = () => {
  optionName.value = ''
  isAdding.value = false
}

const handlePicSuccess = (data: any) => {
  articleForm.coverUrl = data;
  dialogVisible.value = false;
}


const submitForm = async (form: FormInstance | undefined) => {
  if (!form) return
  await form.validate((valid, fields) => {
    if (valid) {
      if (route.query.id) {
        editArticle(articleForm).then((res: any) => {
          if (res.status === 200) {
            ElMessage({ message: '保存成功', type: 'success' })
            resetForm(form);
            router.go(-1);
          }
        })
      } else {
        addArticle(articleForm).then((res: any) => {
          if (res.status === 200) {
            ElMessage({ message: '保存成功', type: 'success' })
            resetForm(form);
          }
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (form: FormInstance | undefined) => {
  if (!form) return
  form.resetFields();
  articleForm.title = '';
  articleForm.subTitle = '';
  articleForm.coverUrl = '';
  articleForm.articleTagList = [];
  articleForm.content = ''
}

getArticleInfo();
getTags();
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
  width: 100%;

  .el-form-item {
    margin-bottom: 24px;

    .select_coverUrl_box {
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

  .item_group {
    display: flex;

    .form_item_title,
    .form_item_coverUrl {
      margin-right: 20px;
      width: 35%;
    }

    .form_item_subtitle,
    .form_item_tag {
      width: 60%;
    }

    .form_item_tag {
      :deep(.el-form-item__content) {
        height: 32px;
      }
    }
  }

}

.option-input {
  margin-bottom: 10px;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  padding: 40px;
  width: 100%;
  min-width: 1450px;
  height: 100%;
  background-color: rgba(255, 255, 255, .8);
  z-index: 999999;

  .el-icon {
    position: absolute;
    top: 40px;
    right: 40px;
    font-size: 20px;
    cursor: pointer;
  }

  .dialog-title {
    font-size: 20px;
    color: #000;
  }
}
</style>