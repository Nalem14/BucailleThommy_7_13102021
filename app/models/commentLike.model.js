
/**
 * Define the CommentLike model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns CommentLike model
 */
 module.exports = function (sequelize, DataTypes) {
    // Model Definition
    const CommentLike = sequelize.define("CommentLike", {
  
    });
  
    // Reference Definition
    CommentLike.associate = function (models) {
      CommentLike.belongsTo(models.PostComment);
      CommentLike.belongsTo(models.User);
    };
  
    // Return the CommentLike model
    return CommentLike;
  };
  