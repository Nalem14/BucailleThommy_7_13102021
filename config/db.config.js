const { Sequelize } = require("sequelize");
require("dotenv").config();

exports.connect = () => {
  let host = process.env.MYSQL_HOST;
  let database = process.env.MYSQL_DATABASE;
  let username = process.env.MYSQL_USERNAME;
  let password = process.env.MYSQL_PASSWORD;
  let port = process.env.MYSQL_PORT;

  const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  });

  try {
    await sequelize.authenticate();
    console.log("[MySQL] Connection has been established successfully.");
  } catch (error) {
    console.error("[MySQL] Unable to connect to the database:", error);
  }
};
