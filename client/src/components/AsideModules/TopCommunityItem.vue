<template>
  <article>
    <router-link :to="'/c/' + slug">
      <h3>{{ name }}</h3>
      <span>{{ postCount }} <i class="fab fa-stack-exchange"></i></span>
      <span>{{ userCount }} <i class="fas fa-users"></i></span>
    </router-link>
  </article>
</template>

<script>
export default {
  name: "TopCommunityItem",
  props: {
    id: Number,
    name: String,
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
    }

    span {
      color: darken($font-color, 50);
    }
  }
}
</style>
