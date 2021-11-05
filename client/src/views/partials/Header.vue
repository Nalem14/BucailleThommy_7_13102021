<template>
  <header>
    <nav>
      <div>
        <router-link to="/">
          <h1>Groupomania</h1>
        </router-link>
      </div>
      <ul>
        <li>
          <router-link to="/">
            <i class="fas fa-home"></i> Accueil
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
