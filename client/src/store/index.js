import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      _shouldShowModules: false,
    };
  },
  mutations: {
    shouldShowModules(state, payload) {
      state._shouldShowModules = payload;
    },
  },
});

export default store