
# Frontend App How To

  This folder contain all files related to the Frontsend-side of the application.
  It use VueJS 3.0 to render content and Express to serve files as HTTP server.

## Project setup

Install node modules
```

npm install

```


Copy .env.example file to .env and configure it
```

VUE_APP_BASE_API_URI=http://localhost:3000/api
VUE_APP_EXPRESS_PORT=8080

```

  

### Compiles and hot-reloads for development

```

npm run serve

```

  

### Compiles and minifies for production
Build Client and Server app
```

npm run build

```
You can specify if you want to build Client or Server app
```

npm run build:client
npm run build:server

```

### Run the express server
```

npm run server

```

  

### Lints and fixes files

```

npm run lint

```
