<template>
  <article>
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
  </article>
</template>

<script>
export default {
  name: "Post",
  props: {
      id: Number,
      title: String,
      content: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
