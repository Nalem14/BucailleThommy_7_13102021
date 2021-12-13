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

    <h4>Gestion des modérateurs</h4>
    <div>
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

        <div class="add-moderator" v-if="selected != null">
          <span>
            Utilisateur sélectionné: {{ selected.username }}
          </span>
          <Input type="radio" name="isAdmin" id="moderatorChoice" label="Modérateur" :modelValue="0" />
          <Input type="radio" name="isAdmin" id="administratorChoice" label="Administrateur" :modelValue="1" />
          <Button type="submit" success>Ajouter l'utilisateur</Button>
        </div>
      </form>

      <form action="#" method="POST" @submit.prevent="">
        <h5>Liste des modérateurs</h5>
        <ul>
          <li v-for="moderator in community.CommunityModerators" :key="moderator.id">{{ moderator.id + " " + moderator.isAdmin }}</li>
        </ul>
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
        let isAdmin = document.querySelector('input[name="isAdmin"]:checked').value;

        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        await this.axios.post("/community/" + this.community.id + "/moderator", {
          userId: item.id,
          isAdmin: isAdmin
        });

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

div {
  p {
    margin-bottom: 40px;
  }

  > h4 {
    margin-top: 40px;
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

      .add-moderator {
        flex-direction: column;
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
