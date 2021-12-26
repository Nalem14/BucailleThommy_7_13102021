<template>
  <ul v-if="editMode === false">
    <!-- LIKES -->
    <li>
      <a
        @click="like()"
        href="#!"
        title="J'aime"
        :class="hasLiked ? 'post__liked' : ''"
        >{{ likeCount }} <i class="far fa-heart"></i
      ></a>
    </li>
    <!-- COMMENTS -->
    <li>
      <router-link
        :to="'/p/' + id + '-' + slugify(title) + '#comments'"
        title="Commentaires"
        >{{ comments }} <i class="far fa-comments"></i
      ></router-link>
    </li>
    <!-- BOOKMARK -->
    <li v-if="isAuthenticated" class="right">
      <a
        @click="save()"
        :class="hasSaved ? 'post__saved' : ''"
        href="#!"
        title="Enregistrer"
        ><i class="far fa-bookmark"></i
      ></a>
    </li>
    <!-- SHARE -->
    <li v-if="isAuthenticated" class="right">
      <a @click="share()" href="#!" title="Partager"
        ><i class="far fa-share-square"></i
      ></a>
    </li>
    <!-- EDIT -->
    <li v-if="this.canModerate(this.User, this.Community) && ParentPost == null" class="right">
      <router-link
        :to="'/p/' + id + '-' + slugify(title) + '?edit=1'"
        title="Modifier"
        ><i class="fas fa-edit"></i
      ></router-link>
    </li>
    <!-- REPORT -->
    <li v-if="isAuthenticated" @click="report()" class="right">
      <a href="#!" title="Reporter"><i class="far fa-flag"></i></a>
    </li>
    <!-- DELETE -->
    <li v-if="this.canModerate(this.User, this.Community)" @click="deletePost()" class="right">
      <a href="#!" title="Supprimer"><i class="fas fa-trash-alt"></i></a>
    </li>
  </ul>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "PostFooter",
  mixins: [HelperMixin],
  emits: ["delete-post", "share-post"],
  components: {},
  props: {
    id: Number,
    title: String,
    likes: Number,
    comments: Number,
    Community: Object,
    User: Object,
    PostLikes: Array,
    PostFavorites: Array,
    ParentPost: Object,

    editMode: Boolean,
  },

  data() {
    return {
      hasLiked: false,
      hasSaved: false,
      likeCount: 0,

      watcher: null,
    };
  },

  mounted() {
    this.hasLiked = this.isLiked;
    this.hasSaved = this.isSaved;
    this.likeCount = this.likes;

    this.watcher = this.$watch(
      () => this.isLiked + this.isSaved + this.likes,
      () => {
        this.hasLiked = this.isLiked;
        this.hasSaved = this.isSaved;
        this.likeCount = this.likes;
      }
    );
  },
  unmounted() {
    if(this.watcher)
      this.watcher();
  },

  methods: {
    // Send/Cancel like
    async like() {
      try {
        if (!this.isAuthenticated) return;

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

    share() {
      this.$emit('share-post')
    },

    // Bookmark the post to favorite
    async save() {
      try {
        if (!this.isAuthenticated) return;

        if (!this.isSaved) {
          await this.axios.post("/post/" + this.id + "/favorite");
          this.hasSaved = true;

          this.$notify({
            type: "success",
            title: `Poste enregistré dans vos favoris !`,
            text: `Le poste as bien été enregistré dans votre liste.`,
            duration: 5000,
          });
        } else {
          await this.axios.delete("/post/" + this.id + "/unfavorite");
          this.hasSaved = false;

          this.$notify({
            type: "info",
            title: `Poste supprimé de vos favoris !`,
            text: `Le poste as bien été supprimé de votre liste.`,
            duration: 5000,
          });
        }
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de l'ajout en favoris`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    // Report the post 
    async report() {
      try {
        if (!this.isAuthenticated) return;

        let reason = prompt(
          `Indiquez la raison pour rapporter ce poste. 
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

    // Delete the post
    async deletePost() {
      try {
        if (!this.isAuthenticated) return;

        if (!confirm("Êtes-vous sûr de vouloir supprimer ce poste ?")) return;

        await this.axios.delete("/post/" + this.id);
        this.$emit("delete-post", this.id);
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
      if (!this.isAuthenticated) return false;
      if (!this.PostFavorites) return false;

      let favs = this.PostFavorites.filter(
        (f) => f.UserId === this.authData.id && f.PostId === this.id
      );
      return favs.length > 0 || this.hasSaved;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
    &.edit-btn a {
      color: rgb(18, 99, 18);
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
</style>