<template>
  <div ref="loadingContainer" class="vld-parent">
    <h2>Personnalisation du profil</h2>
    <p>
      D'ici, gérez vos informations publique tel que votre avatar, votre
      description.
    </p>

    <div>
      <form
        action="#"
        method="POST"
        enctype="multipart/form-data"
        @submit.prevent="updateAvatar"
      >
        <h3>Changer mon avatar</h3>
        <figure>
          <img :src="authData.avatar" :alt="'Avatar de ' + authData.username" />
        </figure>
        <Input type="file" id="avatar" name="avatar" label="Avatar" />
        <Button success>Changer mon avatar</Button>
      </form>

      <form action="#" method="POST" @submit.prevent="updateAbout">
        <h3>À propos de vous</h3>
        <div>
          <textarea
            name="about"
            id="about"
            rows="10"
            placeholder="Parlez-nous de vous..."
            v-model="userAbout"
          ></textarea>
        </div>

        <Button success>Changer ma description</Button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import HelperMixin from "../../mixins/Helper.mixin";

import Button from "../Form/Button";
import Input from "../Form/Input";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Profile",
  mixins: [HelperMixin],
  components: {
    Button,
    Input,
  },

  mounted() {
    this.userAbout = this.authData.about
  },

  data() {
    return {
      userAbout: ""
    };
  },

  methods: {
    ...mapActions("user", {
      updateUserData: "updateData",
    }),

    async updateAvatar() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        const formData = new FormData()
        const imagefile = document.getElementById('avatar')
        formData.append("image", imagefile.files[0])

        await this.axios.put('/auth/update', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })

        await this.fetchSetUserData()

        loader.hide();
        this.$notify({
          type: "success",
          title: `Avatar mis à jour`,
          text: `Votre nouvel avatar as bien été défini !`,
          duration: 5000,
        });
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement d'email`,
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

        await this.updateUserData({
          about: this.userAbout
        });

        await this.fetchSetUserData()
        this.userAbout = this.authData.about

        loader.hide();
        this.$notify({
          type: "success",
          title: `Description mis à jour`,
          text: `Votre nouvel description as bien été défini !`,
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

    @media screen AND (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
    }
    form {
      margin-top: 80px;

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
