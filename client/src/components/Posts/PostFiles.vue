<template>
  <div v-if="PostFiles && PostFiles.length > 0">
    <carousel :items-to-show="1">
      <slide v-for="file in PostFiles" :key="file.id">
        <img :src="file.file" alt="Image incluse" height="400" />
      </slide>

      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "PostFiles",
  mixins: [HelperMixin],
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  props: {
    PostFiles: Array,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  width: 100%;
  img {
    width: 100%;
    border: 3px solid #fff;
    border-radius: 15px;
    margin-left: 20px;

    &:last-child {
      margin-right: 20px;
    }
  }
}
</style>