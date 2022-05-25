import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/css/normalize.css"; // 重置样式表

import "./assets/iconfonts/iconfont.css" // 字体图标样式

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import modal from './utils/modal';
Vue.prototype.$modal = modal

import mavonEditor from "mavon-editor" // md编辑器
import "mavon-editor/dist/css/index.css"
Vue.use(mavonEditor)

Vue.prototype.$EventBus = new Vue(); // 中央事件总线

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
