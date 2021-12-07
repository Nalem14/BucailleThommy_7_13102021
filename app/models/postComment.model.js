
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
      validate: {
        len: [5, 255]
      }
    },
    likes: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0
    },
    comments: {
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
    PostComment.hasMany(models.PostComment, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PostComment.hasMany(models.CommentReport, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PostComment.hasMany(models.CommentLike, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    PostComment.belongsTo(models.PostComment);
  };

  // Return the PostComment model
  return PostComment;
};
