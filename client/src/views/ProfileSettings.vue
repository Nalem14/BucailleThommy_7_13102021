<template>
  <tabs :options="{ useUrlFragment: false }">
    <tab name="Compte">
        <Account />
    </tab>
    <tab name="Profil">
        <Profile />
    </tab>
    <tab name="Sécurité et Confidentialité">
        <Security />
    </tab>
  </tabs>
</template>

<script>
import PageMixin from "../mixins/Page.mixin"
import { Tabs, Tab } from "vue3-tabs-component"
import Account from "../components/Profile/Account"
import Profile from '../components/Profile/Profile'
import Security from '../components/Profile/Security'

export default {
  name: "ProfileSettings",
  components: {
    Tabs,
    Tab,
    Account,
    Profile,
    Security
  },
  mixins: [PageMixin],
  mounted() {
    this.shouldShowModules(false);
  },
  data() {
    return {
      metaDatas: {
        title: "Paramètre du compte | Groupomania",
        meta: [
          {
            name: "description",
            content: "Gestion du compte utilisateur",
          },
        ],
      },
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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

      &.is-disabled {
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
