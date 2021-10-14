const bcrypt = require("bcrypt");

/**
 * Define the Post model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Post model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Post = sequelize.define("Post", {
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
    content: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    comments: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    },
    share_from_post_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
    }
  });

  // Reference Definition

  // Return the Post model
  return Post;
};
