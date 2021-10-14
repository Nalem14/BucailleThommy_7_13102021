const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Logger
const bunyan = require("bunyan");
const log = bunyan.createLogger({
  name: "MySQL Driver",
  streams: [
    {
      stream: process.stdout,
      level: "info",
    },
    {
      stream: process.stdout,
      level: "debug",
    },
    {
      stream: process.stderr,
      level: "error",
    },
    {
      type: "rotating-file",
      path: "./logs/MySQL.log",
      period: "1d", // daily rotation
      count: 7, // keep 3 back copies
    },
  ],
});

// Models
const User = require("../app/models/user.model");
const Post = require("../app/models/post.model");
exports.connect = async () => {
  // Define sequelize config
  let host = process.env.MYSQL_HOST || "localhost";
  let database = process.env.MYSQL_DATABASE || "groupomania";
  let username = process.env.MYSQL_USERNAME || "root";
  let password = process.env.MYSQL_PASSWORD || "";
  let port = process.env.MYSQL_PORT || 3306;

  // Create sequelize instance and configure
  const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    logging: log.debug.bind(log),
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  });

  // Connect to database
  try {
    await sequelize.authenticate();
    log.info("[MySQL] Connection has been established successfully.");
  } catch (error) {
    log.error("[MySQL] Unable to connect to the database:", error);
  }

  // Init models config
  try {
    log.info("[MySQL] Initializing models ...");
    (async () => {
      await User(sequelize, DataTypes);
      await Post(sequelize, DataTypes);
      await sequelize.sync({ force: true });
    })();
  } catch(error) {
    log.error("[MySQL] Error initializing models:", error);
  }
};