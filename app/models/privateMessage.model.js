/**
 * Define the PrivateMessage model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PrivateMessage model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const PrivateMessage = sequelize.define("PrivateMessage", {
    content: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
    seen: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: false,
    },
  });

  // Reference Definition
  PrivateMessage.associate = function (models) {
    PrivateMessage.belongsTo(models.User, { foreignKey: "FromUserId" });
    PrivateMessage.belongsTo(models.User, { foreignKey: "ToUserId" });
  };

  // Return the PrivateMessage model
  return PrivateMessage;
};
