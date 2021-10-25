const Helper = require("../helpers");
const db = require("../models");
const { Op } = require("sequelize");

/**
 * List all notification from auth user
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readAll = async (req, res) => {
  try {
    let notifications = await db.Notification.findAll({
      where: {
        UserId: req.user.userId,
      },
      order: [["id", "DESC"]],
    });
    if (notifications.length == 0) throw new Error("Aucune notifications");

    // Return notifications
    Helper.successResponse(req, res, { notifications }, hateoas(req));

    // Set notifications seens
    await db.Notification.update(
      { seen: "1" },
      {
        where: {
          UserId: req.user.userId,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Count not-seen notification from auth user
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.count = async (req, res) => {
  try {
    let notifications = await db.Notification.count({
      where: {
        UserId: req.user.userId,
        seen: 0
      },
    });

    return Helper.successResponse(req, res, { notifications }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

function hateoas(req) {
    const baseUri = req.protocol + "://" + req.get("host");
  
    return [
      {
        rel: "readAll",
        method: "GET",
        title: "List all notification of logged-in user",
        href: baseUri + "/api/notification",
      },
      {
        rel: "count",
        method: "GET",
        title: "Count not-seen notification of logged-in user",
        href:
          baseUri + "/api/notification/count",
      },
    ];
  }