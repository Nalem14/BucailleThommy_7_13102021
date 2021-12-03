<template>
  <div>
    <span>
      <router-link :to="'/c/' + Community.id + '-' + Community.slug"
        >c/{{ Community.id + "-" + Community.slug }}</router-link
      >
      <small
        >Posté par
        <router-link :to="'/u/' + User.id + '-' + slugify(User.username)"
          >u/{{ User.id + "-" + slugify(User.username) }}</router-link
        >
        {{ formatDateTime(createdAt) }}</small
      >
      <Button
        @click="followUser(User.id)"
        v-if="
          isAuthenticated &&
          User.id != authData.id &&
          !userIsFollowingUser(User.id)
        "
        ><i class="fas fa-plus-circle"></i> Suivre</Button
      >
      <Button
        @click="unfollowUser(User.id)"
        danger
        v-if="
          isAuthenticated &&
          User.id != authData.id &&
          userIsFollowingUser(User.id)
        "
        ><i class="fas fa-minus-circle"></i> Ne plus suivre</Button
      >
    </span>

    <router-link :to="'/p/' + id + '-' + slugify(title)">
      <h3>{{ title }}</h3>
    </router-link>
  </div>
</template>

<script>
import Button from "../Form/Button.vue";
import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "PostHeader",
  mixins: [HelperMixin],
  components: {
    Button,
  },
  props: {
    id: Number,
    title: String,
    slug: String,
    content: String,
    createdAt: String,
    Community: Object,
    User: Object,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: darken($font-color, 50);
  }

  a {
    text-decoration: none;
    
    h3 {
      color: $font-color;
    }
  }

  h3,
  span {
    margin: 10px 20px;
  }
}
</style>