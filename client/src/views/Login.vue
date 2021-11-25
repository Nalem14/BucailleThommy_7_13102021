<template>
  <section>
    <h2>Connexion à votre compte Groupomania</h2>
    <p>
      Entrez vos identifiants pour vous connecter à votre compte Groupomania
    </p>

    <div
      id="error-card"
      class="message-card error-card"
      v-if="errorMessage.length > 0"
    >
      <p>{{ errorMessage }}</p>
    </div>
    <div
      id="success-card"
      class="message-card success-card"
      v-if="successMessage.length > 0"
    >
      <p>{{ successMessage }}</p>
    </div>

    <form action="#" method="post" @submit.prevent="onSubmit">
      <Input
        type="email"
        id="email"
        name="email"
        label="Email"
        placeholder="email@domain.tld"
        validate
        required
        autofocus
        v-model="userEmail"
      />
      <Input
        type="password"
        id="password"
        name="password"
        label="Mot de passe"
        placeholder="* * * * * *"
        minlength="6"
        validate
        required
        v-model="userPassword"
      />
      <Button type="submit">Me connecter</Button>
    </form>
  </section>
</template>

<script>
import PageMixin from "../mixins/Page.mixin"
import Input from "../components/Form/Input"
import Button from "../components/Form/Button"

import { mapActions } from "vuex"

export default {
  name: "Login",
  components: {
    Input,
    Button,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false);
    this.setModules([]);
  },
  data() {
    return {
      userEmail: "",
      userPassword: "",

      errorMessage: "",
      successMessage: "",

      metaDatas: {
        title: "Connexion | Groupomania",
        meta: [
          {
            name: "description",
            content: "Connexion à votre compte Groupomania",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      this.errorMessage = "";
      this.successMessage = "";

      console.log(JSON.stringify(this.$router))

      this.loginUser({
        email: this.userEmail,
        password: this.userPassword,
      })
        .then((response) => {
          console.log(JSON.stringify(response));
          this.successMessage =
            "Connexion réussi !";

          setTimeout(function() {
            this.$router.push('/')
          }.bind(this), 1000, this)
        })
        .catch((error) => {
          const errorMessage = this.handleErrorMessage(error);
          this.errorMessage = errorMessage;
        });
    },
    ...mapActions("user", { loginUser: "login" }),
  }
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
    margin: 0 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    margin-bottom: 20px;

    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      @media screen AND (min-width: 768px) {
        width: 400px;
      }
    }

    > div:last-child {
      justify-content: center;
      margin-top: 20px;
    }
  }
}
</style>
