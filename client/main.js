const path = require("path");
const express = require("express");
const fs = require("fs");
const { renderToString } = require("@vue/server-renderer");
const manifest = require("./dist/server/ssr-manifest.json");
require("dotenv").config();

// Init express
const server = express();
const PORT = process.env.VUE_APP_EXPRESS_PORT||8080;

// Get main.js file compiled
const appPath = path.join(__dirname, "./dist", "server", manifest["app.js"]);
const createApp = require(appPath).default;

// Define files to be served directly by url
server.use(
  "/img",
  express.static(path.join(__dirname, "./dist/client", "img"))
);
server.use("/js", express.static(path.join(__dirname, "./dist/client", "js")));
server.use(
  "/css",
  express.static(path.join(__dirname, "./dist/client", "css"))
);
server.use(
  "/favicon.ico",
  express.static(path.join(__dirname, "./dist/client", "favicon.ico"))
);

// Get HTML template string
const indexTemplate = fs.readFileSync(
  path.join(__dirname, "/dist/client/index.html"),
  "utf-8"
);

// Get metaDatas on the current route (from the route component)
function getMeta(router, url) {
  // Define metaDatas to object
  let metaDatas = {
    title: "Groupomania"
  };

  // Get main component route
  let route = router.getRoutes().filter((r) => r.path == url)[0] || null;
  if(route === null)
    return metaDatas;

  let defaultComponent = route.components.default || null;
  if(defaultComponent === null)
    return metaDatas;

  if (
    typeof defaultComponent.data === "function" &&
    "metaDatas" in defaultComponent.data()
  )
    metaDatas = defaultComponent.data().metaDatas || {};

  // Iterate all components to find last metaDatas
  var findLastComponentMetaDatas = function (component) {
    let tmpMetaDatas = null;

    if (typeof component === "undefined") return tmpMetaDatas;

    if (
      typeof component.data === "function" &&
      "metaDatas" in component.data()
    ) {
      let tmp = component.data().metaDatas;
      if (tmp !== null) tmpMetaDatas = tmp;
    }

    for (var i in component.components) {
      let subComponent = component.components[i];

      if (
        typeof subComponent.data === "function" &&
        "metaDatas" in subComponent.data()
      ) {
        let tmp = subComponent.data().metaDatas;
        if (tmp !== null) tmpMetaDatas = tmp;
      }

      if ("components" in subComponent) {
        let tmp = findLastComponentMetaDatas(subComponent);
        if (tmp !== null) tmpMetaDatas = tmp;
      }
    }

    return tmpMetaDatas;
  };

  // Find last metaDatas
  let tmpMetaDatas = findLastComponentMetaDatas(defaultComponent);
  if (tmpMetaDatas !== null) metaDatas = tmpMetaDatas;

  return metaDatas;
}

// Define title and meta datas function
String.prototype.setHeadAttr = function (type, value) {
  if (type == "meta") {
    // If meta array, create meta tag for each element
    let html = this;
    for (let i = 0; i < value.length; i++) {
      let meta = value[i];
      html = this.toString().replace(
        `{{ ${type} }}`,
        `{{ ${type} }}<meta name="${meta.name}" content="${meta.content}">`
      );
    }

    return html;
  } else {
    // Define tag directly
    return this.toString().replace(`{{ ${type} }}`, value);
  }
};

server.get("*", async (req, res) => {
  const { app, router } = createApp();

  await router.push(req.url);
  await router.isReady();

  // Get meta datas
  let meta = getMeta(router, req.url);
  let metaKeys = Object.keys(meta);

  // Define current html template
  let html = indexTemplate;

  // Define Head datas (title, meta...)
  for (let i = 0; i < metaKeys.length; i++) {
    html = html.setHeadAttr(metaKeys[i], meta[metaKeys[i]]);
  }
  html = html.replace("{{ meta }}", "");

  // Render components content fo the app page
  const appContent = await renderToString(app);

  html = html
    .toString()
    .replace('<div id="app">', `<div id="app">${appContent}`);

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

console.log(`You can navigate to http://localhost:${PORT}`);

// Listen express server
server.listen(PORT);
