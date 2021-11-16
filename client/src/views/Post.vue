<template>
  <section>
    <h2>{{ post.title }}</h2>
    <Post v-bind="post" />

    <h2>Poster un commentaire</h2>
    <form action="#" method="post">
      <div>
        <textarea
          name="answer-comment"
          id="answer-comment"
          rows="10"
          placeholder="Répondre au poste..."
          maxlength="255"
          validate
          required
        ></textarea>
      </div>

      <Button>Répondre</Button>
    </form>

    <h2 id="comments">Liste des commentaires</h2>
    <PostComments :comments="post.PostComment" separator=0 />
  </section>
</template>

<script>
import Post from "../components/Posts/Post";
import PostComments from "../components/Posts/PostComments";
import PageMixin from "../mixins/Page.mixin";

export default {
  name: "PostPage",
  components: {
    Post,
    PostComments,
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false);
    this.setModules([]);
  },
  data() {
    return {
      post: {
        id: 1,
        title: "Nouveau bureau, nouveau siège !",
        content:
          "Nous sommes ravie de vous annoncer l'arrivée des nouveaux bureaux pour l'équipe !",
        likes: 587,
        comments: 342,
        createdAt: "2021-11-09 14:22:00",
        updatedAt: "2021-11-09 14:22:00",
        User: {
          name: "Nalem",
        },
        Community: {
          id: 1,
          name: "Actualitée",
          slug: "actualitee",
          about: "A propos de cette communauté",
        },
        PostLike: [],
        PostComment: [
          {
            id: 1,
            content: "Mon super commentaire",
            likes: 88,
            comments: 0,
            createdAt: "2021-11-09 14:22:00",
            updatedAt: "2021-11-09 14:22:00",
            User: {
              name: "Nalem",
            },
            PostId: 1,
            PostComment: [
              {
                id: 2,
                content: "Je suis bien d'accord !",
                likes: 88,
                comments: 0,
                createdAt: "2021-11-09 14:22:00",
                updatedAt: "2021-11-09 14:22:00",
                User: {
                  name: "Nalem",
                },
                PostId: 1,
                PostComment: [
                  {
                    id: 5,
                    content: "Ok je plussoie ce discourd de Roi !",
                    likes: 88,
                    comments: 0,
                    createdAt: "2021-11-09 14:22:00",
                    updatedAt: "2021-11-09 14:22:00",
                    User: {
                      name: "Nalem",
                    },
                    PostId: 1,
                    PostComment: [],
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            content: "Mon second super commentaire",
            likes: 88,
            comments: 0,
            createdAt: "2021-11-09 14:22:00",
            updatedAt: "2021-11-09 14:22:00",
            User: {
              name: "Nalem",
            },
            PostId: 1,
            PostComment: [
              {
                id: 4,
                content: "Mais c'est génial !",
                likes: 88,
                comments: 0,
                createdAt: "2021-11-09 14:22:00",
                updatedAt: "2021-11-09 14:22:00",
                User: {
                  name: "Nalem",
                },
                PostId: 1,
                PostComment: [],
              },
            ],
          },
        ],
        Post: [],
        PostReport: [],
        PostFile: [
          {
            id: 1,
            image: "https://source.unsplash.com/random/600x400/?img=1",
          },
        ],
      },
      metaDatas: {
        title: "Mon super poste - poste | Groupomania",
        meta: [
          {
            name: "description",
            content: "La description du super poste",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
form {
  margin: 20px;

  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid $color-secondary;
    border-radius: 15px;
  }

  button {
    margin-top: 20px;
  }
}
section {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: 0.1px solid $border-color;
  border-radius: 5px;
  margin-top: 20px;
  background-color: $container-color;

  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>
