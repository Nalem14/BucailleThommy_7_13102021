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
let User = require("../app/models/user.model");
let Post = require("../app/models/post.model");
let PostLike = require("../app/models/postLike.model");
let PostSeen = require("../app/models/postSeen.model");
let PostComment = require("../app/models/postComment.model");
let Community = require("../app/models/community.model");
let CommunityModerator = require("../app/models/communityModerator.model");
let Follower = require("../app/models/follower.model");
let PrivateMessage = require("../app/models/privateMessage.model");
let Notification = require("../app/models/notification.model");

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
      User = await User(sequelize, DataTypes);
      Post = await Post(sequelize, DataTypes);
      PostLike = await PostLike(sequelize, DataTypes);
      PostSeen = await PostSeen(sequelize, DataTypes);
      PostComment = await PostComment(sequelize, DataTypes);
      Community = await Community(sequelize, DataTypes);
      CommunityModerator = await CommunityModerator(sequelize, DataTypes);
      Follower = await Follower(sequelize, DataTypes);
      PrivateMessage = await PrivateMessage(sequelize, DataTypes);
      Notification = await Notification(sequelize, DataTypes);

      // Reference models
      User.hasMany(Post);
      User.hasMany(Community);
      User.hasMany(CommunityModerator);
      User.hasMany(Follower, { foreignKey: "UserId" });
      User.hasMany(PrivateMessage, { foreignKey: "FromUserId" });
      User.hasMany(Notification);
      Notification.belongsTo(User);
      PrivateMessage.belongsTo(User, { foreignKey: "FromUserId" });
      PrivateMessage.belongsTo(User, { foreignKey: "ToUserId" });
      Community.belongsTo(User);
      Community.hasMany(CommunityModerator);
      Community.hasMany(Follower);
      CommunityModerator.belongsTo(Community);
      CommunityModerator.belongsTo(User);
      Follower.belongsTo(User, { foreignKey: "UserId", });
      Follower.belongsTo(User, { foreignKey: "FollowerId" });
      Follower.belongsTo(Community);
      Post.belongsTo(Post, { foreignKey: "ShareFromPostId" });
      Post.belongsTo(User);
      Post.belongsTo(Community);
      Post.hasMany(PostLike);
      Post.hasMany(PostComment);
      Post.hasMany(PostSeen);
      Post.hasMany(Post, { foreignKey: "ShareFromPostId" });
      PostLike.belongsTo(Post);
      PostLike.belongsTo(User);
      PostSeen.belongsTo(Post);
      PostSeen.belongsTo(User);
      PostComment.belongsTo(Post);
      PostComment.belongsTo(User);
      PostComment.hasMany(PostComment);
      PostComment.belongsTo(PostComment);
      
      // Sync models in DB
      await sequelize.sync({ force: true });
      log.info("[MySQL] All models initialized!");
    })();
  } catch(error) {
    log.error("[MySQL] Error initializing models:", error);
  }
};