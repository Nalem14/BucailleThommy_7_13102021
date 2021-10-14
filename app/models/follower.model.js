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

  // Return the Follower model
  return Follower;
};
