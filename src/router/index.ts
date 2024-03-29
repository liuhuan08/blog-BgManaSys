import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Index from '../views/layout/index.vue';

import local from '../utils/local';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/home',
        name: 'Home',
        meta: {
          title: '首页',
          path: '/home'
        },
        component: () => import('../views/home/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/blogger',
    redirect: '/blogger/blogger-info',
    name: 'Blogger',
    component: Index,
    children: [{
      path: '/blogger/blogger-info',
      name: 'BloggerInfo',
      meta: {
        title: '博主信息',
        path: '/blogger/blogger-info'
      },
      component: () => import('../views/bloggerInfo/index.vue')
    }
    ]
  },
  {
    path: '/articles',
    redirect: '/articles/articles-list',
    name: 'Articles',
    component: Index,
    children: [
      {
        path: '/articles/articles-list',
        name: 'ArticlesList',
        meta: {
          title: '文章列表',
          path: '/articles/articles-list'
        },
        component: () => import('../views/articles/articlesList/index.vue')
      },
      {
        path: '/articles/modify-article',
        name: 'ModifyArticle',
        meta: {
          title: '编辑文章',
          path: '/articles/modify-article'
        },
        component: () => import('../views/articles/modifyArticle/index.vue')
      }
    ]
  },
  {
    path: '/albums',
    redirect: '/albums/albums-list',
    name: 'Albums',
    component: Index,
    children: [
      {
        path: '/albums/albums-list',
        name: 'AlbumsList',
        meta: {
          title: '相册管理',
          path: '/albums/albums-list'
        },
        component: () => import('../views/albums/albumsList/index.vue')
      },
      {
        path: '/albums/album-info',
        name: 'AlbumInfo',
        meta: {
          path: '/albums/album-info'
        },
        component: () => import('../views/albums/albumInfo/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let pathArr: string[] = [];
routes.forEach(v => {
  pathArr.push(v.path);
  if (v.children) {
    v.children.forEach(item => {
      pathArr.push(item.path);
    })
  };
});

/* 全局前置路由守卫 */
router.beforeEach((to, from, next) => {
  // 登录状态  
  let isLogin = local.get('blog_t&k') ? true : false;

  if (isLogin) {
    if (pathArr.indexOf(to.path) === -1) {
      next({
        path: '/404'
      });
    } else {
      next();
    };
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next({
        path: '/login'
      });
    };
  };
});

export default router
