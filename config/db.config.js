const { Sequelize } = require("sequelize");
require('dotenv').config();

exports.connect = () => {
  const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  });

  try {
    await sequelize.authenticate();
    console.log("[MySQL] Connection has been established successfully.");
  } catch (error) {
    console.error("[MySQL] Unable to connect to the database:", error);
  }
};