<template>
  <footer>
    <div>
      <h2>Liens utiles</h2>
      <ul>
        <li><a href="#">Mentions légales</a></li>
        <li><a href="#">Conditions générales de ventes</a></li>
        <li><a href="mailto:contact@groupomania.tld">Nous contacter</a></li>
      </ul>
    </div>
    <p>&copy; 2021 Groupomania - Tout droit réservés</p>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
footer {
  background-color: $container-color;
  color: $font-color;
  margin-top: 40px;

  p {
    display: flex;
    justify-content: center;
  }

  div {
    margin-left: 20px;
    display: flex;
    flex-direction: column;

    @media screen AND (min-width: 1400px) {
      margin-left: 130px;
    }

    h2 {
      margin-top: 20px;
      font-size: 1.3em;
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
}
</style>
