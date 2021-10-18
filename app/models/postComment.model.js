
/**
 * Define the PostComment model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostComment model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const PostComment = sequelize.define("PostComment", {
    content: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    }
  });

  // Reference Definition

  // Return the PostComment model
  return PostComment;
};
