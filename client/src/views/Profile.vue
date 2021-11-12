<template>
  <Posts />
</template>

<script>
import Posts from '../components/Posts/Posts.vue'
import PageMixin from '../mixins/Page.mixin'

export default {
  name: "Home",
  components: {
      Posts
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(true)
    this.setModules(["Profile"])
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
