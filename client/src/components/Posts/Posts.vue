<template>
  <div ref="loadingContainer" class="vld-parent">
    <h2>Liste des publications</h2>
    <Post
      v-for="post in posts"
      :key="post.id"
      v-bind="post"
      @delete-post="deletePost"
      @delete-image="deleteImage"
      :editMode="false"
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

  props: {
    fetchNewPost: Boolean,
    favorite: Boolean,
  },
  data() {
    return {
      posts: [],
      maxPostId: 0,
      minPostId: 0,
      limit: 10,

      watcher: null,
      watcher2: null,

      currentRoute: null,
    };
  },

  mounted() {
    this.fetchPosts();
    this.fetchNextPosts();
    this.currentRoute = this.$route.name;

    this.watcher = this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.name !== this.currentRoute) return;
        this.posts = [];
        this.maxPostId = 0;
        this.minPostId = 0;
        this.fetchPosts();
      }
    );

    this.watcher2 = this.$watch(
      () => this.fetchNewPost,
      () => {
        if (this.$route.name !== this.currentRoute) return;
        this.fetchPosts(false, true);
      }
    );
  },
  unmounted() {
    if (this.watcher) this.watcher();
    if (this.watcher2) this.watcher2();
  },

  methods: {
    deletePost(postId) {
      // ...Logic handled by PostFooter.vue
      this.posts = this.posts.filter((p) => p.id !== postId);
    },
    deleteImage({ postId, fileId }) {
      // ...Logic handled by PostFiles.vue
      this.posts.map((post) => {
        if (post.id === postId) {
          post.PostFiles = post.PostFiles.filter((f) => f.id !== fileId);
        }
      });
    },

    // Detect new post when scroll to top, 
    // And load older post when scroll to bottom
    fetchNextPosts() {
      window.onscroll = () => {
        // Get distance from bottom
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight;
        // Get distance from top
        let topOfWindow = document.documentElement.scrollTop <= 0;

        // Bottom, old posts
        if (bottomOfWindow) {
          if (this.$route.name !== this.currentRoute) return;
          console.log("end of page, fetching older posts");
          this.fetchPosts(true);
        }

        // Top, new posts
        if (topOfWindow) {
          if (this.$route.name !== this.currentRoute) return;
          console.log("top of page, fetch newer posts");
          this.fetchPosts(false, true);
        }
      };
    },

    // Fetch posts
    // Detect page and check for a Community, User profile or Global feed
    // Limit results and get only needed next/older datas
    async fetchPosts(older = false, newer = false) {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let url = "",
          queryParams = "",
          minPostId = 0,
          maxPostId = 0;

        if (this.$route.name === "Community") {
          url = "/community/" + this.$route.params.id;
        }
        if (this.$route.name === "Profile")
          queryParams += "&userId=" + this.$route.params.id;
        if (this.favorite) {
          queryParams += "&favorite=true";
        }

        if (older) maxPostId = this.maxPostId;
        if (newer) minPostId = this.minPostId;

        let response = await this.axios(
          "/post" +
            url +
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

        this.posts.forEach((element) => {
          if (element.id > this.minPostId || this.minPostId === 0)
            this.minPostId = element.id;

          if (element.id < this.maxPostId || this.maxPostId === 0)
            this.maxPostId = element.id;
        });

        loader.hide();
      } catch (error) {
        loader.hide();

        // Do not show error for lazy loading
        if (older || newer) return;

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
