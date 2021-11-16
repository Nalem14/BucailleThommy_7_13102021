import { createStore } from "vuex"
import User from './user'

const store = createStore({
  modules: {
    user: User,
  },

  state() {
    return {
      // Aside modules
      _shouldShowModules: false,
      _modulesToShow: [],
    };
  },
  mutations: {
    // Aside modules
    shouldShowModules(state, payload) {
      state._shouldShowModules = payload
    },
    setModules(state, payload) {
      state._modulesToShow = payload
    },
  },
});

export default store