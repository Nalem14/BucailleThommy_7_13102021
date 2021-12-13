<template>
  <article
    :id="'comment-' + id"
    :style="'width: ' + (100 - separator) + '%;margin-left: ' + separator + '%'"
  >
    <span>
      <small
        >Posté par
        <router-link :to="'/u/' + User.id + '-' + this.slugify(User.username)"
          >u/{{ User.id + "-" + this.slugify(User.username) }}</router-link
        >
        {{ formatDateTime(createdAt) }}</small
      >
    </span>
    <p>{{ content }}</p>
    <ul>
      <li>
        <a
          @click="like()"
          href="#!"
          title="J'aime"
          :class="hasLiked ? 'comment__liked' : ''"
          >{{ likeCount }} <i class="far fa-heart"></i
        ></a>
      </li>
      <li v-if="separator < 2">
        <a href="#!" title="Commentaires"
          >{{ comments }} <i class="far fa-comments"></i
        ></a>
      </li>
      <li v-if="isAuthenticated" @click="report()" class="right">
        <a href="#!" title="Reporter"><i class="far fa-flag"></i></a>
      </li>
      <li
        v-if="this.canModerate(this.User, this.Community)"
        @click="this.$emit('delete-comment', id)"
        class="right"
      >
        <a href="#!" title="Supprimer"><i class="fas fa-trash-alt"></i></a>
      </li>
    </ul>

    <form
      :style="'margin-left: ' + (separator+1) + '%'"
      v-if="separator < 2"
      action="#"
      method="post"
      @submit.prevent="this.$emit('add-subcomment', id)"
    >
      <Input
        type="text"
        name="comment"
        :id="'answer-comment-' + id"
        placeholder="Répondre au commentaire... (min 5 caractères)"
        maxlength="255"
        minlength="5"
        validate
        required
      />
      <Button>Répondre</Button>
    </form>

    <div>
      <PostComment
        v-for="comment in ChildComments"
        :key="comment.id"
        :separator="nextSeparator()"
        v-bind="comment"
        :Community="Community"
        @delete-comment="this.$emit('delete-comment', $event)"
        @add-subcomment="this.$emit('add-subcomment', $event)"
      />
    </div>
  </article>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";

import Input from "../Form/Input";
import Button from "../Form/Button";

export default {
  name: "PostComment",
  mixins: [HelperMixin],
  components: {
    Input,
    Button,
  },
  emits: ["delete-comment", "add-subcomment"],
  props: {
    id: Number,
    content: String,
    likes: Number,
    comments: Number,
    createdAt: String,
    updatedAt: String,
    User: Object,
    PostId: Number,
    ChildComments: Array,
    CommentLikes: Array,
    separator: Number,
    Community: Object,
  },

  data() {
    return {
      hasLiked: false,
      likeCount: 0,
    };
  },

  mounted() {
    this.hasLiked = this.isLiked;
    this.likeCount = this.likes;

    this.$watch(
      () => this.isLiked + this.likes,
      () => {
        this.hasLiked = this.isLiked;
        this.likeCount = this.likes;
      }
    );
  },

  methods: {
    nextSeparator() {
      return parseInt(this.separator) + 1;
    },

    async like() {
      try {
        if (!this.isAuthenticated) return;

        await this.axios.post("/comment/" + this.id + "/like", {
          like: !this.hasLiked,
        });

        this.hasLiked = !this.hasLiked;

        if (this.hasLiked) this.likeCount++;
        else this.likeCount--;
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de l'ajout du like`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    async report() {
      try {
        if (!this.isAuthenticated) return;

        let reason = prompt(
          `Indiquez la raison pour rapporter ce commentaire. 
          Veillez à bien détailler le soucis que vous rencontrez afin 
          que les modérateurs puissent traiter votre demande.`
        );

        if (reason === null || reason.length < 5) {
          this.$notify({
            type: "error",
            title: `Erreur lors de l'envoi du rapport`,
            text: `La raison doit être de 5 caractères minimum.`,
            duration: 10000,
          });
          return;
        }

        if (confirm("Valider l'envoi du rapport aux modérateurs ?")) {
          await this.axios.post("/comment/" + this.id + "/report", {
            content: reason,
            communityId: this.Community.id,
          });

          this.$notify({
            type: "success",
            title: `Merci, votre rapport a été envoyé.`,
            text: `Il sera traité par nos modérateurs sous 48H.`,
            duration: 5000,
          });
        }
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de l'envoi du rapport`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
  },

  computed: {
    isLiked() {
      if (this.isAuthenticated && this.CommentLikes) {
        for (let i = 0; i < this.CommentLikes.length; i++) {
          let elem = this.CommentLikes[i];
          if (this.authData.id === elem.UserId) {
            return true;
          }
        }
      }

      return false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
article {
  display: flex;
  flex-basis: 100%;
  width: 100%;
  flex-direction: column;
  border-radius: 5px;
  background-color: darken($container-color, 5);
  margin-bottom: 40px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

  > a {
    color: $font-color;
    text-decoration: none;
  }

  &:last-child {
    margin-bottom: 0;
  }

  span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: darken($font-color, 50);
  }

  h3,
  p,
  span {
    margin: 10px 20px;
  }

  > div {
    width: 100%;
    img {
      width: 100%;
      border: 3px solid #fff;
      border-radius: 15px;
      margin-left: 20px;

      &:last-child {
        margin-right: 20px;
      }
    }
  }

  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-basis: 100%;
    margin-top: 20px;
    justify-content: center;
    background-color: darken($color-primary, 3);
    border-bottom: 0.1px solid $border-color;
    border-radius: 5px;

    li {
      display: flex;
      justify-content: flex-start;
      flex-basis: 25%;
      margin: 10px 10px;

      &.right {
        justify-content: flex-end;
      }

      > a {
        text-decoration: none;
        color: darken($font-color, 30);

        &.comment__liked {
          color: red;
        }
      }
    }
  }

  form {
    display: flex;
    flex-direction: row;

    > div {
      margin-right: 10px;
      width: 50%;

      > :deep(input) {
        width: 100%;
      }
    }
  }
}
</style>