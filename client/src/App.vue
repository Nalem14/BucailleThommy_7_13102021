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
</style>
