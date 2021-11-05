<template>
  <section>
    <h2>Liste des postes</h2>
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
          content: "Mon contenu",
          likes: 12,
          comments: 4,
          createdAt: "2021-11-05 23:22:00",
          updatedAt: "2021-11-05 23:22:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Actualitée",
            slug: "actualitee",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
