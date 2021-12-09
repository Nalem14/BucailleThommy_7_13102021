<template>
  <div class="vld-parent" id="profile-aside" ref="loadingContainer">
    <figure>
      <img :src="user.avatar" :alt="'Avatar de ' + user.username" />
    </figure>

    <div>
      <h2>{{ user.username }}</h2>
      <span> /u/{{ user.id + "-" + slugify(user.username) }} </span>
    </div>

    <p>
      {{ user.about }}
    </p>

    <div>
      <!-- If user profile == auth user -->
      <Button
        v-if="isAuthenticated && authData.id === user.id"
        link
        to="/u/settings"
        ><i class="fas fa-cog"></i> Gérer mon compte</Button
      >
      <!-- Else -->
      <Button
        v-if="isAuthenticated && user.id !== authData.id && !userIsFollowingUser(user.id)"
        @click="followUser(user.id)"
        ><i class="fas fa-plus-circle"></i> Suivre</Button
      >
      <Button
        v-if="isAuthenticated && user.id !== authData.id && userIsFollowingUser(user.id)"
        @click="unfollowUser(user.id)"
        danger
        ><i class="fas fa-minus-circle"></i> Ne plus suivre</Button
      >

      <Button v-if="isAuthenticated && authData.id !== user.id" success
        ><i class="fas fa-comments"></i> Chat</Button
      >
      <Button v-if="isAuthenticated && authData.id !== user.id" danger
        ><i class="fas fa-flag"></i> Report</Button
      >
      <!-- Endif -->
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import HelperMixin from "../../../mixins/Helper.mixin";
import Button from "../../Form/Button.vue";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Profile",
  components: {
    Button,
  },
  mixins: [HelperMixin],
  mounted() {
    const that = this;
    this.loadProfile();

    // Reload profile when URL change
    this.watcher = this.$watch(
      () => this.$route.params,
      () => {
        if (that.$route.name !== "Profile") return;

        that.loadProfile();
      }
    );
  },
  unmounted() {
    if(this.watcher)
      this.watcher()
  },
  data() {
    return {
      user: {
        id: 0,
        username: "",
        avatar: "",
        about: "",
      },

      watcher: null
    };
  },

  methods: {
    ...mapActions("user", ["fetchProfile"]),

    async loadProfile() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let request = await this.fetchProfile(this.$route.params.id);
        this.user = request.data.data.user;

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du chargement du profil de ${this.$route.params.name}`,
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
#profile-aside {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0.1px solid $border-color;
  background-color: $container-color;
  border-radius: 5px;
  margin-top: 20px;

  figure {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    img {
      width: 120px;
      height: 120px;
      height: auto;
      border: 3px solid $color-secondary;
      border-radius: 50%;
    }
  }

  > div:first-child {
    display: flex;
    flex-direction: column;
    margin: 10px 20px;

    span {
      color: lighten($font-color, 30);
    }
  }

  > div:last-child {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin: 10px 20px;

    > div {
      margin: 5px;
    }
  }

  p {
    margin-bottom: 20px;
  }
}
</style>
