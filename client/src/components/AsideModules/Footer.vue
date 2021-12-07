<template>
  <footer>
    <h2>Liens utiles</h2>
    <div>

      <ul>
        <li><a href="#">Mentions légales</a></li>
        <li><a href="#">Conditions générales de ventes</a></li>
        <li><a href="mailto:contact@groupomania.tld">Nous contacter</a></li>
      </ul>

      <p>&copy; 2021 Groupomania - Tout droit réservés</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterModule",
  components: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
footer {
  display: flex;
  flex-direction: column;
  border: 0.1px solid $border-color;
  background-color: $container-color;
  border-radius: 5px;
  margin-top: 20px;

  div {
    display: flex;
    flex-direction: column;
    border: 0.1px solid $border-color;
    border-radius: 5px;
    background-color: darken($container-color, 5);
    justify-content: center;
    align-items: center;
  }

  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  ul {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    margin-bottom: 20px;

    li {
      margin-top: 5px;

      a {
        color: darken($font-color, 5);
        text-decoration: none;

        &:hover {
          color: $font-color;
          font-weight: bold;
        }

        i {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
