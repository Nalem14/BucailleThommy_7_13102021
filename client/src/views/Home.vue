<template>
  <main>
    <h2>Home</h2>
    <Posts />
  </main>
</template>

<script>
import Posts from "../components/Posts";

export default {
  name: "Home",
  components: {
    Posts,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
