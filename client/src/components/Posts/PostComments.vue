<template>
  <div>
    <PostComment
      v-for="comment in comments"
      :key="comment.id"
      :separator=separator
      v-bind="comment"
    />
  </div>
</template>

<script>
import PostComment from "./PostComment";

export default {
  name: "PostComments",
  components: {
    PostComment,
  },
  props: {
    comments: Array,
    separator: Number
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: 0.1px solid $border-color;
  border-radius: 5px;
  margin-top: 20px;
  background-color: $container-color;
}
</style>
