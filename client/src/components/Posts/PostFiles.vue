<template>
  <div v-if="PostFiles && PostFiles.length > 0 && editMode === false">
    <carousel :items-to-show="1">
      <slide v-for="file in PostFiles" :key="file.id">
        <Button v-if="canDelete" danger type="button" @click="deleteImage(file.id)" aria-label="Supprimer"><i class="fas fa-trash-alt"></i></Button>
        <img :src="file.file" alt="Image incluse" height="400" />
      </slide>

      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import HelperMixin from "../../mixins/Helper.mixin";
import Button from "../Form/Button.vue";

export default {
  name: "PostFiles",
  mixins: [HelperMixin],
  emits: ["delete-image"],
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    Button
  },
  props: {
    id: Number,
    PostFiles: Array,
    Community: Object,
    User: Object,

    editMode: Boolean
  },

  methods: {
    deleteImage(fileId) {
      let postId = this.id;

      if(!confirm("Êtes-vous sûr de vouloir supprimer cette image ?"))
        return;

      this.axios
        .delete("/post/" + postId + "/file", {
          data: {
            imageId: fileId,
          }
        })
        .then(() => {
          this.$emit("delete-image", {postId, fileId});
        })
        .catch((error) => {
          const errorMessage = this.handleErrorMessage(error);

          this.$notify({
            type: "error",
            title: `Erreur lors de la suppression de l'image`,
            text: `Erreur reporté : ${errorMessage}`,
            duration: 30000,
          });
        });
    },
  },

  computed: {
    canDelete() {
      if (this.isAuthenticated) {
        if (
          this.User.id !== this.authData.id &&
          this.authData.isAdmin === false &&
          this.isCommunityModerator(this.Community.CommunityModerators) === false
        ) return false;

        return true;
      }

      return false;
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  width: 100%;

  .carousel__slide > div {
    position: absolute;
    top: 0; right: 0;

    :deep(button) {
      position: absolute;
      top: 10px; right: 30px;
    }
  }

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
</style>