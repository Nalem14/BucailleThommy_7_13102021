<template>
  <router-link
    v-if="editMode === false"
    :to="'/p/' + id + '-' + slugify(title)"
  >
    <!-- Main Content -->
    <p>{{ content }}</p>
  </router-link>

  <!-- If edit mode -->
  <form
    v-else
    action=""
    @submit.prevent="editPost"
    method="post"
    ref="loadingContainer"
    class="vld-parent"
  >
    <Input
      type="text"
      id="title"
      name="title"
      placeholder="Titre de votre publication (min 5 caractères)"
      maxlength="255"
      v-model="editTitle"
      minlength="5"
      required
    />
    <div>
      <textarea
        name="content"
        id="content"
        rows="10"
        placeholder="Contenu de votre publication (min 20 caractères)"
        v-model="editContent"
        minlength="20"
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
    <Button type="submit" success>Envoyer mes modifications</Button>
  </form>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";
import Button from "../Form/Button.vue";
import Input from "../Form/Input.vue";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "PostContent",
  mixins: [HelperMixin],
  components: {
    Button,
    Input,
  },
  props: {
    id: Number,
    title: String,
    content: String,

    editMode: Boolean,
  },

  data() {
    let title = this.title;
    let content = this.content;
    let watcher = this.$watch(
      () => this.title + this.content,
      () => {
        this.editTitle = this.title;
        this.editContent = this.content;
      }
    );

    return {
      editTitle: title,
      editContent: content,
      fileInputs: 1,
      watcher: watcher
    };
  },
  unmounted() {
    if(this.watcher)
      this.watcher();
  },

  methods: {
    // Add file input
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

    // EDIT A POST
    async editPost() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        if (this.editTitle.length < 5 || this.editContent.length < 20) {
          throw new Error(
            "Veuillez spécifier un titre d'au moins 5 caractères et un contenu de minimum 20 caractères."
          );
        }

        await this.axios.put("/post/" + this.id, {
          title: this.editTitle,
          content: this.editContent,
        });

        await this.uploadFiles(this.id);
        this.fileInputs = 1;
    
        this.$emit('edit-post')
        loader.hide();
        
        this.$router.push(`/p/${this.id}-${this.slugify(this.editTitle)}`);

      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de la modification du poste.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    // Upload files to uploaded post
    // Executed after a post to update it and add all files
    uploadFiles(postId) {
      return new Promise((resolve, reject) => {
        try {
          const imagefiles = document.getElementsByName("image[]");
          if (imagefiles.length === 0) return resolve();

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
                  if (i >= imagefiles.length-1) resolve();
                });
            } else {
              if (i >= imagefiles.length-1) resolve();
            }
          }

        } catch (error) {
          reject(error);
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
p {
  margin: 10px 20px;
  white-space: pre-line;
}
form {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  margin-bottom: 20px;

  :deep(input) {
    width: 100%;
    margin-bottom: 10px;
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