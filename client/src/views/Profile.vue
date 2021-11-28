<template>
  <section ref="loadingContainer">
    <Posts />
  </section>
</template>

<script>
import { ref } from 'vue';

import Posts from "../components/Posts/Posts.vue"
import PageMixin from "../mixins/Page.mixin"

import { useLoading } from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

export default {
  name: "Profile",
  components: {
    Posts,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true);
    this.setModules(["Profile"]);

    this.loadProfile().then(() => {
      console.log("PROFILE LOADED", this.user)
    })
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
        title: "Profile de John | Groupomania",
        meta: [
          {
            name: "description",
            content: "Profile de John Doe",
          },
        ],
      },
    };
  },

  methods: {
    async loadProfile() {
      let loader = useLoading();
      try {
        loader.show({
          // Optional parameters
          container: this.loadingContainer.value,
          canCancel: false
        });
        let request = await this.fetchUserProfile(this.$route.params.id)
        this.user = request.data.data.user
      }
      catch(error) {
        loader.hide()
        
        this.$notify({
          type: "error",
          title: `Erreur lors du chargement du profil de ${this.$route.params.name}`,
          text: `Erreur reporté : ${error.message}`,
          duration: -1
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
