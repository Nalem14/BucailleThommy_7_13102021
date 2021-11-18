<template>
  <div class="notification">
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
            <small>le {{ notif.createdAt }}</small>
          </h3>
          <p>{{ notif.content }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Notification",
  components: {},
  data() {
    return {
      notifications: [
        {
          id: 1,
          title: "Nouveau post",
          content: "Il y a un nouveau post",
          createdAt: "2021-11-18 17:49:00",
          updatedAt: "2021-11-18 17:49:00",
          seen: false,
        },
        {
          id: 2,
          title: "Nouveau post",
          content: "Il y a un nouveau post",
          createdAt: "2021-11-18 17:49:00",
          updatedAt: "2021-11-18 17:49:00",
          seen: false,
        },
        {
          id: 3,
          title: "Nouveau post",
          content: "Il y a un nouveau post",
          createdAt: "2021-11-18 17:49:00",
          updatedAt: "2021-11-18 17:49:00",
          seen: true,
        },
        {
          id: 4,
          title: "Nouveau post",
          content: "Il y a un nouveau post",
          createdAt: "2021-11-18 17:49:00",
          updatedAt: "2021-11-18 17:49:00",
          seen: true,
        },
        {
          id: 5,
          title: "Nouveau post",
          content: "Il y a un nouveau post",
          createdAt: "2021-11-18 17:49:00",
          updatedAt: "2021-11-18 17:49:00",
          seen: true,
        },
        {
          id: 6,
          title: "Nouveau post",
          content: "Il y a un nouveau post",
          createdAt: "2021-11-18 17:49:00",
          updatedAt: "2021-11-18 17:49:00",
          seen: true,
        },
      ],
    };
  },
  mounted() {
    this.fetchNotifications();
    this.setSeen();
  },
  methods: {
    fetchNotifications() {
      // Fetch notif...
    },
    setSeen() {
      // Set all notif's to seen state
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.notification {
  background-color: darken($container-color, 2);
  border: 1px solid $border-color;
  border-top-color: #fff;
  border-radius: 5px;
  position: relative;
  z-index: 5;
  max-height: 400px;
  overflow-y: auto;

  @media screen AND (min-width: 768px) {
    max-width: 400px;
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
      border: 1px solid $color-secondary;

      &.notification__item--not-seen {
        background-color: lighten($container-color, 5);
      }

      a {
        display: flex;
        flex-direction: column;

        h3 {
          font-size: 1.1em;
        }
      }
    }
  }
}
</style>
