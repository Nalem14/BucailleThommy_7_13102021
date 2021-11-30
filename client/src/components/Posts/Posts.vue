<template>
  <div ref="loadingContainer" class="vld-parent">
    <h2>Liste des publications</h2>
    <Post v-for="post in posts" :key="post.id" v-bind="post" />
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
    Post
  },
  data() {
    return {
      posts: []
    };
  },

  mounted() {
    this.fetchPosts()
  },

  methods: {
    async fetchPosts() {
      let loader = useLoading();
      
      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let communityId = "0"
        if(this.$route.name === "Community")
          communityId = this.$route.params.id
        if(this.$route.name === "Profile")
          communityId += "?userId=" + this.$route.params.id

        let response = await this.axios("/post/community/" + communityId)
        this.posts = response.data.data.posts

        loader.hide()
      }
      catch(error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement d'email`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: .1px solid $border-color;
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
