const User = {
  namespaced: true,

  state: () => ({
    _data: {},
    _token: null,
  }),
  mutations: {
    setData(state, payload) {
      state._data = payload;
    },
    setToken(state, payload) {
      localStorage.setItem("AUTH_TOKEN", payload)
      state._token = payload;
    },
  },
  actions: {
    async create({ rootGetters }, data) {
      try {
        return rootGetters["axios/axios"].post("/auth/signup", data);
      } catch (error) {
        console.error(error);
      }
    },
    async login({ rootGetters, commit }, data) {
      try {
        return rootGetters["axios/axios"]
          .post("/auth/login", data)
          .then((response) => {
            console.log(response)
            commit("setData", response.data.data.user);
            commit("setToken", response.data.data.token);
          });
      } catch (error) {
        console.error(error);
      }
    },
    fetchData({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("setData", {});
          resolve();
        }, 1000);
      });
    },
  },
  getters: {},
};

export default User;
