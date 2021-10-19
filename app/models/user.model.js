const bcrypt = require("bcrypt");
const { pwnedPassword } = require('hibp');
const Helper = require("../services/helper.service");

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
      },
      set(value) {
        this.setDataValue("email", Helper.encrypt(value));
      },
      get() {
        return Helper.decrypt(rawValue);
      }
    },
    password: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      set(value) {
        // Check password strength
        if(!(/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{6,12}$/.test(value))) {
            throw new Error('Le mot de passe doit contenir minimum 6 et maximum 12 caractères, incluant au moins 1 majuscule, 1 minuscule, un nombre et un caractère spécial.');
        }

        // Check pwned password
        pwnedPassword(value).then(nbPwned => {
          if(nbPwned > 0) {
            throw new Error("Ce mot de passe semble compromis.");
          }

          // Bcrypt the password
          bcrypt.hash(value, 10).then((hash) => {
            this.setDataValue("password", hash);
          });
        }).catch(error => {
          throw new Error(error)
        });
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      unique: false,
      allowNull: false,
      defaultValue: false
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
  User.associate = function (models) {
    User.hasMany(models.Post);
    User.hasMany(models.Community);
    User.hasMany(models.CommunityModerator);
    User.hasMany(models.Follower, { foreignKey: "UserId" });
    User.hasMany(models.PrivateMessage, { foreignKey: "FromUserId" });
    User.hasMany(models.Notification);
  };

  // Return the User model
  return User;
};
