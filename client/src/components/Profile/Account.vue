<template>
  <div ref="loadingContainer" class="vld-parent">
    <h2>Paramètres du compte</h2>
    <p>
      D'ici, gérez vos informations personelles tel que votre email, le mot de
      passe.
    </p>

    <div>
      <form action="#" method="POST" @submit.prevent="updateEmail">
        <h3>Changer l'email</h3>
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          placeholder="email@domain.tld"
          v-model="userEmail"
        />
        <Button success>Changer mon email</Button>
      </form>

      <form action="#" method="POST" @submit.prevent="updatePassword">
        <h3>Changer mon mot de passe</h3>
        <Input
          type="password"
          id="old_password"
          name="old_password"
          label="Ancien mot de passe"
          placeholder="* * * * * *"
          minlength="6"
          v-model="userPassword"
        />
        <Input
          type="password"
          id="new_password"
          name="new_password"
          label="Nouveau mot de passe"
          placeholder="* * * * * *"
          minlength="6"
          v-model="userNewPassword"
        />
        <Input
          type="password"
          id="repeat_new_password"
          name="repeat_new_password"
          label="Répêtez le nouveau mot de passe"
          placeholder="* * * * * *"
          minlength="6"
          v-model="userRepeatNewPassword"
        />
        <Button success>Changer mon mot de passe</Button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HelperMixin from "../../mixins/Helper.mixin";

import Button from "../Form/Button";
import Input from "../Form/Input";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Account",
  mixins: [HelperMixin],
  components: {
    Button,
    Input,
  },

  mounted() {
    this.userEmail = this.authData.email;
  },

  data() {
    return {
      userEmail: "",

      userPassword: "",
      userNewPassword: "",
      userRepeatNewPassword: ""
    };
  },

  methods: {
    ...mapActions("user", {
      updateUserData: "updateData",
    }),
    async updateEmail() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        await this.updateUserData({
          email: this.userEmail
        });

        loader.hide();
        this.$notify({
          type: "success",
          title: `Email mis à jour`,
          text: `Votre nouvel email as bien été défini !`,
          duration: 5000,
        });
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement d'email`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
    
    async updatePassword() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        await this.updateUserData({
          oldPassword: this.userPassword,
          password: this.userNewPassword,
          confirmPassword: this.userRepeatNewPassword
        });

        loader.hide();
        this.$notify({
          type: "success",
          title: `Mot de passe mis à jour`,
          text: `Votre nouveau mot de passe as bien été défini !`,
          duration: 5000,
        });
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement de votre mot de passe`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
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
