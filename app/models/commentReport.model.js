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
      },
    });
  
    // Reference Definition
    CommentReport.associate = function (models) {
      CommentReport.belongsTo(models.User);
      CommentReport.belongsTo(models.PostComment);
    };
  
    // Return the CommentReport model
    return CommentReport;
  };
  