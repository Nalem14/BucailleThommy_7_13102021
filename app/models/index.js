const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const db = {};

let sequelize;
// Define sequelize config
let host = process.env.MYSQL_HOST || "localhost";
let database = process.env.MYSQL_DATABASE || "groupomania";
let username = process.env.MYSQL_USERNAME || "root";
let password = process.env.MYSQL_PASSWORD || "";
let port = process.env.MYSQL_PORT || 3306;

sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
    console.log("[MySQL] Imported model " + model.name);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
    console.log("[MySQL] Imported references of " + modelName);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;