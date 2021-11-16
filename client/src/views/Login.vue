<template>
  <section>
    <h3>Connexion à votre compte Groupomania</h3>

    <form action="#" method="post">
        <Input type="email" id="email" name="email" label="Email" placeholder="email@domain.tld" validate/>
        <Input type="password" id="password" name="password" label="Mot de passe" placeholder="* * * * * *" minlength="6" validate/>
        <Button>Me connecter</Button>
    </form>
  </section>
</template>

<script>
import PageMixin from '../mixins/Page.mixin'
import Input from '../components/Form/Input'
import Button from '../components/Form/Button'

export default {
  name: "Login",
  components: {
      Input,
      Button
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false)
    this.setModules([]);
  },
  data() {
    return {
      metaDatas: {
        title: "Connexion | Groupomania",
        meta: [
          {
            name: "description",
            content:
              "Connexion à votre compte Groupomania",
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
