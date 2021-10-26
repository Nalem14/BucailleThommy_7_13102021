const Helper = require("../helpers");
const db = require("../models");
const notifCtrl = require("../controllers/notification.controller");
const fs = require("fs");

// Set image path and make folder
const prefixPath = "images/community";
const imagePath = "./public/" + prefixPath + "/";
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

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

    // Set image full url
    const baseUri = req.protocol + "://" + req.get("host");
    communities.forEach((community) => {
      community.icon = baseUri + "/" + prefixPath + "/" + community.icon;
    });

    return Helper.successResponse(req, res, { communities }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Follow a community
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.follow = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null) throw new Error("Communauté introuvable.");

    let follow = await db.Follower.findOne({
      where: { FollowerId: req.user.userId, CommunityId: community.id },
    });
    if (follow == null) {
      await db.Follower.create({
        FollowerId: req.user.userId,
        CommunityId: community.id,
      });

      let user = db.User.findByPk(req.user.userId);
      if (user === null) throw new Error("Utilisateur introuvable");
      await notifCtrl.add(
        community.UserId,
        "Nouveau follow sur " + community.title,
        "Suivie par " + user.username
      );
    }

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Follow a community
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.unfollow = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null) throw new Error("Communauté introuvable.");

    let follow = await db.Follower.findOne({
      where: { FollowerId: req.user.userId, CommunityId: community.id },
    });
    if (follow != null) {
      await follow.destroy();
    }

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Update Community by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.update = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null) throw new Error("Cette communauté n'existe pas.");

    if (community.UserId != req.user.userId) {
      let user = await db.User.findByPk(req.user.userId);
      if (user == null) throw new Error("Utilisateur introuvable");

      if (community.hasCommunityModerator(user)) {
        let moderator = await db.CommunityModerator.findOne({
          where: { UserId: user.id, CommunityId: community.id },
        });
        if (moderator == null) throw new Error("Modérateur introuvable.");

        if (moderator.isAdmin == false)
          throw new Error(
            "Vous n'avez pas la permission de mettre à jour les infos de la communauté"
          );
      }
    }

    // Save new file if sent
    if (req.files && req.files.image) {
      // Get image file
      let image = req.files.image;
      // delete old image
      if (fs.existsSync(imagePath + community.icon))
        fs.unlinkSync(imagePath + community.icon);
      // Move image to public folder
      image.mv(imagePath + image.name);

      community.icon = image.name;
    }

    // Save description about community
    if ("about" in req.body) {
      community.about = req.body.about;
    }

    // Save in db
    await community.save();

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Delete Community by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.delete = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null) throw new Error("Cette communauté n'existe pas.");

    if (community.UserId != req.user.userId && !req.user.isAdmin)
      throw new Error(
        "Vous n'avez pas la permission de supprimer la communauté."
      );

    // Delete image
    if(fs.existsSync(imagePath + community.icon))
        fs.unlinkSync(imagePath + community.icon);

    return Helper.successResponse(req, res, { community }, hateoas(req));
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
    let community = await db.Community.findByPk(req.params.communityId, {
      include: [db.Post, db.CommunityModerator, db.Follower]
    });
    if (community == null) throw new Error("Cette communauté n'existe pas.");

    // Set image full url
    const baseUri = req.protocol + "://" + req.get("host");
    community.icon = baseUri + "/" + prefixPath + "/" + community.icon;

    return Helper.successResponse(req, res, { community }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Add/Update moderator
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.addModerator = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null) throw new Error("Cette communauté n'existe pas.");

    if (community.UserId != req.user.userId)
      throw new Error(
        "Vous n'avez pas la permission de gérer les rôles de la communauté."
      );

    let userModo = await db.User.findOne({ where: { id: req.body.userId } });
    if (userModo == null) throw new Error("Utilisateur introuvable");

    // Search for moderator if exist
    let moderator = await db.CommunityModerator.findOne({
      where: { UserId: userModo.id, CommunityId: community.id },
    });
    if (moderator == null) {
      // If not already moderator, add it
      await db.CommunityModerator.create({
        CommunityId: community.id,
        UserId: req.body.userId,
        isAdmin: req.body.isAdmin == 1 ? 1 : 0,
      });

      await notifCtrl.add(
        req.body.userId,
        "Vous êtes désormais modérateur sur " + community.title,
        "Vous faites désormais parti de l'équipe de modération."
      );
    } else {
      // If already moderator, update fields
      moderator.isAdmin = req.body.isAdmin == 1 ? 1 : 0;
      await moderator.save();
    }

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

exports.deleteModerator = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null) throw new Error("Cette communauté n'existe pas.");

    if (community.UserId != req.user.userId)
      throw new Error(
        "Vous n'avez pas la permission de gérer les rôles de la communauté."
      );

    let moderator = await db.CommunityModerator.findOne({
      where: { UserId: req.body.userId, CommunityId: community.id },
    });
    if (moderator != null) moderator.destroy();

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
      href:
        baseUri +
        "/api/community/" +
        (req.params.communityId || ":communityId"),
    },
    {
      rel: "follow",
      method: "POST",
      title: "Follow a Community",
      href:
        baseUri +
        "/api/community/" +
        (req.params.communityId || ":communityId") +
        "/follow",
    },
    {
      rel: "unfollow",
      method: "DELETE",
      title: "Unfollow a Community",
      href:
        baseUri +
        "/api/community/" +
        (req.params.communityId || ":communityId") +
        "/unfollow",
    },
    {
      rel: "update",
      method: "PUT",
      title: "Update a Community",
      href:
        baseUri +
        "/api/community/" +
        (req.params.communityId || ":communityId"),
    },
    {
      rel: "delete",
      method: "DELETE",
      title: "Delete a Community",
      href:
        baseUri +
        "/api/community/" +
        (req.params.communityId || ":communityId"),
    },
    {
      rel: "addModerator",
      method: "POST",
      title: "Add a moderator",
      href:
        baseUri +
        "/api/community/" +
        (req.params.communityId || ":communityId") +
        "/moderator",
    },
    {
      rel: "deleteModerator",
      method: "DELETE",
      title: "Delete a moderator",
      href:
        baseUri +
        "/api/community/" +
        (req.params.communityId || ":communityId") +
        "/moderator",
    },
  ];
}
