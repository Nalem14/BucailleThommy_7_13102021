
/**
 * Define the PostFavorite model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostFavorite model
 */
 module.exports = function (sequelize, DataTypes) {
    // Model Definition
    const PostFavorite = sequelize.define("PostFavorite", {
  
    });
  
    // Reference Definition
    PostFavorite.associate = function (models) {
      PostFavorite.belongsTo(models.Post);
      PostFavorite.belongsTo(models.User);
    };
  
    // Return the PostFavorite model
    return PostFavorite;
  };
  