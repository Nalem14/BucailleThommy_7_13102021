const Helper = require("../helpers");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const socketIO = require("../services/socketio.service");

/**
 * List all conversations
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readAll = async (req, res) => {
  try {

    let messages = await db.PrivateMessage.findAll({
      attributes: [Sequelize.fn("max", Sequelize.col("id"))],
      group: ["FromUserId", "ToUserId"],
      raw: true,
    })
      .then(async function (maxIds) {
        maxIds = maxIds.map((e) => {
          return e['max(`id`)'];
        })
        console.log(maxIds)
        return db.PrivateMessage.findAll({
          attributes: ["id", "FromUserId", "ToUserId", "seen", "createdAt"],
          where: {
            [Op.and]: {
              id: {
                [Op.in]: maxIds,
              },
              [Op.or]: [
                { ToUserId: req.user.userId },
                { FromUserId: req.user.userId },
              ],
            },
          },
          include: [
            { model: db.User, as: "ToUser", attributes: ["id", "username"] },
            { model: db.User, as: "FromUser", attributes: ["id", "username"] },
          ],
          order: [["id", "DESC"]],
        });
      })
      .then(function (result) {
        console.log(result)
        return Promise.resolve(result);
      });

    console.log(messages)
    if (messages.length == 0) throw new Error("Aucun messages");

    return Helper.successResponse(req, res, { messages }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Count not read messages
 * @param {*} req
 * @param {*} res
 * @returns response
 */
 exports.count = async (req, res) => {
  try {
    let messages = await db.PrivateMessage.findAll({
      attributes: ["id"],
      required: false,
      where: {
        ToUserId: req.user.userId,
        seen: 0
      }
    });

    Helper.successResponse(req, res, { messages: messages.length }, hateoas(req));

  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

exports.setMessagesSeen = (from, to) => {
  // Set messages seens
  await db.PrivateMessage.update(
    { seen: "1" },
    {
      where: {
        [Op.or]: [
          { ToUserId: to, FromUserId: from },
        ],
      },
    }
  );
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
      include: [
        { model: db.User, as: "ToUser" },
        { model: db.User, as: "FromUser" },
      ],
      order: [["id", "ASC"]],
      limit: 50,
    });
    if (messages.length == 0)
      throw new Error("Aucun message de cet utilisateur");

    Helper.successResponse(req, res, { messages }, hateoas(req));

    // Set messages seens
    this.setMessagesSeen(req.params.fromUserId, req.user.userId);
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

    let message = await db.PrivateMessage.create({
      ToUserId: parseInt(req.params.toUserId),
      FromUserId: parseInt(req.user.userId),
      content: req.body.content,
      seen: false,
    });

    let from = await message.getFromUser();
    let to = await message.getToUser();
    message = Object.assign(
      {},
      message.dataValues,
      { FromUser: from },
      { ToUser: to }
    );

    // Send to user if connected
    socketIO.sendToUser(req.params.toUserId, "message:new", message);

    // Set messages seens
    this.setMessagesSeen(from.id, to.id)

    return Helper.successResponse(req, res, { message }, hateoas(req));
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
      rel: "count",
      method: "GET",
      title: "Count not read Messages",
      href: baseUri + "/api/message/count",
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
