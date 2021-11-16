<template>
  <section>
    
  </section>
</template>

<script>
import PageMixin from '../mixins/Page.mixin'

export default {
  name: "Register",
  components: {
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false)
    this.setModules([]);
  },
  data() {
    return {
      metaDatas: {
        title: "Inscription | Groupomania",
        meta: [
          {
            name: "description",
            content:
              "Création d'un compte sur Groupomania",
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
