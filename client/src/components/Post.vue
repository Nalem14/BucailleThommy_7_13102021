<template>
  <article>
    <span>
        <router-link to="/">c/{{ Community.slug }}</router-link>
        <small>Posté par {{ User.name }}</small>
    </span>
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <ul>
        <li><a href="#!">{{ likes }} J'aimes</a></li>
        <li><a href="#!">{{ comments }} Commentaires</a></li>
        <li><a href="#!">Partager</a></li>
        <li><a href="#!">Sauvegarder</a></li>
    </ul>
  </article>
</template>

<script>
export default {
  name: "Post",
  props: {
      id: Number,
      title: String,
      content: String,
      likes: Number,
      comments: Number,
      Community: Object,
      User: Object
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
