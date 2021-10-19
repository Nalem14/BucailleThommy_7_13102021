
/**
 * Define the CommunityModerator model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns CommunityModerator model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const CommunityModerator = sequelize.define("CommunityModerator", {
    rights: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
  });

  // Reference Definition
  CommunityModerator.associate = function (models) {
    CommunityModerator.belongsTo(models.Community);
    CommunityModerator.belongsTo(models.User);
  };

  // Return the CommunityModerator model
  return CommunityModerator;
};
