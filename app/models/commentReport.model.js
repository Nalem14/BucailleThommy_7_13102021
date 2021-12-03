/**
 * Define the CommentReport model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns CommentReport model
 */
 module.exports = function (sequelize, DataTypes) {
    // Model Definition
    const CommentReport = sequelize.define("CommentReport", {
      content: {
        type: DataTypes.TEXT,
        unique: false,
        allowNull: false,
        validate: {
          len: [5, 255]
        }
      },
    });
  
    // Reference Definition
    CommentReport.associate = function (models) {
      CommentReport.belongsTo(models.User);
      CommentReport.belongsTo(models.PostComment);
      CommentReport.belongsTo(models.Community);
    };
  
    // Return the CommentReport model
    return CommentReport;
  };
  