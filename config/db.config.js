const { Sequelize } = require("sequelize");
require("dotenv").config();
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

exports.connect = () => {
  let host = process.env.MYSQL_HOST;
  let database = process.env.MYSQL_DATABASE;
  let username = process.env.MYSQL_USERNAME;
  let password = process.env.MYSQL_PASSWORD;
  let port = process.env.MYSQL_PORT;

  const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    logging: log.debug.bind(log),
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  });

  try {
    await sequelize.authenticate();
    console.log("[MySQL] Connection has been established successfully.");
  } catch (error) {
    console.error("[MySQL] Unable to connect to the database:", error);
  }
};
