<template>
  <router-link :to="'/p/' + id + '-' + slugify(title)">
    <p>{{ content }}</p>
  </router-link>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "PostContent",
  mixins: [HelperMixin],
  components: {
  },
  props: {
    id: Number,
    title: String,
    content: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
p {
  margin: 10px 20px;
}
</style>