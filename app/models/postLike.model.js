
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
  PostLike.associate = function (models) {
    PostLike.belongsTo(models.Post);
    PostLike.belongsTo(models.User);
  };

  // Return the PostLike model
  return PostLike;
};
