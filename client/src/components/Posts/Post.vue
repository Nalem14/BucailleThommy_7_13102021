<template>
  <article>
    <router-link :to="'/p/' + id + '-' + slug">
      <span>
        <router-link :to="'/c/' + Community.id + '-' + Community.slug"
          >c/{{ Community.id + "-" + Community.slug }}</router-link
        >
        <small
          >Posté par
          <router-link :to="'/u/' + User.id + '-' + User.username">u/{{ User.id + "-" + User.username }}</router-link>
          {{ formatDateTime(createdAt) }}</small
        >
        <Button v-if="isAuthenticated && !userIsFollowingUser(User.id)"><i class="fas fa-plus-circle"></i> Suivre</Button>
        <Button danger v-if="isAuthenticated && userIsFollowingUser(User.id)"><i class="fas fa-minus-circle"></i> Ne plus suivre</Button>
      </span>
      <h3>{{ title }}</h3>
    </router-link>

    <div v-if="PostFiles && PostFiles.length > 0">
      <carousel :items-to-show="1">
        <slide v-for="file in PostFiles" :key="file.id">
          <img :src="file.image" alt="Image incluse" />
        </slide>

        <template #addons>
          <navigation />
          <pagination />
        </template>
      </carousel>
    </div>

    <router-link :to="'/p/' + id + '-' + slug">

      <p>{{ content }}</p>

      <ul>
        <li>
          <a href="#!" title="J'aimes"
            >{{ likes }} <i class="far fa-heart"></i
          ></a>
        </li>
        <li>
          <router-link :to="'/p/' + id + '-' + slug + '#comments'" title="Commentaires"
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
  </article>
</template>

<script>
import Button from "../Form/Button.vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import HelperMixin from "../../mixins/Helper.mixin";


export default {
  name: "Post",
  mixins: [HelperMixin],
  components: {
    Button,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  props: {
    id: Number,
    title: String,
    slug: String,
    content: String,
    likes: Number,
    comments: Number,
    createdAt: String,
    updatedAt: String,
    Community: Object,
    User: Object,
    PostFiles: Object,
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
}
</style>