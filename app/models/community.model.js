const slugify = require('slugify')

/**
 * Define the Community model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns Community model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const Community = sequelize.define("Community", {
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value) {
        this.setDataValue("slug", slugify(value.toLowerCase()));
      }
    },
    title: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      set(value) {
        this.setDataValue("title", value);
        this.setDataValue("slug", slugify(value.toLowerCase()));
      }
    },
    about: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    }
  });

  // Reference Definition
  Community.associate = function (models) {
    Community.belongsTo(models.User);
    Community.hasMany(models.CommunityModerator);
    Community.hasMany(models.Follower);
    Community.hasMany(models.Post);
    Community.hasMany(models.PostReport);
    Community.hasMany(models.CommentReport);
    Community.hasMany(models.UserReport);
  };
  
  // Return the Community model
  return Community;
};
