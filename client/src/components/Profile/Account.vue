<template>
  <div>
    <h2>Paramètres du compte</h2>
    <p>
      D'ici, gérez vos informations personelles tel que votre email, le mot de
      passe.
    </p>

    <form action="#" method="POST">
      <h3>Changer l'email</h3>
      <div>
        <label for="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Ex: email@domain.tld"
        />
      </div>

      <Button success>Changer mon email</Button>
    </form>

    <form action="#" method="POST">
      <h3>Changer mon mot de passe</h3>
      <div>
        <label for="old_password">Ancien mot de passe</label>
        <input type="password" id="old_password" name="old_password" />
      </div>

      <div>
        <label for="new_password">Nouveau mot de passe</label>
        <input type="password" id="new_password" name="new_password" />
      </div>

      <div>
        <label for="repeat_new_password">Répêtez le nouveau mot de passe</label>
        <input
          type="password"
          id="repeat_new_password"
          name="repeat_new_password"
        />
      </div>

      <Button success>Changer mon mot de passe</Button>
    </form>

    <form action="#" method="POST">
      <h3>Suppression du compte</h3>
      <Button danger>Supprimer mon compte</Button>
    </form>
  </div>
</template>

<script>
import Button from "../Button";

export default {
  name: "Account",
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

      label {
        color: lighten($font-color, 20);
        margin-bottom: 10px;
      }

      input {
        height: 30px;
        border: 1px solid $color-secondary;
        border-radius: 15px;
        padding: 0 10px;
      }
    }
  }
}
</style>
