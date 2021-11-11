<template>
  <div>
    <Header />
    <main>
      <!-- <aside> modules -->
      <aside-modules v-if="_shouldShowModules" />

      <!-- <section> page content -->
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<script>
import { mapState } from "vuex";

import Header from "./views/partials/Header";
import Footer from "./views/partials/Footer";
import AsideModules from "./components/AsideModules/AsideModules";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    AsideModules,
  },
  computed: {
    ...mapState([
      // map this._shouldShowModules to store.state._shouldShowModules
      "_shouldShowModules",
    ])
  }
};
</script>

<style lang="scss">
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
    > aside {
      flex-basis: 50%;
    }
    > section {
      flex-basis: 100%;
    }
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
  transition: color 0.2s ease-in-out;

  &:hover {
    transition: color 0.4s ease-in-out;
    color: $font-color;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
