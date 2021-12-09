<template>
  <div ref="loadingContainer" class="vld-parent">
    <section class="community__header">
      <figure>
        <img
          :src="community.icon"
          :alt="'Image de la communauté ' + community.title"
        />
      </figure>
      <h2>
        {{ community.title }}
        <small>c/{{ community.id + "-" + community.slug }}</small>
      </h2>

      <Button
        @click="followCommunity(community.id)"
        v-if="isAuthenticated && !userIsFollowingCommunity(community.id)"
        ><i class="fas fa-plus-circle"></i> Suivre</Button
      >
      <Button
        @click="unfollowCommunity(community.id)"
        danger
        v-if="userIsFollowingCommunity(community.id)"
        ><i class="fas fa-minus-circle"></i> Ne plus suivre</Button
      >
    </section>

    <tabs :options="{ useUrlFragment: false }">
      <tab name="Publications">
        <form action="#" method="post" @submit.prevent="createPost()">
          <h2>Créer une publication</h2>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="Titre de votre publication (min 5 caractères)"
            maxlength="255"
            v-model="title"
            minlength="5"
            validate
            required
          />

          <div v-if="shouldShowForm">
            <div>
              <textarea
                name="content"
                id="content"
                rows="10"
                placeholder="Contenu de votre publication (min 20 caractères)"
                v-model="content"
                minlength="20"
                validate
                required
              ></textarea>
            </div>

            <Input
              v-for="index in fileInputs"
              :key="index"
              type="file"
              name="image[]"
            />

            <Button @click="addFile" type="button" name="addFile" id="addFile"
              >Ajouter un fichier</Button
            >
            <Button type="submit" success>Envoyer ma publication</Button>
          </div>
        </form>
        <Posts :fetchNewPost="requestNewPost" />
      </tab>

      <tab name="A propos">
        <About :about="community.about" />
      </tab>

      <tab
        v-if="this.isCommunityModerator(this.community.CommunityModerators)"
        name="Modération"
      >
        <Moderation :v-bind="community" />
      </tab>

      <tab
        v-if="this.isCommunityAdmin(this.community.CommunityModerators)"
        name="Paramètres"
      >
        <Setting v-bind="community" />
      </tab>
    </tabs>
  </div>
</template>

<script>
import Posts from "../components/Posts/Posts";
import About from "../components/Community/AboutCommunity.vue";
import Moderation from "../components/Community/ModerationCommunity.vue";
import Setting from "../components/Community/SettingCommunity.vue";

import PageMixin from "../mixins/Page.mixin";
import { Tabs, Tab } from "vue3-tabs-component";
import Input from "../components/Form/Input";
import Button from "../components/Form/Button";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Community",
  components: {
    Posts,
    About,
    Moderation,
    Setting,

    Tabs,
    Tab,

    Input,
    Button,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true);
    this.setModules(["TopCommunity", "SearchCommunity"]);
    this.fetchCommunity();

    this.watcher = this.$watch(
      () => this.$route.params,
      () => {
        if(this.$route.name != "Community")
          return;
        this.fetchCommunity();
      }
    );
  },
  unmounted() {
    if(this.watcher)
      this.watcher()
  },
  data() {
    return {
      community: {
        id: 1,
        title: "Chargement...",
        slug: "",
        about: "",
        icon: "",
        CommunityModerators: [],
      },

      watcher: null,
      requestNewPost: false,

      title: "",
      content: "",

      fileInputs: 1,

      metaDatas: {
        title: this.$route.params.slug + " | Groupomania",
        meta: [
          {
            name: "description",
            content: "A propos de la communauté de zozo",
          },
        ],
      },
    };
  },

  methods: {
    addFile() {
      if (this.fileInputs >= 10) {
        this.$notify({
          type: "error",
          title: `Nombre max de fichiers atteint !`,
          text: `Vous ne pouvez pas ajouter plus de 10 images par poste.`,
          duration: 30000,
        });
        return;
      }

      this.fileInputs++;
    },

    async createPost() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        if (this.title.length < 5 || this.content.length < 20) {
          throw new Error(
            "Veuillez spécifier un titre d'au moins 5 caractères et un contenu de minimum 20 caractères."
          );
        }

        let response = await this.axios.post("/post/", {
          title: this.title,
          content: this.content,
          communityId: this.$route.params.id,
        });
        let post = response.data.data.post;

        this.title = "";
        this.content = "";

        await this.uploadFiles(post.id);

        this.fileInputs = 1;
        this.requestNewPost = true;

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de la création du poste.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    uploadFiles(postId) {
      return new Promise((resolve, reject) => {
        try {
          const imagefiles = document.getElementsByName("image[]");
          if (imagefiles.length === 0) resolve();

          for (let i = 0; i < imagefiles.length; i++) {
            let file = imagefiles[i];

            if (file.files[0] != undefined) {
              let formData = new FormData();
              formData.append("image", file.files[0]);

              this.axios
                .post("/post/" + postId + "/file", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then(() => {
                  if (i >= imagefiles.length - 1) resolve();
                });
            } else {
              if (i >= imagefiles.length - 1) resolve();
            }
          }
        } catch (error) {
          reject(error);
        }
      });
    },

    async fetchCommunity() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let response = await this.axios.get(
          "/community/" + this.$route.params.id
        );
        this.community = response.data.data.community;

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement de la communauté`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
  },

  computed: {
    shouldShowForm() {
      if (this.title.length > 0) return true;
      return false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
}
.community__header {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: $container-color;

  figure {
    display: flex;
    justify-content: center;
    margin: 10px 20px;

    img {
      width: 120px;
      height: 120px;
      border: 3px solid $color-secondary;
      border-radius: 120px;
    }
  }

  h2 {
    display: flex;
    flex-direction: column;
    font-size: 1.6em;
    small {
      color: lighten($font-color, 50);
      font-size: 1rem;
    }
  }

  // Button
  > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-right: 20px;
  }
}

form {
  :deep(input) {
    width: 100%;
    margin-bottom: 10px;
  }
  h2 {
    text-align: center;
  }
  textarea {
    width: 100%;
    border: 1px solid $color-secondary;
    border-radius: 15px;
    padding: 10px;
  }
  > :deep(div) {
    display: flex;
    justify-content: center;
    width: 100%;

    button {
      width: 80%;
      margin: 0 auto;
      margin-top: 10px;
    }
  }
}
</style>
