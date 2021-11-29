<template>
  <section>
    <h2>Déconnexion de votre compte.</h2>
    <p>Vous avez été déconnecté de votre compte Groupomania.</p>
  </section>
</template>

<script>
import PageMixin from "../mixins/Page.mixin";

export default {
  name: "Logout",
  mixins: [PageMixin],
  mounted() {
    this.logout().then(() => {
      setTimeout(() => {
        this.$router.push("/");
      }, 2000);
    })
    .catch(error => {
      this.$notify({
          type: "error",
          title: `Erreur lors de la déconnexion`,
          text: `Erreur reporté : ${error.message}`,
          duration: -1
        });
    })

    this.shouldShowModules(false);
    this.setModules([]);
  },
  data() {
    return {
      metaDatas: {
        title: "Déconnexion | Groupomania",
        meta: [
          {
            name: "description",
            content: "Déconnexion de votre compte Groupomania",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: 0.1px solid $border-color;
  border-radius: 5px;
  margin-top: 20px;
  background-color: $container-color;
  align-items: center;
  height: fit-content;

  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  p {
    text-align: center;
    margin: 0 20px;
  }
}
</style>
