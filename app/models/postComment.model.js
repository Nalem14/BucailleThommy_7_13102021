const bcrypt = require("bcrypt");

/**
 * Define the PostComment model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostComment model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const PostComment = sequelize.define("PostComment", {
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
    commentary_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
  });

  // Reference Definition

  // Return the PostComment model
  return PostComment;
};
