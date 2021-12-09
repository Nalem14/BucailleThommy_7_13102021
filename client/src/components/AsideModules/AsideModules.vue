<template>
  <aside>
    <search-community v-if="shouldShowModule('SearchCommunity')" />
    <top-community v-if="shouldShowModule('TopCommunity')" />
    <profile v-if="shouldShowModule('Profile')" />
    <Footer v-if="shouldShowModule(true)" />
  </aside>
</template>

<script>
import { mapState } from "vuex";

import TopCommunity from "./Community/TopCommunity.vue";
import SearchCommunity from "./Community/SearchCommunity.vue";
import Profile from "./Profile/Profile.vue";
import Footer from "./Footer.vue";

export default {
  name: "AsideModules",
  components: {
    TopCommunity,
    SearchCommunity,
    Profile,
    Footer,
  },

  computed: {
    ...mapState([
      // map this._modulesToShow to store.state._modulesToShow
      "_modulesToShow",
      "_shouldShowModules",
    ]),
  },

  methods: {
    shouldShowModule(name = null) {
      if (name == null) {
        name = this.$options.name;
      }

      return (
        this._shouldShowModules &&
        (this._modulesToShow.length === 0 || this._modulesToShow.includes(name) || name === true)
      );
    },
  },
};
</script>

<style lang="scss">
aside {
  @media screen AND (min-width: 768px) {
    margin-left: 20px;
  }
}
</style>
