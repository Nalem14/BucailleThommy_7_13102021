<template>
  <section ref="loadingContainer" class="vld-parent">
    <h2>Administration</h2>
    <h3>Liste des rapports</h3>

    <div>
      <h4>Utilisateurs rapportés</h4>
      <p v-if="users.length == 0">Il n'y a aucun poste à modérer.</p>
      <ReportedItem
        v-for="report in users"
        :report="report"
        :key="report.id"
        @cancel-report="cancelReport"
      />
    </div>

    <div>
      <h4>Postes rapportés</h4>
      <p v-if="posts.length == 0">Il n'y a aucun poste à modérer.</p>
      <ReportedItem
        v-for="report in posts"
        :report="report"
        :key="report.id"
        @cancel-report="cancelReport"
      />
    </div>

    <div>
      <h4>Commentaires rapportés</h4>
      <p v-if="comments.length == 0">Il n'y a aucun commentaire à modérer.</p>
      <ReportedItem
        v-for="report in comments"
        :report="report"
        :key="report.id"
        @cancel-report="cancelReport"
      />
    </div>
  </section>
</template>

<script>
import ReportedItem from "../components/Community/ReportedItem.vue";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

import PageMixin from '../mixins/Page.mixin'

export default {
  name: "Admin",
  components: { ReportedItem },
  mixins: [PageMixin],

  mounted() {
    this.shouldShowModules(false);
    this.fetchReports();

    this.watcher = this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.name != "Admin") return;
        this.fetchReports();
      }
    );
  },
  unmounted() {
    if (this.watcher) this.watcher();
  },

  data() {
    return {
      watcher: null,
      users: [],
      posts: [],
      comments: [],

      metaDatas: {
        title: "Admin | Groupomania",
        meta: [
          {
            name: "description",
            content: "Gestion des reports",
          },
        ],
      },
    };
  },

  methods: {
    async cancelReport(id) {
      this.posts = this.posts.filter((p) => p.id !== id);
      this.comments = this.comments.filter((p) => p.id !== id);
      this.users = this.users.filter((p) => p.id !== id);
    },

    async fetchReports() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let response = await this.axios.get("/auth/admin/reports/");

        this.users = response.data.data.users;
        this.posts = response.data.data.posts;
        this.comments = response.data.data.comments;

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
section {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border: 0.1px solid $border-color;
  border-radius: 5px;
  margin-top: 20px;
  background-color: $container-color;

  h2,
  h3 {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  h3 {
    margin: 0;
  }
  h4 {
    margin: 0 20px;
  }

  p {
    margin: 0 20px;
  }

  > div {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    margin-bottom: 20px;
    justify-content: space-between;
  }
}
</style>
