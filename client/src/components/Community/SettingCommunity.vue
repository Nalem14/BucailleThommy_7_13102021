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
        <Button type="submit" success>Changer le logo</Button>
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

        <Button type="submit" success>Changer la description</Button>
      </form>
    </div>

    <div class="moderator">
      <h4>Gestion des modérateurs</h4>
      <form action="#" method="POST" @submit.prevent="addModerator">
        <h5>Ajouter un modérateur</h5>
        <div>
          <Autocomplete
            @input="getList"
            :results="users"
            @onSelect="selectUser"
            :display-item="getName"
            placeholder="Recherhez un utilisateur ..."
          ></Autocomplete>
        </div>

        <div class="moderator__add" v-if="selected != null">
          <span> Utilisateur sélectionné: {{ selected.username }} </span>
          <Input
            type="radio"
            name="isAdmin"
            id="moderatorChoice"
            label="Modérateur"
            :modelValue="0"
          />
          <Input
            type="radio"
            name="isAdmin"
            id="administratorChoice"
            label="Administrateur"
            :modelValue="1"
          />
          <Button type="submit" success>Ajouter l'utilisateur</Button>
        </div>
      </form>

      <form action="#" method="POST" @submit.prevent="">
        <h5>Liste des modérateurs</h5>
        <ul class="moderator__list">
          <li
            v-for="moderator in community.CommunityModerators"
            :key="moderator.id"
          >
            <span class="badge">
              {{ moderator.isAdmin ? "Admin" : "Modo" }}
            </span>
            <span>{{ moderator.User.username }}</span>
            <a href="" @click.prevent="deleteModerator(moderator.User)" danger
              ><i class="fas fa-trash-alt"></i
            ></a>
          </li>
        </ul>
      </form>
    </div>

    <div v-if="isSuperAdmin">
      <h4>Supprimer la communauté</h4>
      <form
        action="#"
        method="POST"
        @submit.prevent="deleteCommunity"
      >
        <Button type="submit" danger>Supprimer la communauté et toute les données associées</Button>
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

import Autocomplete from "vue3-autocomplete";
import "vue3-autocomplete/dist/vue3-autocomplete.css";

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
    Autocomplete,
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
      users: [],
      selected: null,
      watcher: null,
    };
  },

  methods: {
    getName(item) {
      return item.username;
    },
    async getList($e) {
      try {
        let response = await this.axios.get("/user?search=" + $e);
        this.users = response.data.data.users;
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);
        this.users = [];
        this.$notify({
          type: "error",
          title: `Erreur lors de la recherche d'une communauté.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 15000,
        });
      }
    },

    async selectUser(item) {
      this.selected = item;
    },

    async addModerator() {
      let loader = useLoading();

      try {
        let item = this.selected;
        let isAdmin = document.querySelector(
          'input[name="isAdmin"]:checked'
        ).value;

        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        await this.axios.post(
          "/community/" + this.community.id + "/moderator",
          {
            userId: item.id,
            isAdmin: isAdmin,
          }
        );

        this.users = [];
        this.selected = null;
        this.$emit("reload-community");

        loader.hide();
        this.$notify({
          type: "success",
          title: `Modérateur ajouté`,
          text: `Votre nouveau modérateur as bien été ajouté !`,
          duration: 5000,
        });
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de l'ajout d'un modérateur.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
    async deleteModerator(user) {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        await this.axios.delete(
          "/community/" + this.community.id + "/moderator",
          {
            data: {
              userId: user.id,
            },
          }
        );

        this.$emit("reload-community");

        loader.hide();
        this.$notify({
          type: "success",
          title: `Modérateur supprimé`,
          text: `Le modérateur as bien été supprimé !`,
          duration: 5000,
        });
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de la suppression d'un modérateur.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

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

        this.$emit("reload-community");

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

        this.$emit("reload-community");

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

    async deleteCommunity() {
      if (!this.isSuperAdmin) {
        this.$notify({
          type: "error",
          title: `Erreur lors de la suppression de la communauté`,
          text: `Vous n'avez pas la permission pour effectuer cela.`,
          duration: 15000,
        });
        return;
      }

      if (
        !confirm(
          "Êtes-vous sûr de vouloir supprimer définitivement cette communauté et tout le contenu associé ?"
        )
      )
        return;

      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        await this.axios.delete("/community/" + this.community.id);

        this.$emit("reload-community");

        loader.hide();
        this.$notify({
          type: "success",
          title: `Communauté supprimé.`,
          text: `La communauté et tout ce qui y est associé, sont désormais supprimés.`,
          duration: 10000,
        });

        this.$router.push("/");
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de la suppression de la communauté`,
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
:deep(.vue3-autocomplete-container) {
  position: relative;
  input {
    width: 100%;
  }
}

section > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    margin-bottom: 40px;
  }

  & > div {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    margin-top: 40px;
    width: 100%;

    &.moderator {
      .moderator__add {
        flex-direction: column;
      }

      .moderator__list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        @media screen AND (min-width: 768px) {
          flex-direction: row;
        }

        li {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex-basis: 48%;
          font-weight: 500;
          position: relative;
          margin-top: 20px;
          box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

          @media screen AND (min-width: 768px) {
            &:nth-child(even) {
              margin-left: 10px;
            }
          }

          span,
          a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          span {
            margin: 5px 10px;
          }

          .badge {
            background-color: lighten($color-secondary, 0);
            border-radius: 5px;
            color: #fff;
            padding: 5px;
          }

          a {
            text-decoration: none;
            color: rgb(150, 0, 0);
            margin: 5px 10px;
            font-size: 16px;
          }
        }
      }
    }

    form:first-child {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      & > div {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
      }
    }

    form {
      margin-top: 40px;
      width: 100%;

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
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
