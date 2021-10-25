const Helper = require("../helpers");
const db = require("../models");
const { Op } = require("sequelize");

/**
 * List all conversations
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readAll = async (req, res) => {
  try {
    let messages = await db.PrivateMessage.findAll({
      where: {
        ToUserId: req.user.userId,
      },
      group: ["FromUserId"],
      order: [["id", "DESC"]],
    });

    if (messages.length == 0) throw new Error("Aucun messages");

    return Helper.successResponse(req, res, { messages }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read all Private Message from specified user
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readFrom = async (req, res) => {
  try {
    let messages = await db.PrivateMessage.findAll({
      where: {
        [Op.or]: [
          { ToUserId: req.user.userId, FromUserId: req.params.fromUserId },
          { ToUserId: req.params.fromUserId, FromUserId: req.user.userId },
        ],
      },
      order: [["id", "DESC"]],
      limit: 50,
    });
    if (messages.length == 0)
      throw new Error("Aucun message de cet utilisateur");

    Helper.successResponse(req, res, { messages }, hateoas(req));

    // Set messages seens
    await db.PrivateMessage.update(
      { seen: "1" },
      {
        where: {
          ToUserId: req.user.userId,
          FromUserId: req.params.fromUserId,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Create a Private Message
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.create = async (req, res) => {
  try {
    if (!("content" in req.body))
      throw new Error("Veuillez spécifier un message");

    await db.PrivateMessage.create({
      ToUserId: req.params.toUserId,
      FromUserId: req.user.userId,
      content: req.body.content,
      seen: false,
    });

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

function hateoas(req) {
  const baseUri = req.protocol + "://" + req.get("host");

  return [
    {
      rel: "create",
      method: "POST",
      title: "Create a Message",
      href: baseUri + "/api/message",
    },
    {
      rel: "readAll",
      method: "GET",
      title: "List all conversations",
      href: baseUri + "/api/message",
    },
    {
      rel: "readFrom",
      method: "GET",
      title: "Read messages from User",
      href:
        baseUri + "/api/message/" + (req.params.fromUserId || ":fromUserId"),
    },
  ];
}
