
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
  PostComment.associate = function (models) {
    PostComment.belongsTo(models.Post);
    PostComment.belongsTo(models.User);
    PostComment.hasMany(models.PostComment);
    PostComment.belongsTo(models.PostComment);
  };

  // Return the PostComment model
  return PostComment;
};
