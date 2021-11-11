export default {
  install: (app) => {
    // Plugin code goes here

    app.mixin({
      mounted() {
        // Set document title if metaDatas is specified in component
        if ("metaDatas" in this) {
          if ("title" in this.metaDatas) document.title = this.metaDatas.title;
        }
      },
    });
  },
};
