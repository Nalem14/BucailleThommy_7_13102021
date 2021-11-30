<template>
  <header>
    <nav>
      <div>
        <router-link to="/">
          <h1>Groupomania</h1>
        </router-link>
      </div>

      <ul>
        <li
          v-for="(link, index) in links"
          :key="index"
          @click="'click' in link ? handle_function_call(link.click) : ''"
        >
          <router-link v-if="canAccess(link)" :to="linkTo(link.to)"
            ><i v-if="link.icon.length > 0" :class="link.icon"></i>
            {{ link.label }}
            <b v-if="link.suffix.length > 0" v-html="link.suffix"></b>
          </router-link>
        </li>
      </ul>
    </nav>

    <Notification v-show="showNotifs" :isOpen="showNotifs" />
  </header>
</template>

<script>
import Notification from "../../components/Notification";

export default {
  name: "Header",
  components: {
    Notification,
  },
  methods: {
    toggleNotification() {
      this.showNotifs = !this.showNotifs;
    },
    handle_function_call(function_name) {
      this[function_name]();
    },
    isAuth() {
      return this.$store.getters["user/isAuthenticated"];
    },
    getUser() {
      if(this.isAuth)
        return this.$store.getters["user/user"];
      else return null;
    },
    canAccess(link) {
      if (link.requiresAuth && !this.isAuth()) return false;
      if (link.requiresGuest && this.isAuth()) return false;

      return true;
    },
    linkTo(link) {
      if(link.name == "Profile") {
        if(this.isAuth()) {
          link.params = {
            id: this.getUser().id,
            name: this.getUser().username
          }
        }
      }
      
      return link;
    }
  },
  data() {
    return {
      showNotifs: false,
      links: [
        {
          to: { name: "Home" },
          label: "Tout",
          icon: "fas fa-globe-europe",
          suffix: "",
          requiresAuth: false,
          requiresGuest: false,
        },
        {
          to: { name: "Messages" },
          label: "Message",
          icon: "fas fa-comment-dots",
          suffix: `<span id="message-count">0</span>`,
          requiresAuth: true,
          requiresGuest: false,
        },
        {
          to: "#!",
          label: "Notification",
          icon: "fas fa-bell",
          suffix: `<span id="notification-count">0</span>`,
          requiresAuth: true,
          requiresGuest: false,
          click: "toggleNotification",
        },
        {
          to: { name: "Login" },
          label: "Se connecter",
          icon: "fas fa-sign-in-alt",
          suffix: "",
          requiresAuth: false,
          requiresGuest: true,
        },
        {
          to: { name: "Register" },
          label: "S'inscrire",
          icon: "fas fa-user-plus",
          suffix: "",
          requiresAuth: false,
          requiresGuest: true,
        },
        {
          to: {
            name: "Profile",
            params: {
              id: 0,
              name: 'none',
            },
          },
          label: "Profil",
          icon: "fas fa-user",
          suffix: "",
          requiresAuth: true,
          requiresGuest: false
        },
        {
          to: { name: "Logout" },
          label: "Se déconnecter",
          icon: "fas fa-sign-out-alt",
          suffix: "",
          requiresAuth: true,
          requiresGuest: false,
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../assets/scss/base/reset.scss";

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  background-color: $bg-color;
  color: $font-color;
}

main {
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  @media screen AND (min-width: 768px) {
    flex-direction: row-reverse;
    > aside {
      flex-basis: 50%;
    }
    > section {
      flex-basis: 100%;
    }
  }
}

// H1 to H6
@for $i from 1 through 6 {
  h#{$i} {
    font-size: (1.6em - math.div($i, 10));
    font-weight: bold;
  }
}

p {
  margin-top: 5px;
}

a {
  color: $link-color;
  transition: color 0.2s ease-in-out;

  &:hover {
    transition: color 0.4s ease-in-out;
    color: $font-color;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

header {
  height: auto;
  width: 100%;
  margin-bottom: 40px;

  @media screen AND (min-width: 768px) {
    height: 80px;
  }

  nav {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: $container-color;
    height: 100%;

    @media screen AND (min-width: 768px) {
      box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
        rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
      flex-direction: row;
      justify-content: space-between;
      margin: 0;
    }

    a {
      text-decoration: none;

      h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 15px;
        font-size: 2em;
        font-weight: 700;
        font-family: "Dancing Script", -apple-system, BlinkMacSystemFont,
          "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
          "Helvetica Neue", sans-serif;

        background: -webkit-linear-gradient(
          lighten($color-primary, 5),
          lighten($color-secondary, 5)
        );
        background-clip: text;
        -webkit-text-fill-color: transparent;

        i {
          margin-right: 5px;
        }

        @media screen AND (min-width: 768px) {
          margin-top: 0;
        }
      }
    }
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;

    @media screen AND (min-width: 768px) {
      margin-top: 10px;
    }

    li {
      display: flex;
      flex-direction: row;
      flex-basis: 50%;
      line-height: 50px;
      transition: border 0.2s linear;
      justify-content: center;

      @media screen AND (min-width: 768px) {
        flex-basis: auto;
        line-height: 32px;
      }

      &:hover {
        transition: border 0.4s linear;
      }

      a {
        color: $link-color;
        text-decoration: none;
        transition: opacity 0.2s ease-in-out;
        display: flex;
        margin-right: 20px;

        &:visited {
          color: $link-color;
        }
        &:hover {
          transition: opacity 0.3s ease-in-out;
          opacity: 0.8;
        }

        &.router-link-active {
          font-weight: 700;
          color: darken($font-color, 5);
        }

        i {
          position: relative;
          top: 18px;
          margin-right: 5px;

          @media screen AND (min-width: 768px) {
            top: 8px;
          }
        }

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          top: 14px;
          background-color: $color-secondary;
          color: lighten($font-color, 100);
          height: 24px;
          width: 24px;
          border-radius: 24px;
          margin-left: 5px;
          margin-right: -5px;
          font-size: 0.7em;

          @media screen AND (min-width: 768px) {
            top: 5px;
          }
        }
      }
    }
  }
}

.message-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 10px;
  margin-bottom: 20px;

  &.error-card {
    border: 1px solid darken(rgb(176, 61, 61), 10);
    background-color: rgb(176, 61, 61);
  }
  &.success-card {
    border: 1px solid darken(rgb(42, 133, 64), 10);
    background-color: rgb(42, 133, 64);
  }

  p {
    color: #fff;
    margin: 20px;
  }
}

div.tabs-component {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  background-color: $container-color;

  ul.tabs-component-tabs {
    display: flex;
    flex-direction: row;
    background-color: darken($container-color, 5);
    height: 50px;

    li.tabs-component-tab {
      height: 100%;
      width: 100%;

      &.is-active {
        border-bottom: 1px solid $color-secondary;
      }

      a.tabs-component-tab-a {
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        height: 100%;
        flex-basis: 100%;

        &.is-active {
          color: $font-color;
          font-weight: bold;
        }

        &.is-disabled {
          cursor: not-allowed;
          color: lighten($font-color, 30);
        }
      }
    }
  }

  div.tabs-component-panels {
    section.tabs-component-panel {
      margin: 20px 20px;
    }
  }
}
</style>
