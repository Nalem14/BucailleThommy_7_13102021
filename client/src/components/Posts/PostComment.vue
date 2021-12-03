<template>
  <article
    :id="'comment-' + id"
    :style="'width: ' + (100 - separator) + '%;margin-left: ' + separator + '%'"
  >
    <router-link :to="'/p/' + PostId + '#comment-' + id">
      <span>
        <small
          >Posté par
          <router-link :to="'/u/' + User.id + '-' + User.name">u/{{ User.name }}</router-link>
          le {{ createdAt }}</small
        >
      </span>
      <p>{{ content }}</p>
      <ul>
        <li>
          <a href="#!" title="J'aimes"
            >{{ likes }} <i class="far fa-heart"></i
          ></a>
        </li>
        <li>
          <router-link
            :to="'/p/' + PostId + '#comment-' + id"
            title="Commentaires"
            >{{ comments }} <i class="far fa-comments"></i
          ></router-link>
        </li>
        <li class="right">
          <a href="#!" title="Partager"><i class="far fa-share-square"></i></a>
        </li>
        <li class="right">
          <a href="#!" title="Enregistrer"><i class="far fa-bookmark"></i></a>
        </li>
        <li class="right">
          <a href="#!" title="Reporter"><i class="far fa-flag"></i></a>
        </li>
      </ul>
    </router-link>
    <form action="#" method="post">
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
        v-for="comment in PostComment"
        :key="comment.id"
        :separator="nextSeparator()"
        v-bind="comment"
      />
      <!-- <PostComments :comments="PostComment" :separator="separator + 1" /> -->
    </div>
  </article>
</template>

<script>
// import PostComments from "./PostComments";
import Input from "../Form/Input";
import Button from "../Form/Button";

export default {
  name: "PostComment",
  components: {
    // PostComments,
    Input,
    Button,
  },
  props: {
    id: Number,
    content: String,
    likes: Number,
    comments: Number,
    createdAt: String,
    updatedAt: String,
    User: Object,
    PostId: Number,
    PostComment: Array,
    separator: Number,
  },
  methods: {
    nextSeparator() {
      return parseInt(this.separator) + 1;
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