<template>
  <section>
    <Posts />
  </section>
</template>

<script>
import Posts from "../components/Posts";

export default {
  name: "Home",
  components: {
    Posts,
  },
  data() {
    return {
      metaDatas: {
        title: "Accueil",
        meta: [
          {
            name: "description",
            content:
              "Réseau social regroupant les employés de l'entreprise Groupomania",
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
