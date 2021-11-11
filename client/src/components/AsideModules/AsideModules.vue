<template>
  <aside>
    <top-community />
  </aside>
</template>

<script>
import TopCommunity from "./TopCommunity.vue";

export default {
  name: "AsideModules",
  components: {
    TopCommunity,
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
