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
		redirect: "/blogger-info",
		name: "Blogger",
		component: Index,
		children: [{
				path: "/blogger-info",
				name: "BloggerInfo",
				component: () => import("../views/bloggerInfo/BloggerInfo.vue")
			}
		]
	},
	{
		path: "/article",
		redirect: "/article-list",
		name: "Article",
		component: Index,
		children: [{
				path: "/article-list",
				name: "ArticleList",
				component: () => import("../views/articleManage/ArticleList.vue")
			}, {
				path: "/article-modify",
				name: "ArticleModify",
				component: () => import("../views/articleManage/ArticleModify.vue")
			}, {
				path: "/add-article",
				name: "AddArticle",
				component: () => import("../views/articleManage/AddArticle.vue")
			}
		]
	},
	{
		path: "/image",
		redirect: "/image-manage",
		name: "Image",
		component: Index,
		children: [{
				path: "/image-manage",
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
