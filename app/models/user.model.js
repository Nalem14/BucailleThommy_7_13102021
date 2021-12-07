const bcrypt = require("bcrypt");
const Helper = require("../helpers");

/**
 * Define the User model
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns User model
 */
module.exports = function (sequelize, DataTypes) {
  // Model Definition
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          notNull: true,
          notEmpty: true,
          len: [5, 255],
        },
        set(value) {
          this.setDataValue("username", Helper.capitalize(value));
        },
      },
      email_hash: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.VIRTUAL,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "Veuillez spécifier un email valide !",
          },
        },
        set(value) {
          // Trigger validation
          this.setDataValue("email", value.toLowerCase());

          // Save encrypted email
          this.setDataValue("email_hash", Helper.encrypt(value.toLowerCase()));
        },
        get() {
          if (this.getDataValue("email_hash") != undefined)
            return Helper.decrypt(this.getDataValue("email_hash"));
          else return "";
        },
      },
      password_hash: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      password: {
        type: DataTypes.VIRTUAL,
        unique: false,
        allowNull: false,
        validate: {
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,18}$/,
            msg: "Le mot de passe doit contenir minimum 6 et maximum 18 caractères, incluant au moins 1 majuscule, 1 minuscule, un nombre et un caractère spécial.",
          },
        },
        set(value) {
          // Trigger validation
          this.setDataValue("password", value);

          // Bcrypt the password
          let hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password_hash", hash);
        },
        get() {
          return this.getDataValue("password_hash");
        },
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        unique: false,
        defaultValue: false,
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
        defaultValue: DataTypes.NOW,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: ["password", "password_hash", "email", "email_hash"],
        },
      },
      scopes: {
        withPassword: {
          attributes: { exclude: ["email", "email_hash"] },
        },
        withEmail: {
          attributes: { exclude: ["password_hash", "password"] },
        },
        withAll: {
          attributes: {},
        },
      },
    }
  );

  // Reference Definition
  User.associate = function (models) {
    User.hasMany(models.Post, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.Community, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.CommunityModerator, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.Follower, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.Follower, {
      foreignKey: "FollowerId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.PrivateMessage, {
      foreignKey: "FromUserId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.Notification, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.UserReport, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.UserReport, {
      foreignKey: "FromUserId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.PostLike, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.PostFavorite, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.PostReport, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.PostComment, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.CommentLike, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    User.hasMany(models.CommentReport, {
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  // User methods
  User.prototype.authenticate = function (plainTextPass) {
    return bcrypt.compareSync(plainTextPass, this.password_hash);
  };

  // Return the User model
  return User;
};
