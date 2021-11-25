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
  },
  actions: {
    async create({ rootGetters }, data) {
      try {
        return rootGetters['axios/axios'].post('/auth/signup', data)
      }
      catch(error) {
        console.error(error)
      }
    },
    fetchData({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("setData", {});
          resolve();
        }, 1000);
      });
    }
  },
  getters: {},
};

export default User;
