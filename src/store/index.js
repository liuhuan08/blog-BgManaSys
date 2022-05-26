import Vue from "vue";
import Vuex from "vuex";

import local from "../utils/local"

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		isCollapse: false,
		userinfo: {}
	},
	mutations: {
		// 保存个人信息
		SET_USERINFO(state, params) {
			state.userinfo = {...params}
			local.set("blog_userinfo", state.userinfo);
		},
		// 更新个人信息
		GET_USERINFO(state) {
			state.userinfo = local.get("blog_userinfo") || {}
		}
	},
	actions: {
		// 保存个人信息
		set_userinfo({ commit }, params) {
			commit('SET_USERINFO', params)
		}
	},
	modules: {},
});
