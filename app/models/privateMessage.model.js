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
      validate: {
        len: [1, 1000]
      }
    },
    seen: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: false,
    },
  });

  // Reference Definition
  PrivateMessage.associate = function (models) {
    PrivateMessage.belongsTo(models.User, { foreignKey: "FromUserId", as: "FromUser" });
    PrivateMessage.belongsTo(models.User, { foreignKey: "ToUserId", as: "ToUser" });
  };

  // Return the PrivateMessage model
  return PrivateMessage;
};
