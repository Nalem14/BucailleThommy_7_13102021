/**
 * Define the UserReport model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns UserReport model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const UserReport = sequelize.define("UserReport", {
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
  UserReport.associate = function (models) {
    UserReport.belongsTo(models.User);
    UserReport.belongsTo(models.Community);
  };

  // Return the UserReport model
  return UserReport;
};
