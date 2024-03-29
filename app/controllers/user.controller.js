const Helper = require("../helpers");
const db = require("../models");
const notifCtrl = require("../controllers/notification.controller");
const fs = require('fs');
const { Op } = require("sequelize");

// Set image path and make folder
const prefixPath = "images/avatar";
const imagePath = "./public/" + prefixPath + "/";
if (!fs.existsSync(imagePath)){
  fs.mkdirSync(imagePath, { recursive: true });
}

exports.readAll = async (req, res) => {
  try {
    // Optionnal search param
    let where = {};
    if ("search" in req.query) {
      where.username = {
        [Op.like]: "%" + req.query.search + "%",
      };
    }

    let limit = 10;
    if('limit' in req.query)
      limit = parseInt(req.query.limit);

    let users = await db.User.findAll({
      where: where,
      limit: limit
    });
    if (users.length == 0) throw new Error("Aucun utilisateur");

    const baseUri = req.protocol + "://" + req.get("host");
    users.forEach(user => {
      // Set image full url
      user.avatar = baseUri + "/" + prefixPath + "/" + user.avatar;
    });

    return Helper.successResponse(req, res, { users }, hateoasUser(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Get user public datas by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readOne = async (req, res) => {
  try {
    let userId = req.params.id;

    let user = await db.User.findByPk(userId);
    if (user == null) throw new Error("Utilisateur introuvable");

    // Set image full url
    const baseUri = req.protocol + "://" + req.get("host");
    user.avatar = baseUri + "/" + prefixPath + "/" + user.avatar;

    return Helper.successResponse(req, res, { user }, hateoasUser(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Follow a User
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.follow = async (req, res) => {
  try {
    let userId = req.params.id;
    let user = await db.User.findByPk(req.user.userId);
    let userToFollow = await db.User.findByPk(userId);
    if (user == null || userToFollow == null)
      throw new Error("Utilisateur introuvable");

    if (user.id === userToFollow.id)
      throw new Error("Vous ne pouvez pas vous suivre vous même.");

    let follow = await db.Follower.findOne({
      where: { UserId: userToFollow.id, FollowerId: user.id },
    });
    if (follow == null) {
      await db.Follower.create({
        UserId: userToFollow.id,
        FollowerId: user.id,
      });

      // Add notification
      await notifCtrl.add(
        userToFollow.id,
        "Nouveau follow",
        user.username + " a commencé à vous suivre"
      );
    }

    return Helper.successResponse(req, res, {}, hateoasUser(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Unfollow a User
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.unfollow = async (req, res) => {
  try {
    let userId = req.params.id;
    let user = await db.User.findByPk(req.user.userId);
    let userToFollow = await db.User.findByPk(userId);
    if (user == null || userToFollow == null)
      throw new Error("Utilisateur introuvable");

    let follow = await db.Follower.findOne({
      where: { UserId: userToFollow.id, FollowerId: user.id },
    });
    if (follow != null) {
      await follow.destroy();
    }

    return Helper.successResponse(req, res, {}, hateoasUser(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Report a user with reason
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.report = async (req, res) => {
  try {
    let userId = req.params.id;

    if (!("content" in req.body))
      throw new Error(
        "Veuillez spécifier une raison pour rapporter cet utilisateur"
      );

    let user = await db.User.findByPk(userId);
    if (user == null) throw new Error("Utilisateur introuvable");

    await db.UserReport.create({
      UserId: user.id,
      FromUserId: req.user.userId,
      content: req.body.content,
      CommunityId: req.body.communityId
    });

    return Helper.successResponse(req, res, {}, hateoasUser(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Delete a user report
 * @param {*} req
 * @param {*} res
 * @returns response
 */
 exports.deleteReport = async (req, res) => {
  try {
    let report = await db.UserReport.findByPk(req.params.reportId);
    if(report == null) throw new Error("Ce rapport n'existe pas.");

    await report.destroy();

    return Helper.successResponse(req, res, {}, hateoasUser(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

function hateoasUser(req) {
  const baseUri = req.protocol + "://" + req.get("host");

  return [
    {
      rel: "readAll",
      method: "GET",
      title: "List all Users",
      href: baseUri + "/api/user",
    },
    {
      rel: "readOne",
      method: "GET",
      title: "Read one User",
      href: baseUri + "/api/user/" + req.params.id,
    },
    {
      rel: "report",
      method: "POST",
      title: "Report a User",
      href: baseUri + "/api/user/" + req.params.id + "/report",
    },
    {
      rel: "follow",
      method: "POST",
      title: "Follow a User",
      href: baseUri + "/api/user/" + req.params.id + "/follow",
    },
    {
      rel: "unfollow",
      method: "DELETE",
      title: "Unfollow a User",
      href: baseUri + "/api/user/" + req.params.id + "/unfollow",
    },
  ];
}
