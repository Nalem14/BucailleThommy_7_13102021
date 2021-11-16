<template>
  <div>
    <h2>Paramètres du compte</h2>
    <p>
      D'ici, gérez vos informations personelles tel que votre email, le mot de
      passe.
    </p>

    <div>
      <form action="#" method="POST">
        <h3>Changer l'email</h3>
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          placeholder="email@domain.tld"
          validate
        />
        <Button success>Changer mon email</Button>
      </form>

      <form action="#" method="POST">
        <h3>Changer mon mot de passe</h3>
        <Input
          type="password"
          id="old_password"
          name="old_password"
          label="Ancien mot de passe"
          placeholder="* * * * * *"
          minlength="6"
          validate
        />
        <Input
          type="password"
          id="new_password"
          name="new_password"
          label="Nouveau mot de passe"
          placeholder="* * * * * *"
          minlength="6"
          validate
        />
        <Input
          type="password"
          id="repeat_new_password"
          name="repeat_new_password"
          label="Répêtez le nouveau mot de passe"
          placeholder="* * * * * *"
          minlength="6"
          validate
        />
        <Button success>Changer mon mot de passe</Button>
      </form>
    </div>
  </div>
</template>

<script>
import Button from "../Form/Button";
import Input from "../Form/Input";

export default {
  name: "Account",
  components: {
    Button,
    Input
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
