<template>
  <section ref="loadingContainer">
    <Posts />
  </section>
</template>

<script>
import { ref } from 'vue';

import Posts from "../components/Posts/Posts.vue"
import PageMixin from "../mixins/Page.mixin"

export default {
  name: "Profile",
  components: {
    Posts,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true);
    this.setModules(["Profile"]);
  },
  setup() {
    let loadingContainer = ref(null)

    return {
      loadingContainer
    }
  },
  data() {
    return {
      user: null,

      metaDatas: {
        title: `Profile de ${this.$route.params.name} | Groupomania`,
        meta: [
          {
            name: "description",
            content: `Profile utilisateur de ${this.$route.params.name}`,
          },
        ],
      },
    };
  },

  methods: {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
