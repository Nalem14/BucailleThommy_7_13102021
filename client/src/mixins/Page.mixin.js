import { mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations(["shouldShowModules", "setModules"]),
  },
};
