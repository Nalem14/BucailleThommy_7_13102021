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
    if (
      !("content" in req.body) ||
      !("title" in req.body) ||
      !("communityId" in req.body)
    )
      throw new Error(
        "Veuillez spécifier un titre, un contenu et une communauté pour publier un poste."
      );

    let community = await db.Community.findByPk(req.body.communityId);
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
    if (community == null)
      throw new Error("La communauté spécifié est introuvable.");

    let posts = await community.getPosts();
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
    let post = await db.Post.findByPk(req.params.postId);
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
exports.like = async (req, res) => {
  try {
    let post = await db.Post.findByPk(req.params.postId);
    if (post == null) throw new Error("Ce poste n'existe pas.");

    let like = req.body.like;
    let liked = await db.PostLike.findOne({
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
 * Report a user with reason
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.report = async (req, res) => {
  try {
    let postId = req.params.postId;

    if (!("content" in req.body))
      throw new Error("Veuillez spécifier une raison pour rapporter ce poste");

    await db.PostReport.create({
      UserId: req.user.userId,
      PostId: postId,
      content: req.body.content,
    });

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
    let post = await db.Post.findByPk(req.params.postId);
    if (post == null) throw new Error("Ce poste n'existe pas.");

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
    // All checks for permisions are made in middleware
    let post = await db.Post.findByPk(req.params.postId);
    if (post == null) throw new Error("Ce poste n'existe pas.");

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
      href:
        baseUri +
        "/api/post/community/" +
        (req.params.communityId || ":communityId"),
    },
    {
      rel: "readOne",
      method: "GET",
      title: "Read one Post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId"),
    },
    {
      rel: "like",
      method: "POST",
      title: "Like a Post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId") + "/like",
    },
    {
      rel: "report",
      method: "POST",
      title: "Report a Post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId") + "/report",
    },
    {
      rel: "update",
      method: "PUT",
      title: "Update a Post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId") + "/update",
    },
    {
      rel: "delete",
      method: "DELETE",
      title: "Delete a Post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId") + "/delete",
    },
  ];
}