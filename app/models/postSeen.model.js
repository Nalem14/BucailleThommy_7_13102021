
/**
 * Define the PostSeen model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostSeen model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const PostSeen = sequelize.define("PostSeen", {
    user_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    }
  });

  // Reference Definition

  // Return the PostSeen model
  return PostSeen;
};
