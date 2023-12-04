<template>
  <div class="left_nav" :class="store.state.isCollapse ? 'collapse' : ''">
    <div class="nav_top">
      <img class="logo" src="@/assets/imgs/logo.jpg" alt="logo">
      <Transition name="toggleShowTitle">
        <span class="text" v-show="!store.state.isCollapse">程序员的快乐小屋</span>
      </Transition>
    </div>

    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      :default-active="defaultActive"
      text-color="#fff"
      router
      :collapse="store.state.isCollapse"
    >
      <el-menu-item index="/home">
        <el-icon><icon-menu /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/blogger/blogger-info">
        <el-icon><icon-user /></el-icon>
        <span>博主信息</span>
      </el-menu-item>
      <el-sub-menu index="/articles">
        <template #title>
          <el-icon><icon-management /></el-icon>
          <span>文章管理</span>
        </template>
        <el-menu-item index="/articles/modify-article">
          <el-icon><icon-edit /></el-icon>
          <span>编辑文章</span>
        </el-menu-item>
        <el-menu-item index="/articles/articles-list">
          <el-icon><icon-files /></el-icon>
          <span>文章列表</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/albums/albums-list">
        <el-icon><icon-pictureFilled /></el-icon>
        <span>相册管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  Menu as IconMenu,
  UserFilled as IconUser,
  Management as IconManagement,
  Edit as IconEdit,
  Files as IconFiles,
  PictureFilled as IconPictureFilled
} from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();

let defaultActive = ref('/home');

watch(route, (newVal) => {
  defaultActive.value = newVal.path;
}, {immediate: true, deep: true})
</script>

<style lang="scss" scoped>
.left_nav {
  padding: 20px 0;
  width: 240px;
  height: 100%;
  background-color: #545c64;
  transition: all .3s;
  overflow-x: hidden;

  .nav_top {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    height: 40px;
    color: #fff;

    .logo {
      height: 40px;
    }

    .text {
      margin-left: 10px;
      font-size: 18px;
    }
  }

  .el-menu {
    height: calc(100% - 60px);
    border-right: 0;
  }
}

.left_nav.collapse {
  width: 64px;
}

.toggleShowTitle-enter-active{
  transition: opacity 0.2s ease .1s;
}

.toggleShowTitle-leave-active {
  transition: opacity 0.1s ease;
}

.toggleShowTitle-enter-from,
.toggleShowTitle-leave-to {
  opacity: 0;
}
</style>