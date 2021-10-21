const Helper = require("../helpers");
const db = require("../models");

/**
 * Create a Community
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.create = async (req, res) => {
  try {
    if (!("title" in req.body) || !("about" in req.body))
      throw new Error(
        "Veuillez spécifier un titre et la description à propos de la communauté."
      );

    await db.Community.create({
      title: req.body.title,
      about: req.body.about,
      UserId: req.user.userId,
    });

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read all communities
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readAll = async (req, res) => {
  try {
    let communities = await db.Community.findAll();
    if (communities.length == 0) throw new Error("Aucune communauté.");

    return Helper.successResponse(req, res, { communities }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read one Community by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readOne = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null) throw new Error("Cette communauté n'existe pas.");

    return Helper.successResponse(req, res, { community }, hateoas(req));
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
      title: "Create a Community",
      href: baseUri + "/api/community",
    },
    {
      rel: "readAll",
      method: "GET",
      title: "List all Communities",
      href: baseUri + "/api/community",
    },
    {
      rel: "readOne",
      method: "GET",
      title: "Read one Community",
      href: baseUri + "/api/community/" + (req.params.communityId || ":communityId"),
    },
  ];
}
