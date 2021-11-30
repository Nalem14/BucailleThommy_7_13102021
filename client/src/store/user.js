const User = {
  namespaced: true,

  state: () => ({
    _data: null,
    _token: null,
  }),

  mutations: {
    setData(state, payload) {
      state._data = payload;
    },
    setToken(state, payload) {
      if (payload === null) localStorage.removeItem("AUTH_TOKEN");
      else localStorage.setItem("AUTH_TOKEN", payload);

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
    async login({ rootGetters, dispatch }, data) {
      try {
        return rootGetters["axios/axios"]
          .post("/auth/login", data)
          .then((response) => {
            dispatch("authenticate", response.data.data.token);
          });
      } catch (error) {
        console.error(error);
      }
    },
    async logout({ commit }) {
      return new Promise((resolve) => {
        commit("setData", null);
        commit("setToken", null);
        resolve();
      });
    },

    async authenticate({ commit, dispatch }, token) {
      return new Promise((resolve, reject) => {
        commit("setToken", token);

        dispatch("axios/setAuthToken", token, { root: true }).then(() => {
          dispatch("fetchData")
            .then((response) => {
              commit("setData", response.data.data.user);
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
    },
    

    async fetchData({ rootGetters }) {
      try {
        return rootGetters["axios/axios"].get("/auth/read");
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSetData({ dispatch, commit }) {
      return dispatch("fetchData").then(response => {
        commit("setData", response.data.data.user)
      })
      .catch(error => {
        console.error(error)
      })
    },

    async updateData({ rootGetters }, data) {
      try {
        return rootGetters["axios/axios"].put("/auth/update", data);
      } catch (error) {
        console.error(error);
      }
    },


    async fetchProfile({ rootGetters }, id) {
      try {
        return rootGetters["axios/axios"].get(`/user/${id}`);
      } catch (error) {
        console.error(error);
      }
    },
    isFollowingUser({ getters }, user) {
      if(getters.isAuthenticated) {
        getters.user.Followers.forEach((elem) => {
          if(elem.FollowerId === getters.user.id && elem.UserId === user)
            return true;
        })
      }

      return false;
    },
    isFollowedByUser({ getters }, user) {
      if(getters.isAuthenticated) {
        getters.user.Followers.forEach((elem) => {
          if(elem.FollowerId === user && elem.UserId === getters.user.id)
            return true;
        })
      }

      return false;
    },
    isFollowingCommunity({ getters }, community) {
      if(getters.isAuthenticated) {
        getters.user.Followers.forEach((elem) => {
          if(elem.FollowerId === getters.user.id && elem.CommunityId === community)
            return true;
        })
      }

      return false;
    }
  },

  getters: {
    isAuthenticated(state) {
      return state._token !== null && state._data !== null;
    },
    hasToken(state) {
      if (!state._token) {
        const savedToken = localStorage.getItem("AUTH_TOKEN");
        if (savedToken) state._token = savedToken;
      }

      return state._token !== null;
    },
    user(state) {
      return state._data !== null ? state._data : false;
    }
  },
};

export default User;
