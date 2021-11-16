<template>
  <div>
    <h2>Sécurité du compte</h2>
    <p>
      D'ici, gérez vos données que nous enregistrons et la suppression de votre
      compte.
    </p>

    <div>
      <form action="#" method="POST">
        <h3>Voir les données enregistrées</h3>
        <Button>Accéder aux données</Button>
      </form>

      <form action="#" method="POST">
        <h3>Exporter vos données</h3>
        <Button success>Télécharger mes données</Button>
      </form>

      <form action="#" method="POST">
        <h3>Suppression du compte</h3>
        <Button danger>Supprimer mon compte</Button>
      </form>
    </div>
  </div>
</template>

<script>
import Button from "../Form/Button";

export default {
  name: "Security",
  components: {
    Button,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  p {
    margin-bottom: 40px;
  }

  > div {
    display: flex;
    flex-direction: column;

    @media screen AND (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
    form {
      margin-top: 80px;

      h3 {
        margin-bottom: 20px;
      }

      div {
        display: flex;
        flex-basis: 100%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 10px;

        @media screen AND (min-width: 768px) {
          flex-direction: row;
          align-items: center;
          width: 400px;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
