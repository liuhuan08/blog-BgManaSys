<template>
  <div class="title_container">
    <span class="title">相册管理</span>
    <el-button type="primary" @click="add">新增相册</el-button>
  </div>
  <div class="list_container">
    <div class="list">
      <div class="list_item_container" v-for="album in albumsList" :key="album.id">
        <div class="item">
          <img :src="album.albumCover">
          <div class="item_title" @click="handleClickAlbum(album, $event)">{{ album.albumName }}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="dialog_album" v-if="showAlbum">
    <div class="dialog_content">
      <div class="cover">
        <img class="front" :src="chooseAlbum.albumCover">
        <img class="back" :src="chooseAlbum.albumCover">
      </div>
      <div class="info">
        <Transition name="slide">
          <div class="info_card" v-show="!isEdit">
            <el-popconfirm title="你确认删除这个相册吗？" @confirm="handleDel">
              <template #reference>
                <el-icon class="icon-del">
                  <Delete />
                </el-icon>
              </template>
            </el-popconfirm>
            <div class="info_title">{{ chooseAlbum.albumName }}</div>
            <div class="info_main">
              <div class="private">
                是否私密：
                <el-switch v-model="chooseAlbum.isPrivate" :active-value="1" :inactive-value="2" inline-prompt disabled />
              </div>
              <div class="pwd" v-if="chooseAlbum.isPrivate === 1">
                访问密码：
                {{ handlePwd(chooseAlbum.password) }}
                <el-icon v-if="hidePwd" @click="hidePwd = !hidePwd">
                  <Hide />
                </el-icon>
                <el-icon v-else @click="hidePwd = !hidePwd">
                  <Hide />
                </el-icon>
              </div>
              <div class="create_time">创建时间：{{ handleDate(chooseAlbum.createTime) }}</div>
              <div class="update_time">修改时间：{{ handleDate(chooseAlbum.updateTime) }}</div>
            </div>
            <div class="btns">
              <el-button type="primary" @click="edit(chooseAlbum)">修改相册信息</el-button>
              <el-button @click="getInAlbum(chooseAlbum)">进入相册</el-button>
            </div>
          </div>
        </Transition>

        <Transition name="slide">
          <div class="edit_card" v-show="isEdit">
            <el-icon class="icon-back" @click="isEdit = false">
              <Back />
            </el-icon>
            <albumForm :albumEditForm="albumEditForm" :img-url="dialogImageUrl" @on-selPic="handleSelPic"
              @on-confirm="handleFormConfirm" />
          </div>
        </Transition>
      </div>
    </div>

    <el-icon class="close" @click="showAlbum = false; isEdit = false">
      <Close />
    </el-icon>
  </div>

  <div class="add_dialog" v-if="showAddForm">
    <div class="dialog_content">
      <albumForm :albumEditForm="albumEditForm" :img-url="dialogImageUrl" @on-selPic="handleSelPic"
        @on-confirm="handleFormConfirm" />
    </div>
    <el-icon class="close" @click="showAddForm = false">
      <Close />
    </el-icon>
  </div>

  <div class="dialog_img" v-if="dialogVisible">
    <el-icon @click="dialogVisible = false">
      <Close />
    </el-icon>
    <div class="dialog_img-title">裁剪图片</div>
    <cropper :proportion="[5, 7]" @on-success="handlePicSuccess"></cropper>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getAlbumsList, addAlbums, delAlbums, editAlbums } from "@/api/albums";
import local from "@/utils/local";
import { normalizeDate, normalizeTime } from "@/utils/tools";
import albumForm from "./albumForm.vue";
import cropper from '@/components/cropper.vue'

const router = useRouter();

let bloggerId = local.get("blog_userinfo").bloggerId;
let albumsList = ref<any>([]);
let page = ref(1);
let size = ref(20);
let showAlbum = ref(false);
let top = ref('0px');
let left = ref('0px');
let chooseAlbum = ref<any>({});
let backgroundImage = ref('');
let hidePwd = ref(true);
let isEdit = ref(false);
let dialogVisible = ref(false);
let dialogImageUrl = ref('');
let albumId = ref('');
const albumEditForm = reactive(
  {
    name: '',
    isPrivate: 1,
    albumCover: '',
    password: ''
  }
);
let showAddForm = ref(false);

const getData = () => {
  let sendData = {
    bloggerId,
    sort: 1,
    page: page.value,
    size: size.value,
  };
  getAlbumsList(sendData).then((res) => {
    albumsList.value = res.data.data.records;
  });
};

const handleClickAlbum = (album: any, e: any) => {
  chooseAlbum.value = album;
  backgroundImage.value = `url(${album.albumCover})`
  top.value = e.clientY + 'px';
  left.value = e.clientX + 'px';
  isEdit.value = false;
  showAlbum.value = true;
}

const handleDate = (val: any) => {
  return normalizeDate(val, "-") + " " + normalizeTime(val);
}

const handlePwd = (pwd: any) => {
  if (hidePwd.value) {
    return '******';
  } else {
    return pwd;
  }
}

const add = () => {
  isEdit.value = false;
  albumEditForm.name = '';
  albumEditForm.albumCover = '';
  albumEditForm.isPrivate = 1;
  albumEditForm.password = '';
  showAddForm.value = true;
}

