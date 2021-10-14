
/**
 * Define the Community model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Community model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Community = sequelize.define("Community", {
    title: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
  });

  // Reference Definition

  // Return the Community model
  return Community;
};
