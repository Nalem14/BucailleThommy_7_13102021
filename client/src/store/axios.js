const AXIOS = require("axios").default;

const Axios = {
  namespaced: true,

  state: () => ({
    instance: null,
  }),
  getters: {
    axios(state) {
      if (state.instance !== null) return state.instance;

      const instance = AXIOS.create({
        baseURL: process.env.VUE_APP_BASE_API_URI,
        timeout: 3000,
      });

      state.instance = instance;
      return state.instance;
    },
  },
  mutations: {
    setAuthToken(state, payload) {
      state.instance.defaults.headers.common["Authorization"] =
        "Bearer " + payload;
    },
  },
  actions: {
    async setAuthToken({ commit }) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("AUTH_TOKEN");
        if (token !== null) {
          commit("setAuthToken", token);
          resolve();
        } else {
          reject();
        }
      });
    },
  },
};

export default Axios;
