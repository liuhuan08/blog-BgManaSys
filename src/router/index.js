import Vue from "vue";
import VueRouter from "vue-router";

import Index from "../views/layout/Index.vue"
import Login from "../views/Login.vue"

Vue.use(VueRouter);

/* 解决重复跳转到一个路由 警告你的信息 */
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
	{
		path: "/",
		redirect: "/home",
		name: "Index",
		component: Index,
		children: [{
				path: "/home",
				name: "Home",
				meta: {
					title: '首页',
					path: '/home'
				},
				component: () => import("../views/home/Index.vue")
			}
		]
	},
	{
		path: "/login",
		component: Login
	},
	{
		path: "/blogger",
		redirect: "/blogger/blogger-info",
		name: "Blogger",
		component: Index,
		children: [{
				path: "/blogger/blogger-info",
				name: "BloggerInfo",
				meta: {
					title: '博主信息',
					path: '/blogger/blogger-info'
				},
				component: () => import("../views/bloggerInfo/BloggerInfo.vue")
			}
		]
	},
	{
		path: "/article",
		redirect: "/article/article-list",
		name: "Article",
		component: Index,
		children: [{
				path: "/article/article-list",
				name: "ArticleList",
				meta: {
					title: '文章列表',
					path: '/article/article-list'
				},
				component: () => import("../views/articleManage/ArticleList.vue")
			}, {
				path: "/article/add_modify-article",
				name: "AddModifyArticle",
				meta: {
					title: '新增文章',
					path: '/article/add_modify-article'
				},
				component: () => import("../views/articleManage/AddModifyArticle.vue")
			}
		]
	},
	{
		path: "/album",
		redirect: "/album/album-manage",
		name: "Album",
		component: Index,
		children: [{
				path: "/album/album-manage",
				name: "albumManage",
				meta: {
					title: '相册管理',
					path: "/album/album-manage"
				},
				component: () => import("../views/albumManage/albumManage.vue")
			}, {
				path: "/album/album-manage/imgs",
				name: "ImageManage",
				meta: {
					path: "/album/album-manage/imgs"
				},
				component: () => import("../views/albumManage/imgs.vue")
			}
		]
	}
];

const router = new VueRouter({
  routes,
});

export default router;
