<template>
  <section>
    <Posts />
  </section>
</template>

<script>
import Posts from "../components/Posts/Posts"
import PageMixin from '../mixins/Page.mixin'

export default {
  name: "Home",
  components: {
    Posts,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true)
    this.setModules(["TopCommunity"]);
  },
  data() {
    return {
      metaDatas: {
        title: "Fil d'actualité | Groupomania",
        meta: [
          {
            name: "description",
            content:
              "Liste des postes regroupant les communautés les plus populaires",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
