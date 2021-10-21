const Helper = require("../helpers");
const db = require("../models");

/**
 * Create a Comment
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.create = async (req, res) => {
  try {
    if (
      !("content" in req.body) ||
      !("postId" in req.body)
    )
      throw new Error(
        "Veuillez spécifier un contenu et un poste pour publier un commentaire."
      );

    let post = await db.Post.findByPk(req.body.postId);
    if (post == null)
      throw new Error("Le poste spécifié est introuvable.");

    await db.PostComment.create({
      content: req.body.content,
      UserId: req.user.userId,
      PostId: post.id,
    });

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read all Comments of Post
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readAll = async (req, res) => {
  try {
    let post = await db.Community.findByPk(req.params.postId);
    if (post == null)
      throw new Error("Le poste spécifié est introuvable.");

    let comments = await post.getComments();
    if (comments.length == 0)
      throw new Error("Il n'y a aucun commentaire dans ce poste.");

    return Helper.successResponse(req, res, { posts }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read one Comment by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readOne = async (req, res) => {
  try {
    let comment = await db.PostComment.findByPk(req.params.commentId);
    if (comment == null) throw new Error("Ce commentaire n'existe pas.");

    return Helper.successResponse(req, res, { comment }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Like one Comment by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.like = async (req, res) => {
  try {
    let comment = await db.PostComment.findByPk(req.params.commentId);
    if (comment == null) throw new Error("Ce commentaire n'existe pas.");

    let like = req.body.like;
    let liked = await db.CommentLike.findOne({
      where: { UserId: req.user.userId, CommentId: comment.id },
    });

    // If user want to like
    if (liked == null && like == 1) {
      await db.CommentLike.create({
        UserId: req.user.userId,
        CommentId: comment.id,
      });

      comment.likes += 1;
    }

    // If user want to unlike
    if (liked != null && like == 0) {
      await liked.destroy();
      comment.likes -= 1;
    }

    // Save Comment model to update likes count
    await comment.save();

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Report a Comment with reason
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.report = async (req, res) => {
  try {
    let commentId = req.params.commentId;

    if (!("content" in req.body))
      throw new Error("Veuillez spécifier une raison pour rapporter ce commentaire");

    await db.CommentReport.create({
      UserId: req.user.userId,
      CommentId: commentId,
      content: req.body.content,
    });

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Update one Comment by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.update = async (req, res) => {
  try {
    let comment = await db.PostComment.findByPk(req.params.commentId);
    if (comment == null) throw new Error("Ce commentaire n'existe pas.");

    if ("content" in req.body) comment.content = req.body.content;

    // Save in db
    await comment.save();

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Delete one Comment by id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.delete = async (req, res) => {
  try {
    // All checks for permisions are made in middleware
    let comment = await db.PostComment.findByPk(req.params.commentId);
    if (comment == null) throw new Error("Ce commentaire n'existe pas.");

    // Destroy in db
    await comment.destroy();

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
      title: "Create a Comment",
      href: baseUri + "/api/comment",
    },
    {
      rel: "readAll",
      method: "GET",
      title: "List all Community Comments",
      href:
        baseUri +
        "/api/comment/community/" +
        (req.params.commentId || ":commentId"),
    },
    {
      rel: "readOne",
      method: "GET",
      title: "Read one Comment",
      href: baseUri + "/api/comment/" + (req.params.commentId || ":commentId"),
    },
    {
      rel: "like",
      method: "POST",
      title: "Like a Comment",
      href: baseUri + "/api/comment/" + (req.params.commentId || ":commentId") + "/like",
    },
    {
      rel: "report",
      method: "POST",
      title: "Report a Comment",
      href: baseUri + "/api/comment/" + (req.params.commentId || ":commentId") + "/report",
    },
    {
      rel: "update",
      method: "PUT",
      title: "Update a Comment",
      href: baseUri + "/api/comment/" + (req.params.commentId || ":commentId") + "/update",
    },
    {
      rel: "delete",
      method: "DELETE",
      title: "Delete a Comment",
      href: baseUri + "/api/comment/" + (req.params.commentId || ":commentId") + "/delete",
    },
  ];
}