import { mapMutations, mapGetters, mapActions, mapState } from "vuex";

export default {
  beforeMount() {
    this.axios;

    if (!this.isAuthenticated) {
      if (this.hasToken) {
        this.authenticate(this.authToken)
          .then(() => {
            if(this.$route.query.redirect) {
              this.$router.push(this.$route.query.redirect)
            }
          })
          .catch((error) => {
            if (error.toJSON().status === 401) {
              console.warn("logout", error);
              this.logout().then(() => console.log("logged-out"));
            }
          });
      }
    }
  },
  mounted() {
    if (this.$route.hash.length > 0)
      setTimeout(() => this.scrollFix(this.$route.hash), 1);
  },

  methods: {
    scrollFix: function (hashbang) {
      if (hashbang.length > 0) location.href = hashbang;
    },
    handleErrorMessage(error) {
      let errorToShow =
        "Erreur inconnu lors du traitement d'une requête vers l'API.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        if ("errorMessage" in error.response.data)
          errorToShow = error.response.data.errorMessage;
        else if ("error" in error.response.data)
          errorToShow = error.response.data.error;
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        errorToShow =
          "Pas de réponse lors du traitement d'une requête vers l'API.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        errorToShow = "Impossible d'effectuer une requête vers l'API.";
      }
      console.log(error.config);

      return errorToShow;
    },
    ...mapMutations(["shouldShowModules", "setModules"]),
    ...mapActions("user", ["authenticate", "logout"]),
    ...mapActions("user", {
      fetchUserData: 'fetchData',
      fetchUserProfile: 'fetchProfile'
    }),
    ...mapActions("axios", {
      setAxiosAuthToken: "setAuthToken",
    }),
  },

  computed: {
    ...mapGetters("axios", ["axios"]),
    ...mapGetters("user", ["isAuthenticated", "hasToken"]),
    ...mapState("user", {
      authToken: "_token",
      userData: "_data",
    }),
  },
};
