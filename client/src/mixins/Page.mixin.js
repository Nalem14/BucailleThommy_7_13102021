import { mapMutations, mapGetters } from "vuex";

export default {
  mounted() {
    if (this.$route.hash.length > 0)
      setTimeout(() => this.scrollFix(this.$route.hash), 1);
  },
  methods: {
    scrollFix: function (hashbang) {
      if (hashbang.length > 0) location.href = hashbang;
    },
    ...mapMutations(["shouldShowModules", "setModules"])
  },
  computed: {
    ...mapGetters("axios",[
      "axios"
    ])
  }
};
