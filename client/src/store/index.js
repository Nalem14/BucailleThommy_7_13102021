import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      _shouldShowModules: false,
      _modulesToShow: []
    };
  },
  mutations: {
    shouldShowModules(state, payload) {
      state._shouldShowModules = payload
    },
    setModules(state, payload) {
      state._modulesToShow = payload
    }
  },
});

export default store