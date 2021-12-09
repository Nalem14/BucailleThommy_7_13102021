<template>
  <div>
    <h3>A propos</h3>
    <p>{{ about }}</p>
  </div>
</template>

<script>
export default {
  name: "AboutCommunity",
  props: {
    about: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
