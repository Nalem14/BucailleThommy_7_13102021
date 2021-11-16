<template>
  <div>
    <h2>Personnalisation du profil</h2>
    <p>
      D'ici, gérez vos informations publique tel que votre avatar, votre
      description.
    </p>

    <div>
      <form action="#" method="POST" enctype="multipart/form-data">
        <h3>Changer mon avatar</h3>
        <figure>
          <img src="https://i.pravatar.cc/300" alt="Avatar de John" />
        </figure>
        <Input type="file" id="avatar" name="avatar" label="Avatar" />
        <Button success>Changer mon avatar</Button>
      </form>

      <form action="#" method="POST">
        <h3>À propos de vous</h3>
        <div>
          <textarea
            name="about"
            id="about"
            rows="10"
            placeholder="Parlez-nous de vous..."
          ></textarea>
        </div>

        <Button success>Changer ma description</Button>
      </form>
    </div>
  </div>
</template>

<script>
import Button from "../Form/Button";
import Input from "../Form/Input";

export default {
  name: "Profile",
  components: {
    Button,
    Input,
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

      figure {
        display: flex;
        margin-top: 20px;

        img {
          width: 120px;
          height: auto;
          border: 3px solid $color-secondary;
          border-radius: 50%;
        }
      }

      textarea {
        width: 100%;
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
