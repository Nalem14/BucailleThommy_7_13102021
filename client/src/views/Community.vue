<template>
  <!-- Création d'une communauté -->
  <div v-if="community.id == 0" ref="loadingContainer" class="vld-parent">
    <section class="community__create-form">
      <h2>Créer une nouvelle communauté</h2>

      <form action="#" method="post" @submit.prevent="createCommunity">
        <Input
          type="text"
          name="community-name"
          id="community-name"
          label="Nom de la communauté"
          placeholder="Ex: Ma super communauté"
          v-model="createName"
          minlength="5"
          maxlength="255"
          validate
          required
          autofocus
        />
        <Button type="submit">Créer ma communauté</Button>
      </form>
    </section>
  </div>

  <!-- Page de la communauté -->
  <div v-else ref="loadingContainer" class="vld-parent">
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
        <PageCommunity />
      </tab>

      <tab name="A propos">
        <About :about="community.about" />
      </tab>

      <tab
        v-if="canModerate(this.community.UserId, this.community)"
        name="Modération"
      >
        <Moderation v-bind="community" />
      </tab>

      <tab
        v-if="canAdmin(this.community.UserId, this.community)"
        name="Paramètres"
      >
        <Setting :community="community" @reload-community="fetchCommunity" />
      </tab>
    </tabs>
  </div>
</template>

<script>
import PageCommunity from "../components/Community/PageCommunity.vue";
import About from "../components/Community/AboutCommunity.vue";
import Moderation from "../components/Community/ModerationCommunity.vue";
import Setting from "../components/Community/SettingCommunity.vue";

import PageMixin from "../mixins/Page.mixin";
import { Tabs, Tab } from "vue3-tabs-component";
import Button from "../components/Form/Button";
import Input from "../components/Form/Input";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Community",
  components: {
    PageCommunity,
    About,
    Moderation,
    Setting,

    Tabs,
    Tab,

    Button,
    Input,
  },
  mixins: [PageMixin],
  mounted() {
    this.setModules(["TopCommunity", "SearchCommunity"]);
    this.init();

    this.watcher = this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.name != "Community") return;
        this.init();
      }
    );
  },
  unmounted() {
    if (this.watcher) this.watcher();
  },

  data() {
    return {
      community: {
        id: 0,
        title: "Chargement...",
        slug: "",
        about: "",
        icon: "",
        UserId: 0,
        CommunityModerators: [],
      },
      watcher: null,

      rawCreateName: "",

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
    init() {
      if (this.$route.params.id > 0) {
        this.shouldShowModules(true);
        this.fetchCommunity();
      } else {
        this.shouldShowModules(false);
        this.community.id = 0;
        this.createName = this.$route.params.slug;
      }
    },

    async createCommunity() {
      let loader = useLoading();

      if (!this.isAuthenticated) {
        this.$notify({
          type: "error",
          title: `Vous n'êtes pas connecté.`,
          text: `Connectez-vous pour créer une communauté !`,
          duration: 15000,
        });
        return;
      }

      if (this.createName.length < 5) {
        this.$notify({
          type: "error",
          title: `Nom trop court`,
          text: `Veuillez spécifier un nom d'au moins 5 caractères.`,
          duration: 15000,
        });
        return;
      }

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let response = await this.axios.post("/community/", {
          title: this.createName,
          about: this.createName,
        });

        this.$notify({
          type: "success",
          title: `Bravo ! Votre communauté est créée.`,
          text: `Votre communauté est en ligne ! À vos marques, prêt... Postez !`,
          duration: 8000,
        });

        this.$router.push(
          "/c/" +
            response.data.data.community.id +
            "-" +
            this.slugify(response.data.data.community.title)
        );
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
    createName: {
      get() {
        return this.rawCreateName;
      },
      set(newValue) {
        newValue =
          newValue.charAt(0).toUpperCase() +
          newValue.slice(1).replace(/-+/g, " ");
        this.rawCreateName = newValue;
      },
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
.community__create-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $container-color;

  h2 {
    margin-top: 20px;
  }

  form {
    margin: 40px;
  }
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
