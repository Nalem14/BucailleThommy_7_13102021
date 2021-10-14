/**
 * Define the Follower model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Follower model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Follower = sequelize.define("Follower", {
    user_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    community_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    follower_id: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: false,
      },
  });

  // Reference Definition

  // Return the Follower model
  return Follower;
};
