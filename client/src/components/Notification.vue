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
      notifCount: 0,
      msgCount: 0,
      watcher: null,
      watcher2: null,
      watcher3: null,
    };
  },

  mounted() {
    // Count on start
    this.countNotification();
    this.countMessages();

    // Count when logged-in
    this.watcher = this.$watch(
      () => this.isAuthenticated,
      () => {
        if (!this.isAuthenticated) return;
        this.countNotification();
        this.countMessages();

        // Listen to socket events
        this.io.socket.on("notification", () => {
          this.notifCount++;
          this.updateUiCount();
        });

        this.io.socket.on("message:new", () => {
          if (this.$route.name === "Messages") return;

          this.msgCount++;
          this.updateUiCount();
        });
      }
    );

    // Fetch notifs when opened
    this.watcher2 = this.$watch(
      () => this.isOpen,
      () => {
        if (this.isOpen) {
          this.fetchNotifications();
        }
      }
    );

    // Set msg count to 0 when in Messages route
    this.watcher3 = this.$watch(
      () => this.$route.name,
      () => {
        if (this.$route.name === "Messages") {
          this.msgCount = 0;
          this.updateUiCount();
        }
      }
    );
  },
  unmounted() {
    if (this.watcher) this.watcher();
    if (this.watcher2) this.watcher2();
    if (this.watcher3) this.watcher3();
  },

  methods: {
    async countNotification() {
      if (!this.isAuthenticated) return;

      try {
        let response = await this.axios.get("/notification/count");
        this.notifCount = response.data.data.notifications;
        this.updateUiCount();
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
    async countMessages() {
      if (!this.isAuthenticated) return;

      try {
        let response = await this.axios.get("/message/count");
        this.msgCount = response.data.data.messages;
        this.updateUiCount();
      } catch (error) {
        const errorMessage = this.handleErrorMessage(error);

        this.$notify({
          type: "error",
          title: `Erreur lors de la récupération du nombre de messages.`,
          text: `Erreur reporté : ${errorMessage}`,
          duration: 30000,
        });
      }
    },
    updateUiCount() {
      let element = document.getElementById("notification-count");
      element.innerHTML = this.notifCount;

      element = document.getElementById("message-count");
      element.innerHTML = this.msgCount;
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

        this.notifCount = 0;
        this.updateUiCount();

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
            font-size: 0.9rem;
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
