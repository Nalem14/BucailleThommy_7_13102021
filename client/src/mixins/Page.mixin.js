import { mapMutations, mapActions } from "vuex";
import HelperMixin from './Helper.mixin'

export default {
  mixins: [
    HelperMixin
  ],
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
    ...mapMutations(["shouldShowModules", "setModules"]),
    ...mapActions("user", ["authenticate", "logout"]),
    ...mapActions("axios", {
      setAxiosAuthToken: "setAuthToken",
    }),
  },
};
