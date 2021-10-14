
/**
 * Define the PostLike model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostLike model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const PostLike = sequelize.define("PostLike", {

  });

  // Reference Definition

  // Return the PostLike model
  return PostLike;
};
