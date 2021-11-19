import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/css/normalize.css"; // 重置样式表

import "./assets/iconfonts/iconfont.css" // 字体图标样式

import Msg from "./utils/msg";
Vue.use(Msg)

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
