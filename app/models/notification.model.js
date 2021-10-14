/**
 * Define the Notification model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Notification model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Notification = sequelize.define("Notification", {
    title: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: false,
    },
  });

  // Reference Definition

  // Return the Notification model
  return Notification;
};
