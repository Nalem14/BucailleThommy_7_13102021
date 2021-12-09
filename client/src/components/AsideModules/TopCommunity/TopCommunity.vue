<template>
  <div class="vld-parent" ref="loadingContainer">
    <h2>Top Communauté</h2>
    <top-community-item
      v-for="community in communities"
      :key="community.id"
      v-bind="community"
    />
  </div>
</template>

<script>
import TopCommunityItem from "../TopCommunity/TopCommunityItem.vue";
import HelperMixin from "../../../mixins/Helper.mixin";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "TopCommunity",
  components: {
    TopCommunityItem,
  },
  mixins: [HelperMixin],
  data() {
    return {
      communities: [],
    };
  },
  mounted() {
    this.fetchCommunities();
  },

  methods: {
    async fetchCommunities() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let request = await this.axios.get("/community?limit=5");
        this.communities = request.data.data.communities;

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du chargement des Top communautés`,
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
