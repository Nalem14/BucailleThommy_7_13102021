
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
    },
    likes: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0
    },
  });

  // Reference Definition
  PostComment.associate = function (models) {
    PostComment.belongsTo(models.Post);
    PostComment.belongsTo(models.User);
    PostComment.hasMany(models.PostComment);
    PostComment.hasMany(models.CommentReport);
    PostComment.hasMany(models.CommentLike);
    PostComment.belongsTo(models.PostComment);
  };

  // Return the PostComment model
  return PostComment;
};
