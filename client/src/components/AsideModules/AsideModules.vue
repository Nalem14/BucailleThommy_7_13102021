<template>
  <aside>
    <top-community v-if="shouldShowModule('TopCommunity')" />
    <profile v-if="shouldShowModule('Profile')" />
  </aside>
</template>

<script>
import { mapState } from "vuex";

import TopCommunity from "./TopCommunity/TopCommunity.vue"
import Profile from './Profile/Profile.vue'

export default {
  name: "AsideModules",
  components: {
    TopCommunity,
    Profile
  },

  computed: {
    ...mapState([
      // map this._modulesToShow to store.state._modulesToShow
      "_modulesToShow",
    ]),
  },

  methods: {
    shouldShowModule(name = null) {
      if (name == null) {
        name = this.$options.name;
      }

      return (
        this._modulesToShow.length === 0 || this._modulesToShow.includes(name)
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
