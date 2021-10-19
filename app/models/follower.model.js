/**
 * Define the Follower model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Follower model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Follower = sequelize.define("Follower", {

  });

  // Reference Definition
  Follower.associate = function (models) {
    Follower.belongsTo(models.User, { foreignKey: "UserId" });
    Follower.belongsTo(models.User, { foreignKey: "FollowerId" });
    Follower.belongsTo(models.Community);
  };

  // Return the Follower model
  return Follower;
};
