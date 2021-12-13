<template>
  <div ref="loadingContainer" class="vld-parent">
    <h3>Modération</h3>

    <div>
      <h2>Postes rapportés</h2>
      <p v-if="posts.length == 0">Il n'y a aucun poste à modérer.</p>
      <ReportedItem v-for="report in posts" :report="report" :key="report.id" @cancel-report="cancelReport"/>
    </div>

    <div>
      <h2>Commentaires rapportés</h2>
      <p v-if="comments.length == 0">Il n'y a aucun commentaire à modérer.</p>
      <ReportedItem v-for="report in comments" :report="report" :key="report.id" @cancel-report="cancelReport"/>
    </div>
  </div>
</template>

<script>
import ReportedItem from '../Community/ReportedItem.vue';

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

import HelperMixin from "../../mixins/Helper.mixin";

export default {
  name: "ModerationCommunity",
  props: {
    community: Object,
  },
  components: {ReportedItem},
  mixins: [HelperMixin],

  mounted() {
    this.fetchReports();

    this.watcher = this.$watch(
      () => this.$route.params,
      () => {
        if (this.$route.name != "Community") return;
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
      posts: [],
      comments: [],
    };
  },

  methods: {
    async cancelReport(id) {
      this.posts = this.posts.filter(p => p.id !== id);
      this.comments = this.comments.filter(p => p.id !== id);
    },

    async fetchReports() {
      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let response = await this.axios.get(
          "/community/" + this.$route.params.id + "/reports"
        );

        this.posts = response.data.data.posts;
        this.comments = response.data.data.comments;
        console.log(response);

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

</style>
