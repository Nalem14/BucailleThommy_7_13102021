<template>
  <ul v-if="editMode === false">
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
    <li v-if="isAuthenticated" class="right">
      <a @click="share()" href="#!" title="Partager"
        ><i class="far fa-share-square"></i
      ></a>
    </li>
    <li v-if="isAuthenticated" class="right">
      <a
        @click="save()"
        :class="hasSaved ? 'post__saved' : ''"
        href="#!"
        title="Enregistrer"
        ><i class="far fa-bookmark"></i
      ></a>
    </li>
    <li v-if="isAuthenticated" @click="report()" class="right">
      <a href="#!" title="Reporter"><i class="far fa-flag"></i></a>
    </li>
    <li v-if="canModerate" class="right">
      <router-link
        :to="'/p/' + id + '-' + slugify(title) + '?edit=1'"
        title="Modifier"
        ><i class="fas fa-edit"></i
      ></router-link>
    </li>
    <li v-if="canModerate" @click="deletePost()" class="right">
      <a href="#!" title="Supprimer"><i class="fas fa-trash-alt"></i></a>
    </li>
  </ul>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "PostFooter",
  mixins: [HelperMixin],
  emits: ["delete-post"],
  components: {},
  props: {
    id: Number,
    title: String,
    likes: Number,
    comments: Number,
    Community: Object,
    User: Object,
    PostLikes: Array,

    editMode: Boolean,
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

    share() {},

    save() {
      if (!this.isAuthenticated) return;

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
      let saved = localStorage.getItem("saved-posts");

      if (saved === null) saved = [];
      else saved = JSON.parse(saved);

      return saved.includes(this.id) === true;
    },

    canModerate() {
      if (this.isAuthenticated) {
        if (
          this.User.id !== this.authData.id &&
          this.authData.isAdmin === false &&
          this.isCommunityModerator(this.Community.CommunityModerators) ===
            false
        )
          return false;

        return true;
      }

      return false;
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