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
            Tout
          </router-link>
          <router-link to="/">
            Populaire
          </router-link>
          <router-link to="/">
            Modération
          </router-link>
          <router-link to="/">
            Message
          </router-link>
          <router-link to="/">
            Notification
          </router-link>
          <router-link to="/">
            Créer un poste
          </router-link>
          <router-link to="/">
            Se connecter
          </router-link>
          <router-link to="/">
            S'inscrire
          </router-link>
          <router-link to="/">
            Profil
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
