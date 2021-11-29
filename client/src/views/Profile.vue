<template>
  <section>
    <Posts />
  </section>
</template>

<script>

import Posts from "../components/Posts/Posts.vue"
import PageMixin from "../mixins/Page.mixin"

export default {
  name: "Profile",
  components: {
    Posts,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true);
    this.setModules(["Profile"]);
  },
  data() {
    return {
      user: null,

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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
