<template>
  <article>
    <span>
      <router-link :to="'/c/' + Community.id + '-' + Community.slug"
        >c/{{ Community.id + "-" + Community.slug }}</router-link
      >
      <small
        >Posté par
        <router-link :to="'/u/' + User.id + '-' + User.username"
          >u/{{ User.id + "-" + User.username }}</router-link
        >
        {{ formatDateTime(createdAt) }}</small
      >
      <Button
        @click="followUser(User.id)"
        v-if="
          isAuthenticated &&
          User.id != authData.id &&
          !userIsFollowingUser(User.id)
        "
        ><i class="fas fa-plus-circle"></i> Suivre</Button
      >
      <Button
        @click="unfollowUser(User.id)"
        danger
        v-if="
          isAuthenticated &&
          User.id != authData.id &&
          userIsFollowingUser(User.id)
        "
        ><i class="fas fa-minus-circle"></i> Ne plus suivre</Button
      >
    </span>
    <router-link :to="'/p/' + id + '-' + slugify(title)">
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

    <router-link :to="'/p/' + id + '-' + slugify(title)">
      <p>{{ content }}</p>
    </router-link>

    <ul>
      <li>
        <a
          @click="like()"
          href="#!"
          title="J'aime"
          :class="hasLiked ? 'post__liked' : ''"
          >{{ likeCount }} <i class="far fa-heart"></i
        ></a>
      </li>
      <li>
        <router-link
          :to="'/p/' + id + '-' + slugify(title) + '#comments'"
          title="Commentaires"
          >{{ comments }} <i class="far fa-comments"></i
        ></router-link>
      </li>
      <li class="right">
        <a @click="share()" href="#!" title="Partager"
          ><i class="far fa-share-square"></i
        ></a>
      </li>
      <li class="right">
        <a
          @click="save()"
          :class="hasSaved ? 'post__saved' : ''"
          href="#!"
          title="Enregistrer"
          ><i class="far fa-bookmark"></i
        ></a>
      </li>
      <li @click="report()" class="right">
        <a href="#!" title="Reporter"><i class="far fa-flag"></i></a>
      </li>
    </ul>
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
    PostFiles: Array,
    PostLikes: Array,
  },

  data() {
    return {
      hasLiked: false,
      hasSaved: false,
      likeCount: 0,
    };
  },

  mounted() {
    this.hasLiked = this.isLiked;
    this.hasSaved = this.isSaved;
    this.likeCount = this.likes;

    this.$watch(
      () => this.isLiked + this.isSaved + this.likes,
      () => {
        this.hasLiked = this.isLiked;
        this.hasSaved = this.isSaved;
        this.likeCount = this.likes;
      }
    );
  },

  methods: {
    async like() {
      try {
        await this.axios.post("/post/" + this.id + "/like", {
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

    share() {},

    save() {
      let saved = localStorage.getItem("saved-posts");

      if (saved === null) saved = [];
      else saved = JSON.parse(saved);

      if (saved.includes(this.id)) saved = saved.filter((x) => x !== this.id);
      else saved.push(this.id);

      localStorage.setItem("saved-posts", JSON.stringify(saved));

      if (saved.includes(this.id)) {
        this.hasSaved = true;
        this.$notify({
          type: "success",
          title: `Poste enregistré !`,
          text: `Le poste as bien été enregistré dans votre liste.`,
          duration: 5000,
        });
      } else {
        this.hasSaved = false;
        this.$notify({
          type: "info",
          title: `Poste supprimé de votre liste !`,
          text: `Ce poste n'apparaîtra plus dans votre liste.`,
          duration: 5000,
        });
      }
    },

    async report() {
      try {
        let reason = prompt(
          `Indiquez la raison pour rapporter ce poste. 
          Veillez à bien détailler le soucis que vous rencontrez afin 
          que les modérateurs puissent traiter votre demande.`
        );

        if (reason.length <= 0) return;

        if (confirm("Valider l'envoi du rapport aux modérateurs ?")) {
          await this.axios.post("/post/" + this.id + "/report", {
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
      if (this.isAuthenticated && this.PostLikes) {
        for (let i = 0; i < this.PostLikes.length; i++) {
          let elem = this.PostLikes[i];
          if (this.authData.id === elem.UserId) {
            return true;
          }
        }
      }

      return false;
    },

    isSaved() {
      let saved = localStorage.getItem("saved-posts");

      if (saved === null) saved = [];
      else saved = JSON.parse(saved);

      return saved.includes(this.id) === true;
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

        &.post__liked {
          color: red;
        }
        &.post__saved {
          color: green;
        }
      }
    }
  }
}
</style>