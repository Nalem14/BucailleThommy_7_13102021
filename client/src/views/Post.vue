<template>
  <section ref="loadingContainer" class="vld-parent">
    <h2>{{ post.title }}</h2>
    <Post v-bind="post" />

    <h2>Poster un commentaire</h2>
    <form action="#" method="post">
      <div>
        <textarea
          name="answer-comment"
          id="answer-comment"
          rows="10"
          placeholder="Répondre au poste... (min 5 caractères)"
          maxlength="255"
          minlength="5"
          validate
          required
        ></textarea>
      </div>

      <Button>Répondre</Button>
    </form>

    <h2 id="comments">Liste des commentaires</h2>
    <PostComments :comments="post.PostComment" :separator="0" />
  </section>
</template>

<script>
import Post from "../components/Posts/Post";
import PostComments from "../components/Posts/PostComments";
import PageMixin from "../mixins/Page.mixin";
import Button from "../components/Form/Button";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "PostPage",
  components: {
    Post,
    PostComments,
    Button,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false);
    this.setModules([]);
    this.fetchPost()
  },
  data() {
    return {
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
        },
        PostLike: [],
        PostComment: [],
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
    async fetchPost() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let postId = this.$route.params.id;
        let response = await this.axios("/post/" + postId);

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
form {
  margin: 20px;

  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid $color-secondary;
    border-radius: 15px;
  }

  button {
    margin-top: 20px;
  }
}
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
