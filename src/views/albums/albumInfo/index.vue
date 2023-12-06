<template>
  <div class="title_container">
    <span class="title">{{ title }}</span>

    <div class="btn_section">
      <el-checkbox v-model="checkedAll" @change="handleCheckedAllChange" label="全选" size="large" />
      <el-button type="danger" @click="delChecked" class="btn_del" size="small">删除选中</el-button>
      <el-button type="primary" @click="add" size="small">新增图片</el-button>
    </div>
  </div>

  <div class="imgs_container">
    <div v-masonry fit-width="true" transition-duration="0.3s" item-selector=".card" origin-left="false"
      class="card_container">
      <div v-masonry-tile v-for="(img, index) in imgList" :key="img.id" class="card">
        <img :src="img.url">
        <el-checkbox v-model="img.isChecked" @change="handleSingleChecked(img.isChecked, index)" size="large" />
        <div class="del_btn" @click="delImg(img.id)">
          <el-icon class="icon-del">
            <Delete />
          </el-icon>
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showAddDialog" title="上传图片">
    <el-upload v-model:file-list="fileList" :disabled="fileList.length === 5" :limit="5"
      action="https://api.excellentlld.com/blog/back/upload-image" :headers="{ Authorization: token }"
      list-type="picture-card" :on-preview="handlePictureCardPreview" :before-upload="beforeImgUpload">
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAdd">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogVisible" class="preview_dialog" width="70%">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps } from 'element-plus'
import * as imageConversion from 'image-conversion';
import { getAlbumImgs, albumAddImgs, albumDelImgs } from "@/api/albums";
import local from '@/utils/local'

const route = useRoute();

let title = ref(route.query.name);
let page = ref(1);
let size = ref(10);
let checkedAll = ref(false);
let imgList = ref<any>([]);
let fileList = ref<any>([]);
let showAddDialog = ref(false);
let dialogImageUrl = ref('');
let dialogVisible = ref(false);
let albumId = route.query.id;

let token = 'Bearer ' + local.get('blog_t&k');

const getImgs = () => {
  getAlbumImgs({ albumId, page: page, size: size }).then((res) => {
    imgList.value = res.data.data.records.map((item: any) => { return { id: item.id, url: item.url, isChecked: false } });
  })
};

const delChecked = () => {
  const checkedImgsId = imgList.value.filter((item: any) => { return item.isChecked }).map((item: any) => { return item.id });
  if (checkedImgsId && checkedImgsId.length) {
    ElMessageBox.confirm(
      '您确认要删除这些图片吗？',
      '系统提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        albumDelImgs({ deleteIds: checkedImgsId }).then((res) => {
          if (res.status === 200) {
            ElMessage({ message: '删除成功', type: 'success' })
            getImgs();
          }
        });
      })
      .catch(() => { })
  } else {
    ElMessage({ message: '请先选中要删除的图片', type: 'warning' })
  }
}

const delImg = (id: any) => {
  ElMessageBox.confirm(
    '您确认要删除这张图片吗？',
    '系统提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      albumDelImgs({ deleteIds: [id] }).then((res) => {
        if (res.status === 200) {
          ElMessage({ message: '删除成功', type: 'success' })
          getImgs();
        }
      });
    })
    .catch(() => { })
}

const add = () => {
  fileList.value = [];
  showAddDialog.value = true;
}

const handleCheckedAllChange = () => {
  if (checkedAll.value) {
    imgList.value.forEach((item: any) => { item.isChecked = true });
  } else {
    imgList.value.forEach((item: any) => { item.isChecked = false });
  }
}

const handleSingleChecked = (checked: boolean, index: number) => {
  imgList.value[index].isChecked = checked;
  if (imgList.value.every((item: any) => { return item.isChecked })) {
    checkedAll.value = true
  } else {
    checkedAll.value = false
  };
}

const beforeImgUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const isJPG = rawFile.type === "image/jpeg";

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG 格式!')
    return isJPG
  } else {
    return new Promise((resolve, reject) => {
      let isLt200KB = rawFile.size / 1024 / 1024 < 0.2; // 判定图片大小是否小于200KB
      if (isLt200KB) {
        resolve(rawFile);
      }
      // console.log(rawFile); // 压缩到200KB,这里的200就是要压缩的大小,可自定义
      imageConversion.compressAccurately(rawFile, 200).then((res) => {
        resolve(res);
      });
    });
  }
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleConfirmAdd = () => {
  const imgList = fileList.value.map((item: any) => item.response.data.url)
  const sendData = {
    albumId,
    imgList
  }
  albumAddImgs(sendData).then((res) => {
    if (res.status === 200) {
      ElMessage({ message: '新增相册图片成功！', type: 'success' })
      showAddDialog.value = false;
      fileList.value = [];
      getImgs();
    }
  });
}

getImgs();
</script>

<style lang="scss" scoped>
.title_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
  padding-right: 20px;
  border-bottom: 1px solid #ebebeb;

  .title {
    font-size: 20px;
  }

  .btn_section {
    display: flex;
    align-items: center;

    .el-button>:deep(span) {
      font-size: 12px;
    }

    .btn_del {
      margin-left: 15px;
    }
  }
}

.imgs_container {

  .card_container {
    margin: 0 auto;
    width: 100%;

    .card {
      position: relative;
      width: 100%;
      max-width: 200px;
      margin: 10px;
      overflow: hidden;

      img {
        width: 100%;
      }

      .el-checkbox {
        position: absolute;
        top: 0px;
        left: 10px;
      }

      .del_btn {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: -30px;
        right: 0px;
        width: 100%;
        height: 30px;
        background-color: rgba($color: #fff, $alpha: .3);
        transition: all 0.3s;
        cursor: pointer;
      }

      &:hover .del_btn {
        bottom: 0;
      }
    }
  }
}

.preview_dialog {
  img {
    width: 100%;
  }
}
</style>