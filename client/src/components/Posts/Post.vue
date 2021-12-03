<template>
  <article>
    <PostHeader
      :id="id"
      :title="title"
      :slug="slug"
      :createdAt="createdAt"
      :comments="comments"
      :Community="Community"
      :User="User"
    />

    <PostFiles :PostFiles="PostFiles" />

    <PostContent :id="id" :title="title" :content="content" />

    <PostFooter
      :id="id"
      :title="title"
      :likes="likes"
      :comments="comments"
      :Community="Community"
      :PostLikes="PostLikes"
      @delete-post="$emit('delete-post', id)"
    />
  </article>
</template>

<script>
import PostHeader from "./PostHeader.vue";
import PostContent from "./PostContent.vue";
import PostFiles from "./PostFiles.vue";
import PostFooter from "./PostFooter.vue";

import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "Post",
  mixins: [HelperMixin],
  emits: ["delete-post"],
  components: {
    PostHeader,
    PostContent,
    PostFiles,
    PostFooter,
  },
  props: {
    id: Number,
    title: String,
    slug: String,
    content: String,
    likes: Number,
    comments: Number,
    createdAt: String,
    updatedAt: String,
    Community: Object,
    User: Object,
    PostFiles: Array,
    PostLikes: Array,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
article {
  display: flex;
  flex-basis: 100%;
  width: 100%;
  flex-direction: column;
  border-radius: 5px;
  background-color: darken($container-color, 5);
  margin-bottom: 40px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

  a {
    color: $font-color;
    text-decoration: none;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>