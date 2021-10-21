/**
 * Define the PostReport model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostReport model
 */
 module.exports = function (sequelize, DataTypes) {
    // Model Definition
    const PostReport = sequelize.define("PostReport", {
      content: {
        type: DataTypes.TEXT,
        unique: false,
        allowNull: false,
      },
    });
  
    // Reference Definition
    PostReport.associate = function (models) {
      PostReport.belongsTo(models.User);
    };
  
    // Return the PostReport model
    return PostReport;
  };
  