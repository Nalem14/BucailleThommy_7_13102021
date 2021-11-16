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
