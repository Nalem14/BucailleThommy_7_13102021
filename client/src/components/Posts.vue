<template>
  <section>
    <h2>Liste des postes</h2>
    <Post v-for="post in posts" :key="post.id" v-bind="post" />
  </section>
</template>

<script>
import Post from "./Post";

export default {
  name: "Posts",
  components: {
    Post
  },
  data() {
    return {
      posts: [
        {
          id: 1,
          title: "Nouveau bureau, nouveau siège !",
          content: "Nous sommes ravie de vous annoncer l'arrivée des nouveaux bureaux pour l'équipe !",
          likes: 587,
          comments: 342,
          createdAt: "2021-11-09 14:22:00",
          updatedAt: "2021-11-09 14:22:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Actualitée",
            slug: "actualitee",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
        {
          id: 2,
          title: "Rendez-vous annuel confirmé",
          content: "Le rendez-vous annuel est confirmé par le siège pour le 24/12/2021 à 20H00. Tout le personnel y est conviés.",
          likes: 120,
          comments: 80,
          createdAt: "2021-11-05 23:12:00",
          updatedAt: "2021-11-05 23:12:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Réunion",
            slug: "reunion",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
        {
          id: 3,
          title: "Rendez-vous annuel confirmé",
          content: "Le rendez-vous annuel est confirmé par le siège pour le 24/12/2021 à 20H00. Tout le personnel y est conviés.",
          likes: 120,
          comments: 80,
          createdAt: "2021-11-05 23:12:00",
          updatedAt: "2021-11-05 23:12:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Réunion",
            slug: "reunion",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
        {
          id: 4,
          title: "Rendez-vous annuel confirmé",
          content: "Le rendez-vous annuel est confirmé par le siège pour le 24/12/2021 à 20H00. Tout le personnel y est conviés.",
          likes: 120,
          comments: 80,
          createdAt: "2021-11-05 23:12:00",
          updatedAt: "2021-11-05 23:12:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Réunion",
            slug: "reunion",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
        {
          id: 5,
          title: "Rendez-vous annuel confirmé",
          content: "Le rendez-vous annuel est confirmé par le siège pour le 24/12/2021 à 20H00. Tout le personnel y est conviés.",
          likes: 120,
          comments: 80,
          createdAt: "2021-11-05 23:12:00",
          updatedAt: "2021-11-05 23:12:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Réunion",
            slug: "reunion",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
        {
          id: 6,
          title: "Rendez-vous annuel confirmé",
          content: "Le rendez-vous annuel est confirmé par le siège pour le 24/12/2021 à 20H00. Tout le personnel y est conviés.",
          likes: 120,
          comments: 80,
          createdAt: "2021-11-05 23:12:00",
          updatedAt: "2021-11-05 23:12:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Réunion",
            slug: "reunion",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
        {
          id: 7,
          title: "Rendez-vous annuel confirmé",
          content: "Le rendez-vous annuel est confirmé par le siège pour le 24/12/2021 à 20H00. Tout le personnel y est conviés.",
          likes: 120,
          comments: 80,
          createdAt: "2021-11-05 23:12:00",
          updatedAt: "2021-11-05 23:12:00",
          User: {
            name: "Nalem"
          },
          Community: {
            name: "Réunion",
            slug: "reunion",
            about: "A propos de cette communauté"
          },
          PostLike: [

          ],
          PostComment: [

          ],
          Post: [

          ],
          PostReport: [

          ],
          PostFile: [

          ]
        },
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/scss/main.scss";

section {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: .1px solid lighten($color-primary, 10);
  border-radius: 5px;
  margin-top: 20px;
  
  h2 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>
