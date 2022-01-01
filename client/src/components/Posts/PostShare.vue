<template>
  <div class="share-form" v-if="showForm">
    <form action="#" method="post">
      <h3>Partager ce poste</h3>
      <p>
        Rechercher une communauté puis Validez pour partager ce poste dans une
        communauté.
      </p>
      <Autocomplete
        @input="getList"
        :results="communities"
        @onSelect="sharePost"
        :display-item="getName"
        placeholder="Recherhez une communauté..."
      ></Autocomplete>
      <Button type="button" danger @click="this.$emit('close-share-form')"
        >Annuler</Button
      >
    </form>
  </div>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";
import Button from "../Form/Button.vue";

import Autocomplete from "vue3-autocomplete";
import "vue3-autocomplete/dist/vue3-autocomplete.css";

export default {
  name: "PostShare",
  mixins: [HelperMixin],
  emits: ["close-share-form"],
  components: {
    Button,
    Autocomplete,
  },
  props: {
    id: Number,
    showForm: Boolean,
  },

  data() {
    return {
      communities: [],
    };
  },

  methods: {
    // Share a post
    async sharePost(item) {
      if (
        !confirm(
          "Êtes-vous sûr de vouloir partager ce poste dans la communauté " +
            item.title +
            " ?"
        )
      )
        return;
        
      try {
        // Post the shared post
        await this.axios.post("/post", {
          title: "shared-post-title",
          content: "shared-post-content",
          communityId: item.id,
          shareFromPostId: this.id,
        });

        this.$notify({
          type: "success",
          title: `Poste partagé !`,
          text: `Le poste a été partagé dans la communauté spécifié.`,
          duration: 5000,
        });

        // Emit to parent component
        this.$emit("close-share-form");
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.$notify({
          type: "error",
          title: `Erreur lors du partage du poste.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 15000,
        });
      }
    },

    getName(item) {
      return item.title;
    },
    // Get the list of communities
    async getList($e) {
      try {
        let response = await this.axios.get("/community?search=" + $e);
        this.communities = response.data.data.communities;
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.communities = [];
        this.$notify({
          type: "error",
          title: `Erreur lors de la recherche d'une communauté.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 15000,
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
:deep(.vue3-autocomplete-container) {
  position: relative;
}
.share-form {
  position: fixed;
  width: 500px;
  height: 200px;
  margin: 5% auto; /* Will not center vertically and won't work in IE6/7. */
  left: 0;
  right: 0;
  z-index: 10;
  background-color: $bg-color;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  form {
    margin: 20px;
  }

  h3 {
    text-align: center;
    margin: 20px;
  }
}
</style>