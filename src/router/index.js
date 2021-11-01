import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/layout/Index.vue"

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		redirect: "/home",
		name: "Index",
		component: Index,
		children: [{
				path: "/home",
				name: "Home",
				component: () => import("../views/home/Index.vue")
			}
		]
	},
	{
		path: "/blogger",
		redirect: "/blogger/blogger-info",
		name: "Blogger",
		component: Index,
		children: [{
				path: "/blogger/blogger-info",
				name: "BloggerInfo",
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
				component: () => import("../views/articleManage/ArticleList.vue")
			}, {
				path: "/article/article-modify",
				name: "ArticleModify",
				component: () => import("../views/articleManage/ArticleModify.vue")
			}, {
				path: "/article/add-article",
				name: "AddArticle",
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
				component: () => import("../views/imageManage/ImageManage.vue")
			}
		]
	}
];

const router = new VueRouter({
  routes,
});

export default router;
