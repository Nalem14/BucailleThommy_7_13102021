
/**
 * Define the Post model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Post model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
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
      defaultValue: 0
    },
    comments: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0
    }
  });

  // Reference Definition
  Post.associate = function (models) {
    Post.belongsTo(models.Post, { foreignKey: "ShareFromPostId" });
    Post.belongsTo(models.User);
    Post.belongsTo(models.Community);
    Post.hasMany(models.PostLike);
    Post.hasMany(models.PostComment);
    Post.hasMany(models.PostSeen);
    Post.hasMany(models.Post, { foreignKey: "ShareFromPostId" });
  };

  // Return the Post model
  return Post;
};
