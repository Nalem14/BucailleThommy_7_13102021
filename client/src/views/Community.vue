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
        <PageCommunity v-bind="community" @set-community="setCommunity" />
      </tab>

      <tab name="A propos">
        <About :about="community.about" />
      </tab>

      <tab v-if="canModerate" name="Modération">
        <Moderation v-bind="community" />
      </tab>

      <tab v-if="canAdmin" name="Paramètres">
        <Setting v-bind="community" />
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
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true);
    this.setModules(["TopCommunity", "SearchCommunity"]);
  },

  data() {
    return {
      community: {
        id: 1,
        title: "Chargement...",
        slug: "",
        about: "",
        icon: "",
        UserId: 0,
        CommunityModerators: [],
      },

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
    setCommunity(community) {
      this.community = community;
    },
  },

  computed: {
    canModerate() {
      if (this.isAuthenticated) {
        if (
          this.community.UserId !== this.authData.id &&
          this.authData.isAdmin === false &&
          this.isCommunityModerator(this.community.CommunityModerators) ===
            false
        )
          return false;

        return true;
      }

      return false;
    },

    canAdmin() {
      if (this.isAuthenticated) {
        if (
          this.community.UserId !== this.authData.id &&
          this.authData.isAdmin === false &&
          this.isCommunityAdmin(this.community.CommunityModerators) === false
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
