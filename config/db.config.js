const { Sequelize } = require("sequelize");
const fs = require('fs');
require("dotenv").config();

// Logger
const logsPath = "./logs/MySQL.log";
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
      path: logsPath,
      period: "1d", // daily rotation
      count: 7, // keep 3 back copies
    },
  ],
});

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

// Make logs path if not exist
if (!fs.existsSync(logsPath)){
  fs.mkdirSync(logsPath, { recursive: true });
}

sequelize
  .authenticate()
  .then(() => {
    console.log('[MySQL] Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('[MySQL] Unable to connect to the database:', err);
  });
