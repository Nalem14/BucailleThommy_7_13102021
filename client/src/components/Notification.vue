<template>
  <div class="notification" ref="loadingContainer">
    <h2>Mes notifications</h2>
    <ul>
      <li
        :class="notif.seen ? '' : 'notification__item--not-seen'"
        v-for="notif in notifications"
        :key="notif.id"
      >
        <a href="#!">
          <h3>
            {{ notif.title }}
            <small>{{ formatDateTime(notif.createdAt) }}</small>
          </h3>
          <p>{{ notif.content }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import HelperMixin from "../mixins/Helper.mixin";

import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

export default {
  name: "Notification",
  mixins: [HelperMixin],
  components: {},
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      notifications: [],
      countInterval: null
    };
  },


  beforeUnmount() {
    clearInterval(this.countInterval)
  },
  mounted() {
    // Count on start
    this.countNotification();
    // Count very 30s
    this.countInterval = setInterval(this.countNotification, 30000);

    // Count when logged-in
    this.$watch(
      () => this.isAuthenticated,
      () => {
        if (this.isAuthenticated) this.countNotification();
      }
    );

    // Fetch notifs when opened
    this.$watch(
      () => this.isOpen,
      () => {
        if (this.isOpen) {
          this.fetchNotifications();
        }
      }
    );
  },


  methods: {
    async countNotification() {
      if (!this.isAuthenticated) return;

      try {
        let response = await this.axios.get("/notification/count");
        let element = document.getElementById("notification-count");

        element.innerHTML = response.data.data.notifications;
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de la récupération du nombre de notification.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },

    async fetchNotifications() {
      if (!this.isAuthenticated) return;

      let loader = useLoading();

      try {
        loader.show({
          // Optional parameters
          container: this.$refs.loadingContainer,
        });

        let response = await this.axios.get("/notification");
        this.notifications = response.data.data.notifications;

        await this.countNotification()

        loader.hide();
      } catch (error) {
        loader.hide();
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de la récupération des notifications.`,
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
.notification {
  background-color: $container-color;
  border: 1px solid $border-color;
  border-top: none;
  border-radius: 5px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  z-index: 5;
  max-height: 400px;
  overflow-y: auto;
  position: relative;

  @media screen AND (min-width: 768px) {
    max-width: 400px;
    position: absolute;
    top: 95px;
    right: 0;
  }

  h2 {
    text-align: center;
  }

  ul {
    display: flex;
    flex-direction: column;

    li {
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid $border-color;


      &.notification__item--not-seen {
        background-color: lighten($container-color, 5);
      }

      a {
        display: flex;
        flex-direction: column;
        color: $font-color;

        h3 {
          font-size: 1.1rem;

          small {
            display: block;
            font-size: .9rem;
            color: lighten($font-color, 30);
            text-align: right;
            font-style: italic;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
