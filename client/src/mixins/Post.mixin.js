import { mapMutations, mapActions } from "vuex";
import HelperMixin from "./Helper.mixin";

export default {
  mixins: [HelperMixin],

  methods: {
    like(postId) {
      try {
        await this.axios.post("/post/" + postId + "/like");
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du chargement du profil de ${this.$route.params.name}`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
  },
};
