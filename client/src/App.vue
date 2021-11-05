<template>
  <Header />
  <router-view></router-view>
  <Footer />
</template>

<script>
import Header from './views/partials/Header.vue'
import Footer from './views/partials/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>

</style>
