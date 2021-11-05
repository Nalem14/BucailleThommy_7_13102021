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
    Post
  },
  data() {
    return {
      test: "tst",
      posts: [
        {
          id: 1,
          title: "Test",
          content: "Mon contenu"
        },
        {
          id: 2,
          title: "Test",
          content: "Mon contenu"
        },
        {
          id: 3,
          title: "Test",
          content: "Mon contenu"
        },
      ]
    };
  },
  created() {
    console.log("posts", this.posts)
    console.log("test", this.test)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
