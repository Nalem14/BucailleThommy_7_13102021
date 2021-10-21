const Helper = require("../helpers");
const db = require("../models");

/**
 * Create a Post
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.create = async (req, res) => {
  try {
    if (!("content" in req.body) || !("title" in req.body))
      throw new Error("Veuillez spécifier un contenu et un titre.");

    let community = await db.Community.findByPk(req.params.communityId);
    if (community == null)
      throw new Error("La communauté spécifié est introuvable.");

    await db.Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: req.user.userId,
      CommunityId: community.id,
    });

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read all posts of community
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readAll = async (req, res) => {
  try {
    let community = await db.Community.findByPk(req.params.communityId);
    if (community.length == 0)
      throw new Error("La communauté spécifié est introuvable.");

    let posts = db.Post.findAll({ where: { CommunityId: community.id } });
    if (posts.length == 0)
      throw new Error("Il n'y a aucun poste dans cette communauté.");

    return Helper.successResponse(req, res, { posts }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read one Post by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readOne = async (req, res) => {
  try {
    let post = await db.Post.findByPk(req.params.id);
    if (post == null) throw new Error("Ce poste n'existe pas.");

    return Helper.successResponse(req, res, { post }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Like one Post by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readOne = async (req, res) => {
  try {
    let post = await db.Post.findByPk(req.params.id);
    if (post == null) throw new Error("Ce poste n'existe pas.");

    let like = req.body.like;
    let liked = db.PostLike.findOne({
      where: { UserId: req.user.userId, PostId: post.id },
    });

    // If user want to like
    if (liked == null && like == 1) {
      await db.PostLike.create({
        UserId: req.user.userId,
        PostId: post.id,
      });

      post.likes += 1;
    }

    // If user want to unlike
    if (liked != null && like == 0) {
      await liked.destroy();
      post.likes -= 1;
    }

    // Save post model to update likes count
    await post.save();

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Update one Post by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.update = async (req, res) => {
  try {
    let post = await db.Post.findByPk(req.params.id);
    if (post == null) throw new Error("Ce poste n'existe pas.");

    if(post.UserId != req.user.userId && !req.user.isAdmin)
        throw new Error("Vous n'avez pas la permission de mettre à jour ce poste.");

    if ("title" in req.body) post.title = req.body.title;
    if ("content" in req.body) post.content = req.body.content;

    // Save in db
    await post.save();

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Delete one Post by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
 exports.delete = async (req, res) => {
    try {
      let post = await db.Post.findByPk(req.params.id);
      if (post == null) throw new Error("Ce poste n'existe pas.");
  
      if(post.UserId != req.user.userId && !req.user.isAdmin)
          throw new Error("Vous n'avez pas la permission de supprimer ce poste.");
  
      // Destroy in db
      await post.destroy();
  
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
      title: "Create a Post",
      href: baseUri + "/api/post",
    },
    {
      rel: "readAll",
      method: "GET",
      title: "List all Community Posts",
      href: baseUri + "/api/post/" + (req.params.communityId || ":communityId"),
    },
    {
      rel: "readOne",
      method: "GET",
      title: "Read one Post",
      href: baseUri + "/api/post/" + (req.params.id || ":id"),
    },
    {
      rel: "like",
      method: "POST",
      title: "Like a Post",
      href: baseUri + "/api/post/" + (req.params.id || ":id") + "/like",
    },
    {
      rel: "update",
      method: "PUT",
      title: "Update a Post",
      href: baseUri + "/api/post/" + (req.params.id || ":id") + "/update",
    },
    {
      rel: "delete",
      method: "DELETE",
      title: "Delete a Post",
      href: baseUri + "/api/post/" + (req.params.id || ":id") + "/delete",
    },
  ];
}
