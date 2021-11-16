const User = {
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
