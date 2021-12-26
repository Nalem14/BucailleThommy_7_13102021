<template>
  <article>
    <div>
      <h5 v-if="report.UserReported != undefined">{{ report.UserReported.username }}</h5>
      <h5 v-if="report.Post != undefined">{{ report.Post.title }}</h5>
      <h5 v-if="report.PostComment != undefined">
        {{ report.PostComment.Post.title }}
      </h5>
      <span>Rapporté {{ formatDateTime(report.createdAt) }}</span>
    </div>
    <div>
      <p>Raison: {{ report.content }}</p>
    </div>

    <div>
      <p>
        par
        <router-link
          :to="{
            name: 'Profile',
            params: {
              id: report.User.id,
              name: slugify(report.User.username),
            },
          }"
          >{{ report.User.username }}</router-link
        >
      </p>
      <p>
        <router-link
          v-if="report.UserReported != undefined"
          :to="{
            name: 'Profile',
            params: {
              id: report.UserReported.id,
              name: slugify(report.UserReported.username),
            }
          }"
          >Voir le profil</router-link
        >
        <router-link
          v-if="report.PostComment != undefined"
          :to="{
            name: 'Post',
            params: {
              id: report.PostComment.Post.id,
              slug: slugify(report.PostComment.Post.title),
            },
            hash: '#comment-' + report.PostComment.id,
          }"
          >Voir le commentaire</router-link
        >
        <router-link
          v-if="report.Post != undefined"
          :to="{
            name: 'Post',
            params: {
              id: report.Post.id,
              slug: slugify(report.Post.title),
            },
          }"
          >Voir le poste</router-link
        >
      </p>

      <p>
        <Button danger @click="cancelReport(report)">Annuler</Button>
      </p>
    </div>
  </article>
</template>

<script>
import HelperMixin from "../../mixins/Helper.mixin";
import Button from "../Form/Button.vue";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "ReportedItem",
  components: { Button },
  emits: ['cancel-report'],
  mixins: [HelperMixin],
  props: {
    report: Object,
  },

  methods: {
    async cancelReport(report) {
        let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let type = report.Post != undefined ? "post" : report.PostComment != undefined ? "comment" : "user";
        let id = type === "post" ? report.Post.id : type === "comment" ? report.PostComment.id : report.UserReported.id;
        await this.axios.delete(
          type + "/" + id + "/report/" + report.id
        );

        this.$emit('cancel-report', report.id)
        this.$notify({
          type: "success",
          title: `Le rapport a été annulé.`,
          text: `Il a bien été supprimé.`,
          duration: 5000,
        });

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors du changement des reports`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
article {
  display: flex;
  flex-direction: column;
  margin: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;

  div {
    display: flex;
    margin: 20px;
    flex-direction: row;
    justify-content: space-around;

    span {
      font-style: italic;
    }

    div,
    button {
      margin: 0;
    }
  }

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>
