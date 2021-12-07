<template>
  <div id="comments" ref="loadingContainer" class="vld-parent">
    <h2>Poster un commentaire</h2>
    <form action="#" method="post" @submit.prevent="postComment()">
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
          v-model="commentContent"
        ></textarea>
      </div>

      <Button type="submit" success>Répondre</Button>
    </form>

    <h2>Liste des commentaires</h2>
    <PostComment
      v-for="comment in comments"
      :key="comment.id"
      :separator="separator"
      v-bind="comment"
      :Community="Community"
      @delete-comment="this.$emit('delete-comment', $event)"
      @add-subcomment="postSubComment"
    />

    <p v-if="comments.length === 0">
      Il n'y a aucun commentaire pour le moment. Soyez le premier !
    </p>
  </div>
</template>

<script>
import PostComment from "./PostComment";
import Button from "../Form/Button.vue";
import HelperMixin from "../../mixins/Helper.mixin";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "PostComments",
  components: {
    PostComment,
    Button,
  },
  mixins: [HelperMixin],
  emits: ["add-comment", "delete-comment"],
  props: {
    comments: Array,
    postId: Number,
    CommunityId: Number,
    Community: Object,
    separator: Number,
  },

  data() {
    return {
      commentContent: "",
    };
  },

  methods: {
    async postSubComment(id) {
      let input = document.getElementById("answer-comment-" + id);
      this.commentContent = input.value;

      await this.postComment(id);
      input.value = "";
      this.commentContent = "";
    },
    async postComment(toCommentId = null) {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let data = {
          content: this.commentContent,
          postId: this.postId,
        };

        if (toCommentId !== null) data.commentId = toCommentId;

        await this.axios.post("/comment", data);

        loader.hide();
        this.$notify({
          type: "success",
          title: `Commentaire envoyé !`,
          text: `Merci, votre commentaire as bien été envoyé.`,
          duration: 30000,
        });

        this.$emit("add-comment");
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
#comments {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: 0.1px solid $border-color;
  border-radius: 5px;
  margin-top: 20px;
  background-color: $container-color;

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

  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }

  p {
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
