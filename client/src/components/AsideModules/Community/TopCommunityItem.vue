<template>
  <article>
    <router-link :to="'/c/' + id + '-' + slug">
      <h3>{{ title }}</h3>
      <span v-if="postCount">{{ postCount }} <i class="fab fa-stack-exchange"></i></span>
      <span v-if="userCount">{{ userCount }} <i class="fas fa-users"></i></span>
    </router-link>
  </article>
</template>

<script>
export default {
  name: "TopCommunityItem",
  props: {
    id: Number,
    title: String,
    slug: String,
    postCount: Number,
    userCount: Number,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
article {
  display: flex;
  border: 0.1px solid $border-color;
  border-radius: 5px;
  background-color: darken($container-color, 5);
  width: 100%;

  a {
    display: flex;
    flex-basis: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    margin: 0 10px;
    border-bottom: 0.1px solid $border-color;
    transition: color .2s ease-in-out;

    &:last-child {
      border: none;
    }

    h3 {
      margin: 10px 0;
      font-size: 1em;
      flex: 8;
    }

    span {
      color: darken($font-color, 50);
      flex: 2;
      text-align: center;
    }
  }
}
</style>
