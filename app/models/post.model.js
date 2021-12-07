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
      validate: {
        len: [5, 255],
      },
    },
    content: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
      validate: {
        len: [20, 5000],
      },
    },
    likes: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0,
    },
    comments: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0,
    },
  });

  // Reference Definition
  Post.associate = function (models) {
    Post.belongsTo(models.Post, { as: "ParentPost", foreignKey: "ShareFromPostId" });
    Post.belongsTo(models.User);
    Post.belongsTo(models.Community);
    Post.hasMany(models.PostLike, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Post.hasMany(models.PostFavorite, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Post.hasMany(models.PostComment, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Post.hasMany(models.Post, {
      as: "ChildPosts",
      foreignKey: "ShareFromPostId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Post.hasMany(models.PostReport, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    Post.hasMany(models.PostFile, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  // Return the Post model
  return Post;
};
