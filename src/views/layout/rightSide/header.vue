<template>
  <div class="right_header">
    <div class="right_header_top">
      <el-icon class="icon_expand" :class="store.state.isCollapse ? 'icon_collapse' : ''" @click="toggleExpand"><Fold /></el-icon>
      <div class="top_text">{{ title }}</div>
      <img :src="avatar" alt="avatar" class="avatar">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          欢迎您，{{ userName }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="menu_list">
      <div
        class="menu_item"
        :class="$route.path === menu.path ? 'active' : ''"
        v-for="menu in menuList"
        :key="menu"
      >
        <span @click="handleClickMenu(menu)">{{ menu.title }}</span>
        <el-icon
          v-if="menu.path !== '/' && menu.path !== '/home'"
          @click="handleCloseMenu(menu)"
        >
          <icon-close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex'
import { Close as IconClose } from '@element-plus/icons-vue'
import local from '@/utils/local';

const route = useRoute();
const router = useRouter();
const store = useStore();

let title = ref('');
let userInfo = reactive(local.get('blog_userinfo'));
let userName = ref(userInfo.name);
let avatar = ref(userInfo.avatar);
let menuList = reactive<any>(local.get('menuList') || []);
let showIcon = ref(false);

const toggleExpand = () => {
  store.dispatch('toggleCollapse');
}

const showTitle = () => {
  let text = '';
	let titleList = [
		"中午吃点什么呢？",
		"喝杯咖啡休息下吧！",
		"摸会鱼~~~",
		"又在写bug吗？",
		"注意保护眼睛哦~",
		"晚上开黑吗？",
		"晚上去看电影吧。",
		"摸会鱼~~~",
		"又在写bug吗？",
		"注意保护眼睛哦~",
		"今天又写了多少bug？",
		"今天的目标完成了吗？",
		"周末出去玩吗？",
		"注意保护眼睛哦~",
		"早点休息吧！",
	];
	let time = new Date().getHours();
	if (time >= 6 && time < 12) {
		text = '早上好，';
		let i = Math.floor(Math.random() * (4 - 0 + 1) + 0);
		title.value = text + titleList[i];
	} else if (time >= 12 && time < 18) {
		text = '下午好，';
		let i = Math.floor(Math.random() * (5 - 11 + 1) + 11);
		title.value = text + titleList[i];
	} else {
		text = '晚上好，';
		let i = Math.floor(Math.random() * (9 - 14 + 1) + 14);
		title.value = text + titleList[i];
	}
}

const handleCommand = (command: string | number | object) => {
  if (command === 'logout') {
    // 退出登陆
    local.clear();
    router.push({ path: '/login' });
  }
}

const addMenu = (data: any) => {
  const hasCurrentRoute = menuList.some((item: any) => item.path === route.path)
  if (!hasCurrentRoute) {
    menuList.push(data);
  }
}

const initMenuList = () => {
  const meta = route.meta;
  if (menuList.length <= 0) {
    menuList.push(route.meta);
  } else {
    addMenu(meta);
  }
  local.set('menuList', menuList);
};

watch(route, (newVal) => {
  addMenu(newVal.meta)
  local.set('menuList', menuList);
}, {immediate: true, deep: true})

const handleClickMenu = (menu: any) => {
  if (route.path !== menu.path) {
    router.push({ path: menu.path });
  }
}

const handleCloseMenu = (menu: any) => {
  const index = menuList.findIndex((item: any) => item.path === menu.path);
  menuList.splice(index, 1);
  if (route.path === menu.path) {
    router.push({ path: '/home' });
  }
  local.set('menuList', menuList);
}

showTitle();
initMenuList();
</script>

<style lang="scss" scoped>
.right_header {
  height: 80px;
  width: 100%;

  .right_header_top {
    display: flex;
    align-items: center;
    padding: 5px 20px;
    border-bottom: 1px solid #ebeef5;

    .el-icon.icon_expand {
      font-size: 22px;
      cursor: pointer;
      transform: rotateZ(0deg);
      transition: transform 0.3s;

      &.icon_collapse {
        transform: rotateZ(-180deg);
      }

      svg {
        width: 22px;
        height: 22px;
      }
    }

    .top_text {
      flex: 1;
      margin-left: 40px;
      margin-right: 20px;
    }

    .avatar {
      margin-right: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .el-dropdown, .el-dropdown-link {
      border: 0 !important;
      user-select: none;
      cursor: pointer;
      outline: 0;
    }
  }

  .menu_list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    .menu_item {
      position: relative;
      padding: 0 30px;
      line-height: 29px;
      border-right: 1px solid #ebeef5;
      cursor: pointer;
      user-select: none;

      &.active {
        color: #409eff;
        background-color: #ecf5ff;
      }

      &:hover {
        color: #409eff;

        .el-icon {
          display: block;
        }
      }

      .el-icon {
        display: none;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        margin-left: 10px;

        &:hover {
          color: #fff;
          background-color: #337ecc;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>