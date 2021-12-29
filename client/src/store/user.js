import SocketioService from "../services/socketio.service.js";

const User = {
  namespaced: true,

  state: () => ({
    _data: null,
    _token: null,
    _io: SocketioService,

    _searchList: [],
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
    setSearchList(state, payload) {
      state._searchList = payload;
    },
  },

  actions: {
    // Create account
    async create({ rootGetters }, data) {
      try {
        return rootGetters["axios/axios"].post("/auth/signup", data);
      } catch (error) {
        console.error(error);
      }
    },
    // Login request to account
    async login({ rootGetters, dispatch }, data) {
      try {
        // Send login request to API with email and password in data object
        return rootGetters["axios/axios"]
          .post("/auth/login", data)
          .then((response) => {
            // Authenticate with token received
            dispatch("authenticate", response.data.data.token);
          });
      } catch (error) {
        console.error(error);
      }
    },
    // Disconnect a user
    async logout({ commit }) {
      return new Promise((resolve) => {
        // Disconnect socketIO
        SocketioService.disconnect();

        // Empty user data and token
        commit("setData", null);
        commit("setToken", null);
        resolve();
      });
    },

    // Authenticate user with token
    async authenticate({ commit, dispatch }, token) {
      return new Promise((resolve, reject) => {
        // Save user token
        commit("setToken", token);

        // Init socket IO
        SocketioService.setupSocketConnection(token);

        // Set token on axios
        dispatch("axios/setAuthToken", token, { root: true }).then(() => {
          // Get user data
          dispatch("fetchData")
            .then((response) => {
              // Save user data
              commit("setData", response.data.data.user);
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        });
      });
    },

    // Fetch user data
    async fetchData({ rootGetters }) {
      try {
        // Get user data on API
        return rootGetters["axios/axios"].get("/auth/read");
      } catch (error) {
        console.error(error);
      }
    },
    // Fetch and Set user data
    async fetchSetData({ dispatch, commit }) {
      // Get user data on API
      return dispatch("fetchData")
        .then((response) => {
          // Set user data
          commit("setData", response.data.data.user);
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // Update user
    async updateData({ rootGetters }, data) {
      try {
        // Update user data with new data specified
        return rootGetters["axios/axios"].put("/auth/update", data);
      } catch (error) {
        console.error(error);
      }
    },

    // Get public user profile by id
    async fetchProfile({ rootGetters }, id) {
      try {
        return rootGetters["axios/axios"].get(`/user/${id}`);
      } catch (error) {
        console.error(error);
      }
    },
    // Search users by search query
    async searchUserList({ rootGetters, commit }, val) {
      try {
        let response = await rootGetters["axios/axios"].get(
          "/user?search=" + val
        );

        commit("setSearchList", response.data.data.users);
      } catch (error) {
        console.error(error);
      }
    },

    // Follow an user by id
    async followUser({ dispatch, rootGetters, getters }, userId) {
      if (getters.isAuthenticated) {
        await rootGetters["axios/axios"].post(`/user/${userId}/follow`);
        await dispatch("fetchSetData");
      }
    },
    // Unfollow a user by id
    async unfollowUser({ dispatch, rootGetters, getters }, userId) {
      if (getters.isAuthenticated) {
        await rootGetters["axios/axios"].delete(`/user/${userId}/unfollow`);
        await dispatch("fetchSetData");
      }
    },

    // Follow a community by id
    async followCommunity({ dispatch, rootGetters, getters }, communityId) {
      if (getters.isAuthenticated) {
        await rootGetters["axios/axios"].post(
          `/community/${communityId}/follow`
        );
        await dispatch("fetchSetData");
      }
    },
    // Unfollow a community by id
    async unfollowCommunity({ dispatch, rootGetters, getters }, communityId) {
      if (getters.isAuthenticated) {
        await rootGetters["axios/axios"].delete(
          `/community/${communityId}/unfollow`
        );
        await dispatch("fetchSetData");
      }
    },
  },

  getters: {
    // Get the property returned by the search in the input
    getSearchName: () =>  (item) => {
      return item.username;
    },

    isAuthenticated(state) {
      return state._token !== null && state._data !== null;
    },
    isSuperAdmin(state, getters) {
      return getters.isAuthenticated && state._data.isAdmin === true;
    },
    // Check has token saved in local storage or in state
    hasToken(state) {
      if (!state._token) {
        const savedToken = localStorage.getItem("AUTH_TOKEN");
        if (savedToken) state._token = savedToken;
      }

      return state._token !== null;
    },
    // Return current user data in state
    user(state) {
      return state._data !== null ? state._data : false;
    },
    // Get socket io instance
    socket(state) {
      return state._socket !== null ? state._socket : false;
    },

    // Check if current user is following a specific user
    isFollowingUser: (state, getters) => (user) => {
      if (getters.isAuthenticated) {
        for (let i = 0; i < getters.user.Followers.length; i++) {
          let elem = getters.user.Followers[i];
          if (elem.FollowerId === getters.user.id && elem.UserId === user) {
            return true;
          }
        }
      }

      return false;
    },
    // Check if current user is followed by specific user
    isFollowedByUser: (state, getters) => (user) => {
      if (getters.isAuthenticated) {
        for (let i = 0; i < getters.user.Followers.length; i++) {
          let elem = getters.user.Followers[i];
          if (elem.FollowerId === user && elem.UserId === getters.user.id)
            return true;
        }
      }

      return false;
    },
    // Check if current user is following a specific community
    isFollowingCommunity: (state, getters) => (community) => {
      if (getters.isAuthenticated) {
        for (let i = 0; i < getters.user.Followers.length; i++) {
          let elem = getters.user.Followers[i];
          if (
            elem.FollowerId === getters.user.id &&
            elem.CommunityId === community
          )
            return true;
        }
      }

      return false;
    },

    // Check if current user is moderator
    isCommunityModerator: (state, getters) => (communityModerators) => {
      if (getters.isAuthenticated) {
        let moderator = communityModerators.filter(
          (m) => m.UserId === getters.user.id
        );
        return moderator !== null && moderator.length > 0;
      }

      return false;
    },
    // Check if current user is admin
    isCommunityAdmin: (state, getters) => (communityModerators) => {
      if (getters.isAuthenticated) {
        let admin = communityModerators.filter(
          (m) => m.UserId === getters.user.id && m.isAdmin === true
        );
        return admin !== null && admin.length > 0;
      }

      return false;
    },
  },
};

export default User;
