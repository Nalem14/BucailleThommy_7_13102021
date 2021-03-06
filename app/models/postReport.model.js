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
        validate: {
          len: [5, 255]
        }
      },
    });
  
    // Reference Definition
    PostReport.associate = function (models) {
      PostReport.belongsTo(models.User);
      PostReport.belongsTo(models.Post);
      PostReport.belongsTo(models.Community);
    };
  
    // Return the PostReport model
    return PostReport;
  };
  