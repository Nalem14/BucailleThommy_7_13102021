<template>
  <div ref="loadingContainer" class="vld-parent" v-if="community != undefined">
    <h3>Paramètres</h3>
    <p>
      D'ici, gérez les informations de la communauté tel que le logo, la
      description, les modérateurs.
    </p>

    <div>
      <form
        action="#"
        method="POST"
        enctype="multipart/form-data"
        @submit.prevent="updateLogo"
      >
        <h4>Changer le logo</h4>
        <figure>
          <img :src="community.icon" :alt="'Logo de ' + community.title" />
        </figure>
        <Input type="file" id="logo" name="logo" label="Logo" />
        <Button success>Changer le logo</Button>
      </form>

      <form action="#" method="POST" @submit.prevent="updateAbout">
        <h4>À propos</h4>
        <div>
          <textarea
            name="about"
            id="about"
            rows="10"
            placeholder="Parlez-nous de la communauté..."
            v-model="about"
          ></textarea>
        </div>

        <Button success>Changer la description</Button>
      </form>
    </div>
  </div>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";

import Button from "../Form/Button";
import Input from "../Form/Input";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "SettingCommunity",
  emits: ["reload-community"],
  props: {
    community: Object,
  },
  mixins: [HelperMixin],
  components: {
    Button,
    Input,
  },

  mounted() {
    if (this.community != undefined) this.about = this.community.about;
    this.watcher = this.$watch(
      () => this.community,
      () => {
        this.about = this.community.about;
      }
    );
  },
  unmounted() {
    if (this.watcher) this.watcher();
  },

  data() {
    return {
      about: "",
      watcher: null,
    };
  },

  methods: {
    async updateLogo() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        const formData = new FormData();
        const imagefile = document.getElementById("logo");
        formData.append("image", imagefile.files[0]);

        await this.axios.put("/community/" + this.community.id, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.$emit("reload-community")

        loader.hide();
        this.$notify({
          type: "success",
          title: `Logo mis à jour`,
          text: `Votre nouveau logo as bien été défini !`,
          duration: 5000,
        });
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement du logo`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    async updateAbout() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        await this.axios.put("/community/" + this.community.id, {
          about: this.about,
        });

        this.$emit("reload-community")

        loader.hide();
        this.$notify({
          type: "success",
          title: `Description mis à jour`,
          text: `Votre nouvelle description as bien été défini !`,
          duration: 5000,
        });
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement de votre description`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  p {
    margin-bottom: 40px;
  }

  > div {
    display: flex;
    flex-direction: column;

    @media screen AND (min-width: 992px) {
      flex-direction: row;
      justify-content: space-between;
    }
    form {
      margin-top: 40px;

      h3 {
        margin-bottom: 20px;
      }

      figure {
        display: flex;
        margin-top: 20px;

        img {
          width: 120px;
          height: 120px;
          border: 3px solid $color-secondary;
          border-radius: 50%;
        }
      }

      textarea {
        width: 100%;
      }

      div {
        display: flex;
        flex-basis: 100%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-top: 10px;

        @media screen AND (min-width: 768px) {
          flex-direction: row;
          align-items: center;
          width: 400px;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
