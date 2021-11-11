export default {
    install: (app) => {
      // Plugin code goes here

      app.mixin({
        mounted() {
            console.log("debug", JSON.stringify(this))
          // some logic ...
          if('metaDatas' in this) {
            if('title' in this.metaDatas)
                document.title = this.metaDatas.title;
          }
        }
      })
    }
  }