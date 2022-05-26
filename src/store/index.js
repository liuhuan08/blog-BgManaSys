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
		SET_USERINFO(state, data) {
			state.userinfo = {...data}
			local.set("blog_userinfo", state.userinfo);
		},
		GET_USERINFO(state) {
			state.userinfo = local.get("blog_userinfo") || {}
		}
	},
	actions: {
		set_userinfo({ commit }, data) {
			commit('SET_USERINFO', data)
		}
	},
	modules: {},
});
