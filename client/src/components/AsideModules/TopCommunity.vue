<template>
  <div>
    <h2>Top Communauté</h2>
    <top-community-item
      v-for="community in communities"
      :key="community.id"
      v-bind="community"
    />
  </div>
</template>

<script>
import TopCommunityItem from "./TopCommunityItem.vue";

export default {
  name: "TopCommunity",
  components: {
    TopCommunityItem,
  },
  data() {
    return {
      communities: [
        {
          id: 1,
          name: "Actualitée",
          slug: "actualitee",
          postCount: 12000,
          userCount: 150000,
        },
        {
          id: 2,
          name: "Actualitée",
          slug: "actualitee",
          postCount: 12000,
          userCount: 150000,
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../assets/scss/main.scss";

div {
  display: flex;
  flex-direction: column;
  border: 0.1px solid lighten($color-primary, 10);
  border-radius: 5px;
  margin-top: 20px;
  margin-left: 20px;

  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>
