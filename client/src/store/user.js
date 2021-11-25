const User = {
  namespaced: true,

  state: () => ({
    _data: null,
    _token: null,
  }),

  mutations: {
    setData(state, payload) {
      state._data = payload
    },
    setToken(state, payload) {
      localStorage.setItem("AUTH_TOKEN", payload);
      state._token = payload
    },
  },

  actions: {
    async create({ rootGetters }, data) {
      try {
        return rootGetters["axios/axios"].post("/auth/signup", data)
      } catch (error) {
        console.error(error)
      }
    },
    async login({ rootGetters, dispatch }, data) {
      try {
        return rootGetters["axios/axios"]
          .post("/auth/login", data)
          .then((response) => {
            dispatch("authenticate", response.data.data.token)
          })
      } catch (error) {
        console.error(error)
      }
    },
    async authenticate({ commit, dispatch }, token) {
      return new Promise((resolve) => {
        commit("setToken", token)

        dispatch('axios/setAuthToken', token, { root: true }).then(() => {
          dispatch("fetchData").then((response) => {
            commit("setData", response.data.data.user)
            resolve()
          })
        })
      })
    },
    async fetchData({ rootGetters }) {
      try {
        return rootGetters["axios/axios"].get("/auth/read")
      } catch (error) {
        console.error(error)
      }
    },
  },

  getters: {
    isAuthenticated(state) {
      return state._token !== null && state._data !== null
    },
    hasToken(state) {
      if (!state._token) {
        const savedToken = localStorage.getItem("AUTH_TOKEN")
        if (savedToken) state._token = savedToken;
      }

      return state._token !== null
    },
  },
};

export default User;
