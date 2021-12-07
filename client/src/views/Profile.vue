<template>
<tabs :options="{ useUrlFragment: false }">
    <tab name="Publications">
      <Posts />
    </tab>
    <tab v-if="canShowFavorites" name="Favoris">
      <Posts favorite />
    </tab>
  </tabs>
</template>

<script>

import Posts from "../components/Posts/Posts.vue"
import PageMixin from "../mixins/Page.mixin"

import { Tabs, Tab } from "vue3-tabs-component"

export default {
  name: "Profile",
  components: {
    Posts,
    Tabs,
    Tab,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true);
    this.setModules(["Profile"]);

  },
  data() {
    return {
      metaDatas: {
        title: `Profile de ${this.$route.params.name} | Groupomania`,
        meta: [
          {
            name: "description",
            content: `Profile utilisateur de ${this.$route.params.name}`,
          },
        ],
      },
    };
  },

  computed: {
    canShowFavorites() {
      return this.isAuthenticated && this.authData.id === parseInt(this.$route.params.id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
