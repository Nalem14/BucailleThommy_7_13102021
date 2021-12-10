<template>
  <article>
    <PostHeader v-bind="$props" />

    <template v-if="ParentPost == null">
      <PostFiles
        v-bind="$props"
        @delete-image="this.$emit('delete-image', $event)"
      />

      <PostContent v-bind="$props" @edit-post="this.$emit('edit-post')" />
    </template>

    <blockquote v-else>
      <p>Partagé via</p>
      <PostHeader :v-bind="ParentPost" />

      <PostContent :v-bind="ParentPost" @edit-post="this.$emit('edit-post')" />
    </blockquote>

    <PostFooter
      v-bind="$props"
      @delete-post="this.$emit('delete-post', id)"
      @edit-post="this.$emit('edit-post')"
      @share-post="showShareForm = true"
    />

    <PostShare
      :showForm="showShareForm"
      @close-share-form="showShareForm = false"
      :id="id"
    />
  </article>
</template>

<script>
import PostHeader from "./PostHeader.vue";
import PostContent from "./PostContent.vue";
import PostFiles from "./PostFiles.vue";
import PostFooter from "./PostFooter.vue";
import PostShare from "./PostShare.vue";

import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "Post",
  mixins: [HelperMixin],
  emits: ["delete-post", "delete-image", "edit-post"],
  components: {
    PostHeader,
    PostContent,
    PostFiles,
    PostFooter,
    PostShare,
  },
  props: {
    id: Number,
    title: String,
    content: String,
    likes: Number,
    comments: Number,
    createdAt: String,
    updatedAt: String,
    Community: Object,
    User: Object,
    PostFiles: Array,
    PostLikes: Array,
    PostFavorites: Array,
    ShareFromPostId: Number,
    ParentPost: Object,

    editMode: Boolean,
  },

  data() {
    return {
      showShareForm: false,
    };
  },
  mounted() {
    console.log(this.$props);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
article {
  display: flex;
  position: relative;
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

  blockquote {
    background: darken($container-color, 8);
    border-left: 10px solid #ccc;
    margin: 20px 40px;
    padding: 0.5em 10px;
    quotes: "\201C""\201D""\2018""\2019";
  }
  blockquote:before {
    color: #ccc;
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }

  p {
    font-style: italic;
  }
}
</style>