<template>
  <div>
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
  </div>
</template>

<script>
import Posts from "../Posts/Posts";

import Input from "../Form/Input";
import Button from "../Form/Button";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

import HelperMixin from '../../mixins/Helper.mixin';

export default {
  name: "Community",
  components: {
    Posts,
    Input,
    Button,
  },
  mixins: [HelperMixin],
  emits: ["set-community"],
  mounted() {
    this.fetchCommunity();

    this.watcher = this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.name != "Community") return;
        this.fetchCommunity();
      }
    );
  },
  unmounted() {
    if (this.watcher) this.watcher();
  },
  data() {
    return {
      watcher: null,
      requestNewPost: false,

      title: "",
      content: "",

      fileInputs: 1,
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
        this.$emit('set-community', response.data.data.community)

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
