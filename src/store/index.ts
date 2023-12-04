import { createStore } from 'vuex'
import local from '@/utils/local';

export default createStore({
  state: {
    isCollapse: false
  },
  getters: {
  },
  mutations: {
    TOGGLECOLLAPSE(state) {
      let local_isCollapse = local.get('isCollapse') || false;
      state.isCollapse = local_isCollapse;
      state.isCollapse = !state.isCollapse;
      local.set('isCollapse', state.isCollapse);
    }
  },
  actions: {
    toggleCollapse({ commit }) {
      commit('TOGGLECOLLAPSE')
    }
  },
  modules: {
  }
})
