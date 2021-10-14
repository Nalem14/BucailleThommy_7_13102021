const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Logger
const bunyan = require("bunyan");
const log = bunyan.createLogger({
  name: "MySQL Driver",
  streams: [
    {
      stream: process.stdout,
      level: "info",
    },
    {
      stream: process.stdout,
      level: "debug",
    },
    {
      stream: process.stderr,
      level: "error",
    },
    {
      type: "rotating-file",
      path: "./logs/MySQL.log",
      period: "1d", // daily rotation
      count: 7, // keep 3 back copies
    },
  ],
});

// Models
const User = require("../app/models/user.model");
const Post = require("../app/models/post.model");
const PostLike = require("../app/models/postLike.model");
const PostSeen = require("../app/models/postSeen.model");
const PostComment = require("../app/models/postComment.model");
const Community = require("../app/models/community.model");
const CommunityModerator = require("../app/models/communityModerator.model");
const Follower = require("../app/models/follower.model");
const PrivateMessage = require("../app/models/privateMessage.model");
const Notification = require("../app/models/notification.model");

exports.connect = async () => {
  // Define sequelize config
  let host = process.env.MYSQL_HOST || "localhost";
  let database = process.env.MYSQL_DATABASE || "groupomania";
  let username = process.env.MYSQL_USERNAME || "root";
  let password = process.env.MYSQL_PASSWORD || "";
  let port = process.env.MYSQL_PORT || 3306;

  // Create sequelize instance and configure
  const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    logging: log.debug.bind(log),
    dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  });

  // Connect to database
  try {
    await sequelize.authenticate();
    log.info("[MySQL] Connection has been established successfully.");
  } catch (error) {
    log.error("[MySQL] Unable to connect to the database:", error);
  }

  // Init models config
  try {
    log.info("[MySQL] Initializing models ...");
    (async () => {
      // Define models
      await User(sequelize, DataTypes);
      await Post(sequelize, DataTypes);
      await PostLike(sequelize, DataTypes);
      await PostSeen(sequelize, DataTypes);
      await PostComment(sequelize, DataTypes);
      await Community(sequelize, DataTypes);
      await CommunityModerator(sequelize, DataTypes);
      await Follower(sequelize, DataTypes);
      await PrivateMessage(sequelize, DataTypes);
      await Notification(sequelize, DataTypes);

      // Reference models
      User.hasMany(Post);
      User.hasMany(Community);
      User.hasMany(CommunityModerator);
      User.hasMany(Follower);
      User.hasMany(PrivateMessage);
      User.hasMany(Notification);
      Notification.belongsTo(User);
      PrivateMessage.belongsTo(User);
      Follower.belongsTo(User);
      Community.belongsTo(User);
      Community.hasMany(CommunityModerator);
      CommunityModerator.belongsTo(Community);
      CommunityModerator.belongsTo(User);
      Community.hasMany(Follower);
      Follower.belongsTo(Community);
      Post.belongsTo(User);
      Post.hasMany(PostLike);
      PostLike.belongsTo(Post);
      PostLike.belongsTo(User);
      Post.hasMany(PostSeen);
      PostSeen.belongsTo(Post);
      PostSeen.belongsTo(User);
      Post.hasMany(PostComment);
      PostComment.belongsTo(Post);
      PostComment.belongsTo(User);
      
      // Sync models in DB
      await sequelize.sync({ force: true });
      log.info("[MySQL] All models initialized!");
    })();
  } catch(error) {
    log.error("[MySQL] Error initializing models:", error);
  }
};