
/**
 * Define the PostSeen model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostSeen model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const PostSeen = sequelize.define("PostSeen", {

  });

  // Reference Definition
  PostSeen.associate = function (models) {
    PostSeen.belongsTo(models.Post);
    PostSeen.belongsTo(models.User);
  };

  // Return the PostSeen model
  return PostSeen;
};
