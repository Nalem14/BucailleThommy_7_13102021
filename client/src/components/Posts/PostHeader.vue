<template>
  <div v-if="Community != undefined && User != undefined">
    <span v-if="editMode === false">
      <!-- Posted by / Created at -->
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

      <!-- Follow Community button -->
      <Button
        @click="followCommunity(Community.id)"
        v-if="isAuthenticated && !userIsFollowingCommunity(Community.id)"
        ><i class="fas fa-plus-circle"></i> Suivre</Button
      >
      <Button
        @click="unfollowCommunity(Community.id)"
        danger
        v-if="isAuthenticated && userIsFollowingCommunity(Community.id)"
        ><i class="fas fa-minus-circle"></i> Ne plus suivre</Button
      >
    </span>

    <!-- Title -->
    <router-link
      v-if="editMode === false"
      :to="'/p/' + id + '-' + slugify(title)"
    >
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
    content: String,
    createdAt: String,
    Community: Object,
    User: Object,
    SharedFromPostId: Number,

    editMode: Boolean,
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