const handleDel = () => {
  delAlbums({ albumId: chooseAlbum.value.id }).then((res) => {
    if (res.data.code === 200) {
      showAlbum.value = false;
      ElMessage({ message: '删除成功', type: 'success' })
      getData();
    }
  });
}

const edit = (data: any) => {
  albumId.value = data.id;
  albumEditForm.name = data.albumName;
  albumEditForm.albumCover = data.albumCover;
  albumEditForm.isPrivate = data.isPrivate;
  albumEditForm.password = data.password;
  isEdit.value = true;
  showAddForm.value = false;
}

const handlePicSuccess = (data: any) => {
  dialogImageUrl.value = data;
  dialogVisible.value = false;
}

const handleSelPic = () => {
  dialogVisible.value = true;
}

const handleFormConfirm = (data: any) => {
  if (isEdit.value) {
    const sendData = {
      albumId: albumId.value,
      albumName: data.name,
      albumCover: data.albumCover,
      isPrivate: data.isPrivate,
      password: data.password
    }
    if (sendData.isPrivate == 2) delete (sendData.password);
    editAlbums(sendData).then((res: any) => {
      if (res.data.code == 200) {
        ElMessage({ message: '保存成功', type: 'success' })
        isEdit.value = false;
        showAlbum.value = false;
        getData();
      }
    })
  } else {
    const sendData = {
      bloggerId,
      albumName: data.name,
      albumCover: data.albumCover,
      isPrivate: data.isPrivate,
      password: data.password
    }
    if (sendData.isPrivate == 2) delete (sendData.password);
    addAlbums(sendData).then((res: any) => {
      if (res.data.code == 200) {
        ElMessage({ message: '保存成功', type: 'success' })
        showAddForm.value = false;
        getData();
      }
    }).catch((err: any) => { })
  }
}

const getInAlbum = (data: any) => {
  router.push({
    path: '/albums/album-info',
    query: {
      id: data.id,
      name: data.albumName
    }
  })
}


getData();
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
}

.list_container {
  padding: 0 20px;
  width: 100%;
  height: calc(100% - 68px);
  box-shadow: inset 0px -3px 5px #eee;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #ccc;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: #fff;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
    grid-column-gap: 10px;
    grid-row-gap: 20px;
    justify-content: space-between;

    .list_item_container {
      width: 150px;
      height: 210px;

      .item {
        position: relative;
        width: 100%;
        height: 100%;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 150px;
          height: 210px;
          z-index: 10;
        }

        .item_title {
          position: absolute;
          top: 20px;
          left: 10%;
          padding: 10px 0;
          width: 80%;
          text-align: center;
          backdrop-filter: blur(5px);
          border-radius: 5px;
          box-shadow: 0 0 5px 3px rgba(0, 0, 0, .3);
          transition: all .2s;
          cursor: pointer;
          z-index: 11;

          &:hover {
            transform-origin: center;
            transform: scale(1.05);
            box-shadow: 0 0 10px 5px rgba(0, 0, 0, .4);
          }
        }
      }
    }
  }
}

.dialog_album {
  --top: v-bind(top);
  --left: v-bind(left);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  z-index: 99;

  .dialog_content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(50%, -50%);
    width: 300px;
    height: 420px;
    background-color: #fff;
    animation: show .5s, move .5s .5s;
    perspective: 1000px;

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-origin: left;
      transform: rotateY(-170deg);
      transform-style: preserve-3d;
      animation: initRotate .5s, coverRotate .5s .5s;
      z-index: 102;

      .front {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
      }

      .back {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transform: rotateY(180deg);
      }
    }

    .info {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      border-left: 1px solid #eee;
      background-size: 100%;
      background-repeat: no-repeat;
      background-size: cover;
      overflow: hidden;
      z-index: 100;

      .info_card {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        .icon-del {
          position: absolute;
          top: 10px;
          right: 10px;
          color: #F56C6C;
          cursor: pointer;
        }

        .info_title {
          margin-bottom: 10px;
          text-align: center;
          font-size: 28px;
          line-height: 68px;
        }

        .info_main {
          flex: 1;

          .private,
          .pwd,
          .create_time,
          .update_time {
            padding: 10px;
          }
        }

        .btns {
          margin-bottom: 20px;
          text-align: center;
        }
      }

      .edit_card {
        width: 100%;
        height: 100%;

        .icon-back {
          margin-top: 10px;
          margin-left: 20px;
          font-size: 20px;
          cursor: pointer;

          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }

  .close {
    position: absolute;
    top: 40px;
    right: 40px;
    font-weight: 700;
    cursor: pointer;
  }
}

.add_dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  z-index: 120;

  .dialog_content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 420px;
    background-color: #fff;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, .3);
    border-radius: 6px;
  }

  .close {
    position: absolute;
    top: 40px;
    right: 40px;
    font-weight: 700;
    cursor: pointer;
  }
}

.dialog_img {
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

  .dialog_img-title {
    font-size: 20px;
    color: #000;
  }
}

@keyframes show {
  0% {
    top: var(--top);
    left: var(--left);
    transform: translate(0, 0);
    width: 0;
    height: 0;
  }

  100% {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 420px;
  }
}

@keyframes move {
  0% {
    transform: translate(-50%, -50%);
  }

  100% {
    transform: translate(50%, -50%);
  }
}

@keyframes initRotate {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(0deg);
  }
}

@keyframes coverRotate {
  0% {
    transform: rotateY(0deg);
  }

  100% {
    transform: rotateY(-170deg);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>