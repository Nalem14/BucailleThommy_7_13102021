
/**
 * Define the PostLike model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostLike model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const PostLike = sequelize.define("PostLike", {
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

  // Return the PostLike model
  return PostLike;
};
