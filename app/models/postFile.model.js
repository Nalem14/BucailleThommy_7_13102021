
/**
 * Define the PostFile model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns PostFile model
 */
 module.exports = function (sequelize, DataTypes) {
    // Model Definition
    const PostFile = sequelize.define("PostFile", {
      file: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
    });
  
    // Reference Definition
    PostFile.associate = function (models) {
      PostFile.belongsTo(models.Post);
    };
  
    // Return the PostFile model
    return PostFile;
  };
  