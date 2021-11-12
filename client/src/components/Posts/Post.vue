<template>
  <article>
    <span>
        <router-link to="/">c/{{ Community.slug }}</router-link>
        <small>Posté par <router-link to="/">u/{{ User.name }}</router-link> le {{ createdAt }}</small>
        <Button>Suivre <i class="fas fa-plus-circle"></i></Button>
    </span>
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <ul>
        <li><a href="#!" title="J'aimes">{{ likes }} <i class="far fa-heart"></i></a></li>
        <li><a href="#!" title="Commentaires">{{ comments }} <i class="far fa-comments"></i></a></li>
        <li class="right"><a href="#!" title="Partager"><i class="far fa-share-square"></i></a></li>
        <li class="right"><a href="#!" title="Enregistrer"><i class="far fa-bookmark"></i></a></li>
        <li class="right"><a href="#!" title="Reporter"><i class="far fa-flag"></i></a></li>
    </ul>
  </article>
</template>

<script>
import Button from '../Button.vue'

export default {
  name: "Post",
  components: {
    Button
  },
  props: {
      id: Number,
      title: String,
      content: String,
      likes: Number,
      comments: Number,
      createdAt: String,
      updatedAt: String,
      Community: Object,
      User: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
article {
  display: flex;
  flex-basis: 100%;
  width: 100%;
  flex-direction: column;
  border: .1px solid $border-color;
  border-radius: 5px;
  background-color: darken($container-color, 5);
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }

  span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: darken($font-color, 50);
  }

  h3, p, span {
    margin: 10px 20px;
  }

  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-basis: 100%;
    margin-top: 20px;
    justify-content: center;
    background-color: darken($color-primary, 3);
    border-bottom: .1px solid $border-color;
    border-radius: 5px;

    li {
      display: flex;
      justify-content: flex-start;
      flex-basis: 25%;
      margin: 10px 10px;

      &.right {
        justify-content: flex-end;
      }

      a {
        text-decoration: none;
        color: darken($font-color, 30);
      }
    }
  }
}
</style>