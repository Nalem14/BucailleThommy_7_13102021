<template>
  <aside>
    <top-community />
    <profile />
  </aside>
</template>

<script>
import TopCommunity from "./TopCommunity/TopCommunity.vue"
import Profile from './Profile/Profile.vue'

export default {
  name: "AsideModules",
  components: {
    TopCommunity,
    Profile
  }
};
</script>

<style lang="scss">
aside {
  @media screen AND (min-width: 768px) {
    margin-left: 20px;
  }
}
</style>
