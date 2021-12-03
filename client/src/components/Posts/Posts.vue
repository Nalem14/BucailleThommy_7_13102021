<template>
  <div ref="loadingContainer" class="vld-parent">
    <h2>Liste des publications</h2>
    <Post
      v-for="post in posts"
      :key="post.id"
      v-bind="post"
      @delete-post="deletePost"
    />
    <div v-if="posts.length == 0" class="message-card error-card">
      <p>Il n'y a aucun poste à afficher.</p>
    </div>
  </div>
</template>

<script>
import Post from "./Post";
import HelperMixin from "../../mixins/Helper.mixin";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Posts",
  mixins: [HelperMixin],
  components: {
    Post,
  },
  data() {
    return {
      posts: [],
      maxPostId: 0,
      limit: 10,
    };
  },

  mounted() {
    this.fetchPosts();
    this.$watch(
      () => this.$route.params,
      () => {
        this.maxPostId = 0;
        this.fetchPosts();
      }
    );

    this.fetchNextPosts();
  },

  methods: {
    deletePost(id) {
      this.posts = this.posts.filter((p) => p.id !== id);
    },


    fetchNextPosts() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight;
        let topOfWindow = document.documentElement.scrollTop <= 0;

        if (bottomOfWindow) {
          console.log("end of page, fetching older posts");
          this.fetchPosts(true);
        }

        if (topOfWindow) {
          console.log("top of page, fetch newer posts");
          this.fetchPosts(false, true);
        }
      };
    },
    async fetchPosts(older = false, newer = false) {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let communityId = "0",
          queryParams = "",
          minPostId = 0,
          maxPostId = 0;

        if (this.$route.name === "Community")
          communityId = this.$route.params.id;
        if (this.$route.name === "Profile")
          queryParams += "&userId=" + this.$route.params.id;

        if (older) maxPostId = this.maxPostId;
        if (newer) minPostId = this.minPostId;

        let response = await this.axios(
          "/post/community/" +
            communityId +
            "?limit=" +
            this.limit +
            "&maxPostId=" +
            maxPostId +
            "&minPostId=" +
            minPostId +
            queryParams
        );

        if (older) this.posts = [...this.posts, ...response.data.data.posts];
        else if (newer)
          this.posts = [...response.data.data.posts, ...this.posts];
        else this.posts = response.data.data.posts;

        this.maxPostId = this.posts[this.posts.length - 1].id;

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement des postes`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: 0.1px solid $border-color;
  border-radius: 5px;
  margin-top: 20px;
  background-color: $container-color;

  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>
