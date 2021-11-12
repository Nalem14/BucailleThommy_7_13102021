import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      // map this._modulesToShow to store.state._modulesToShow
      "_modulesToShow",
    ]),
  },
  methods: {
    shouldShowModule() {
      return (
        this._modulesToShow.length === 0 ||
        this._modulesToShow.includes(this.$options.name)
      );
    },
  },
};
