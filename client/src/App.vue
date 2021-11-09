<template>
  <div>
    <Header />
    <main>
      <div>
        <h2 style="margin-top: 20px;">modules</h2>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </main>
    <Footer />
  </div>
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
  display: flex;
  flex-direction: column;

  @media screen AND (min-width: 768px) {
    flex-direction: row-reverse;
    > div:first-child {
      flex-basis: 30%;
    }
    > div:last-child {
      flex-basis: 70%;
    }
  }

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
