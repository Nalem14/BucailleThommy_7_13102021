<template>
  <div>
    <h2>Sécurité du compte</h2>
    <p>
      D'ici, gérez vos données que nous enregistrons et la suppression de votre
      compte.
    </p>

    <div>
      <form action="#" method="POST" @submit.prevent="exportData">
        <h3>Exporter vos données</h3>
        <Button type="submit" success>Télécharger mes données</Button>
      </form>

      <form action="#" method="POST" @submit.prevent="deleteAccount">
        <h3>Suppression du compte</h3>
        <Input
          type="password"
          id="password"
          name="password"
          label="Indiquez votre mot de passe"
          placeholder="Entrez votre mot de passe"
          minlength="6"
          validate
        />
        <Button type="submit" danger>Supprimer mon compte</Button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"

import HelperMixin from "../../mixins/Helper.mixin";
const fileDownload = require("js-file-download");
import Button from "../Form/Button";

export default {
  name: "Security",
  mixins: [HelperMixin],
  components: {
    Button,
  },

  methods: {
    ...mapActions("user", ["logout"]),
    async exportData() {
      try {
        let response = await this.axios.get("/auth/export");
        fileDownload(
          JSON.stringify(response.data),
          "groupomania-user-export.csv"
        );
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.$notify({
          type: "error",
          title: `Erreur lors du téléchargement des données`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    async deleteAccount() {
      if (
        confirm(
          "Confirmez la suppression du compte ? Cette action est irréversible !"
        )
      ) {
        try {
          await this.axios.delete("/auth/delete", {
            data: {
              password: document.getElementById("password").value,
            },
          });
          await this.logout();

          this.$notify({
            type: "success",
            title: `Votre compte a été supprimé`,
            text: `La suppression est définitive, vos données sont désormais supprimées`,
            duration: 30000,
          });

          this.$router.push("/");
        } catch (error) {
          const errorMessage = this.handleErrorMessage(error);
          this.$notify({
            type: "error",
            title: `Erreur lors de la suppression des données`,
            text: `Erreur reporté : ${errorMessage}`,
            duration: 30000,
          });
        }
      }
    },
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
      flex-wrap: wrap;
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
