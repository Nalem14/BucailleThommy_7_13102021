<template>
  <section ref="loadingContainer" class="vld-parent">
    <h2 v-if="editMode === false">{{ post.title }}</h2>
    <h2 v-else>Modification du poste {{ post.title }}</h2>

    <Post
      v-bind="post"
      :editMode="editMode"
      @delete-post="deletePost"
      @delete-image="deleteImage"
      @edit-post="editPost"
    />

    <template v-if="editMode === false">
      <PostComments
        :comments="post.PostComments"
        :postId="post.id"
        :CommunityId="post.CommunityId"
        :Community="post.Community"
        :separator="0"
        @add-comment="addComment"
        @delete-comment="deleteComment"
      />
    </template>
  </section>
</template>

<script>
import Post from "../components/Posts/Post";
import PostComments from "../components/Posts/PostComments";
import PageMixin from "../mixins/Page.mixin";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "PostPage",
  components: {
    Post,
    PostComments,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false);
    this.setModules([]);
    this.fetchPost();

    this.watcher = this.$watch(() => this.$route.params, () => {
      if(this.$route.name != "Post")
          return;
      this.fetchPost()
    })
  },
  unmounted() {
    if(this.watcher)
      this.watcher()
  },
  data() {
    let editMode = false;
    if (this.$route.query.edit) editMode = true;
    this.$watch(
      () => this.$route.query,
      () => {
        if (this.$route.query.edit) this.editMode = true;
        else this.editMode = false;
      }
    );

    return {
      fileInputs: 1,
      editMode: editMode,
      watcher: null,

      post: {
        id: 1,
        title: "Chargement...",
        content: "",
        likes: 0,
        comments: 0,
        createdAt: "",
        updatedAt: "",
        User: {
          id: 0,
          username: "",
        },
        Community: {
          id: 0,
          title: "",
          slug: "",
          about: "",
          CommunityModerators: [],
        },
        PostLike: [],
        PostComments: [],
        Post: [],
        PostReport: [],
        PostFile: [],
      },

      metaDatas: {
        title: this.$route.params.slug + " - Poste | Groupomania",
        meta: [
          {
            name: "description",
            content: "Poste intitulé " + this.$route.params.slug,
          },
        ],
      },
    };
  },

  methods: {
    addComment() {
      this.fetchPost();
    },
    async deleteComment(commentId) {
      if(!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?"))
        return;

      try {
        await this.axios.delete("/comment/" + commentId)
        await this.fetchPost()

        this.$notify({
          type: "success",
          title: `Commentaire supprimé !`,
          text: `Le commentaire as bien été supprimé.`,
          duration: 5000,
        });
      }
      catch(error) {
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement du poste`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    deletePost() {
      // ...Logic handled by PostFooter.vue
      this.$router.push("/");
    },
    deleteImage($event) {
      // ...Logic handled by PostFiles.vue
      this.post.PostFiles = this.post.PostFiles.filter(
        (f) => f.id !== $event.fileId
      );
    },
    editPost() {
      this.fetchPost();
    },

    async fetchPost() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let postId = this.$route.params.id;
        let response = await this.axios.get("/post/" + postId);

        this.post = response.data.data.post;

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement du poste`,
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
section {
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
