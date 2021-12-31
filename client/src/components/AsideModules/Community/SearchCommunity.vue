<template>
  <div class="vld-parent" ref="loadingContainer">
    <h2>Rechercher une Communauté</h2>
    <Input v-model="search" type="search" id="search-community" placeholder="Rechercher une communauté" @input="fetchCommunities" />
    <top-community-item
      v-for="community in communities"
      :key="community.id"
      v-bind="community"
    />
  </div>
</template>

<script>
import TopCommunityItem from "./TopCommunityItem.vue";
import HelperMixin from "../../../mixins/Helper.mixin";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

import Input from "../../Form/Input.vue";

export default {
  name: "SearchCommunity",
  components: {
    TopCommunityItem,
    Input,
  },
  mixins: [HelperMixin],
  data() {
    return {
      communities: [],
      search: "",
    };
  },

  methods: {
    async fetchCommunities() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let request = await this.axios.get(
          "/community?limit=5&search=" + this.search
        );
        this.communities = request.data.data.communities;
        if (this.search.length > 0) {
          this.communities.unshift({
            id: 0,
            title: "Créer " + this.search,
            slug: this.slugify(this.search),
            postCount: null,
            userCount: null,
          });
        }

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);
        this.communities = [];
        if (this.search.length > 0) {
          this.communities.unshift({
            id: 0,
            title: "Créer " + this.search,
            slug: this.slugify(this.search),
            postCount: null,
            userCount: null,
          });
        }

        this.$notify({
          type: "error",
          title: `Erreur lors de la recherche d'une communauté`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  border: 0.1px solid $border-color;
  background-color: $container-color;
  border-radius: 5px;
  margin-top: 20px;

  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>
