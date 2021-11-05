<template>
  <section>
    <Post v-for="post in posts" :key="post.id" v-bind="post" />
  </section>
</template>

<script>
import Post from "./Post";

export default {
  name: "Posts",
  components: {
    Post,
  },
  datas() {
    return {
      posts: [
        {
          id: 1,
          title: "Test",
          content: "Mon contenu",
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
