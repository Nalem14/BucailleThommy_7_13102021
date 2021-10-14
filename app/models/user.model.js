const bcrypt = require("bcrypt");

/**
 * Define the User model
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns User model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isAlphanumeric: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      set(value) { // Bcrypt the password
        bcrypt.hash(value, 10).then((hash) => {
          this.setDataValue("password", hash);
        });
      },
      validate: {
        is: /^[0-9a-fA-F$#_]{64}$/i,
        len: [6,12]
      }
    },
    avatar: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: true,
    },
    about: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    },
    lastseenAt: {
      type: DataTypes.DATE,
      unique: false,
      allowNull: false,
      defaultValue: sequelize.NOW,
    },
  });

  // Reference Definition


  // Return the User model
  return User;
};
