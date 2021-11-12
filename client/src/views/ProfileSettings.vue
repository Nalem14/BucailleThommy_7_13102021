<template>
  <section>
      coucou
  </section>
</template>

<script>
import PageMixin from '../mixins/Page.mixin'

export default {
  name: "ProfileSettings",
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false)
  },
  data() {
    return {
      metaDatas: {
        title: "Configuration du compte",
        meta: [
          {
            name: "description",
            content:
              "Gestion de votre compte",
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
