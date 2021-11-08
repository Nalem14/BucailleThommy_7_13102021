<template>
  <main>
    <Header />
    <router-view></router-view>
    <Footer />
  </main>
</template>

<script>
import Header from "./views/partials/Header.vue";
import Footer from "./views/partials/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss">
@use "sass:math";
@import "./assets/scss/_variables.scss";
html,
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  background-color: $bg-color;
  color: $font-color;
}

main {
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;

  // H1 to H6
  @for $i from 1 through 6 {
    h#{$i} {
      font-size: (1.6em - math.div($i, 10));
      font-weight: bold;
    }
  }

  p {
    margin-top: 5px;
  }

  a {
    color: $link-color;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
