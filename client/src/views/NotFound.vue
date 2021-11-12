<template>
  <section>
    <h2>Erreur 404 - Page introuvable</h2>
    <p>La page que vous tentez d'atteindre est introuvable.</p>
  </section>
</template>

<script>
import PageMixin from '../mixins/Page.mixin'

export default {
  name: "NotFound",
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false)
  },
  data() {
    return {
      metaDatas: {
        title: "Erreur 404 - Page introuvable",
        meta: [
          {
            name: "description",
            content:
              "La page que vous tentez d'atteindre est introuvable",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
section {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}
</style>
