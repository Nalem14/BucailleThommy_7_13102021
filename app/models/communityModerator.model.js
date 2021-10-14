const bcrypt = require("bcrypt");

/**
 * Define the CommunityModerator model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns CommunityModerator model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const CommunityModerator = sequelize.define("CommunityModerator", {
    user_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    community_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    rights: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
  });

  // Reference Definition

  // Return the CommunityModerator model
  return CommunityModerator;
};
