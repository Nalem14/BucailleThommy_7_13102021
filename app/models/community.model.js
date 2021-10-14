
/**
 * Define the Community model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Community model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Community = sequelize.define("Community", {
    user_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    title: {
      type: DataTypes.VARCHAR,
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
