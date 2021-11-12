<template>
  <section>
    <h2>Mon Profil</h2>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: "Home",
  components: {
  },
  mounted() {
    this.shouldShowModules(true)
  },
  methods: {
    ...mapMutations([
      "shouldShowModules"
    ]),
  },
  data() {
    return {
      metaDatas: {
        title: "Profile",
        meta: [
          {
            name: "description",
            content:
              "Profile de John Doe",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
