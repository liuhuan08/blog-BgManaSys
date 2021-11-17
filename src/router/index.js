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
				path: "/article/article-modify",
				name: "ArticleModify",
				meta: {
					title: '文章修改',
					path: '/article/article-modify'
				},
				component: () => import("../views/articleManage/ArticleModify.vue")
			}, {
				path: "/article/add-article",
				name: "AddArticle",
				meta: {
					title: '新增文章',
					path: '/article/add-article'
				},
				component: () => import("../views/articleManage/AddArticle.vue")
			}
		]
	},
	{
		path: "/image",
		redirect: "/image/image-manage",
		name: "Image",
		component: Index,
		children: [{
				path: "/image/image-manage",
				name: "ImageManage",
				meta: {
					title: '图片管理',
					path: "/image/image-manage"
				},
				component: () => import("../views/imageManage/ImageManage.vue")
			}
		]
	}
];

const router = new VueRouter({
  routes,
});

export default router;
