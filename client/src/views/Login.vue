<template>
  <section>
    <h2>Connexion à votre compte Groupomania</h2>
    <p>Entrez vos identifiants pour vous connecter à votre compte Groupomania</p>

    <form action="#" method="post">
      <Input
        type="email"
        id="email"
        name="email"
        label="Email"
        placeholder="email@domain.tld"
        validate
      />
      <Input
        type="password"
        id="password"
        name="password"
        label="Mot de passe"
        placeholder="* * * * * *"
        minlength="6"
        validate
      />
      <Button>Me connecter</Button>
    </form>
  </section>
</template>

<script>
import PageMixin from "../mixins/Page.mixin";
import Input from "../components/Form/Input";
import Button from "../components/Form/Button";

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
