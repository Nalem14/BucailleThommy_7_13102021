const Helper = require("../helpers");
const db = require("../models");
const notifCtrl = require("../controllers/notification.controller");
const fs = require("fs");
const { Op } = require("sequelize");

// Set image path and make folder
const prefixPath = "images/post";
const imagePath = "./public/" + prefixPath + "/";
if (!fs.existsSync(imagePath)) {
  fs.mkdirSync(imagePath, { recursive: true });
}

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

    let post = await db.Post.create({
      title: req.body.title,
      content: req.body.content,
      UserId: req.user.userId,
      CommunityId: community.id,
    });

    return Helper.successResponse(req, res, { post }, hateoas(req));
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
    const communityId = req.params.communityId;
    let posts = null;

    /**
     * Define properties
     */

    // Define optionnal query params
    let { userId, minPostId, maxPostId, limit } = req.query;
    if (limit == undefined || limit < 0 || limit > 100) limit = 10;

    // Set default value
    if(userId == undefined) userId = 0;
    if (minPostId == undefined) minPostId = 0;
    if (maxPostId == undefined) maxPostId = 0;

    // Ensure value type
    userId = parseInt(userId);
    minPostId = parseInt(minPostId);
    maxPostId = parseInt(maxPostId);
    limit = parseInt(limit);

    console.log(userId, minPostId, maxPostId, limit)

    // Define where conditions from query params
    let where = {};
    if (userId > 0) {
      where.UserId = {
        [Op.eq]: userId,
      };
    }

    if (minPostId > 0) {
      where.id = {
        [Op.gt]: minPostId,
      };
    }

    if (maxPostId > 0) {
      where.id = Object.assign({}, where.id || {}, {
        [Op.lt]: maxPostId,
      });
    }

    /**
     * Do query to get results
     */

    // If specify a community, get posts from specific community
    if (communityId > 0) {
      let community = await db.Community.findByPk(communityId);
      if (community == null)
        throw new Error("La communauté spécifié est introuvable.");

      posts = await community.getPosts({
        order: [["id", "DESC"]],
        include: [db.PostFile, { model: db.Post, as: "ParentPost" }, {model: db.Community, include: db.CommunityModerator}, db.User, db.PostLike],
        where: where,
        limit: limit,
      });
    } else {
      // No community specified - Get latest posts in all community
      posts = await db.Post.findAll({
        order: [["id", "DESC"]],
        include: [db.PostFile, { model: db.Post, as: "ParentPost" }, {model: db.Community, include: db.CommunityModerator}, db.User, db.PostLike],
        where: where,
        limit: limit,
      });
    }

    if (posts.length == 0)
      throw new Error("Il n'y a aucun poste à afficher.");

    // Set image full url
    const baseUri = req.protocol + "://" + req.get("host");
    posts.forEach((post) => {
      post.PostFiles.forEach((file) => {
        file.file = baseUri + "/" + prefixPath + "/" + file.file;
      });
    });

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
    let post = await db.Post.findByPk(req.params.postId, {
      include: [db.PostFile, db.PostComment, { model: db.Post, as: "ParentPost" }, {model: db.Community, include: db.CommunityModerator}, db.User, db.PostLike]
    });
    if (post == null) throw new Error("Ce poste n'existe pas.");

    // Set image full url
    const baseUri = req.protocol + "://" + req.get("host");
    post.PostFiles.forEach((file) => {
      file.file = baseUri + "/" + prefixPath + "/" + file.file;
    });

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

      // Add notification
      if (req.user.userId !== post.UserId) {
        let user = await db.User.findByPk(post.UserId);
        if (user === null) throw new Error("Utilisateur introuvable");

        await notifCtrl.add(
          post.UserId,
          "Nouveau like sur " + post.title,
          user.username + " a aimé votre poste"
        );
      }
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
      CommunityId: req.body.communityId,
    });

    let post = await db.Post.findByPk(postId);
    let community = await post.getCommunity();
    let owner = await community.getUser();
    let moderators = await community.getCommunityModerators();
    moderators.forEach(async (moderator) => {
      await notifCtrl.add(
        moderator.UserId,
        community.title + ": Poste rapporté ",
        "Raison: " + req.body.content + "\nPoste: " + post.title
      );
    });

    await notifCtrl.add(
      owner.id,
      community.title + ": Poste rapporté ",
      "Raison: " + req.body.content + "\nPoste: " + post.title
    );

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

    // Delete files
    let files = await post.getPostFiles();
    files.forEach((file) => {
      // Delete image
      if (fs.existsSync(imagePath + file)) fs.unlinkSync(imagePath + file);

      // Delete in db
      file.destroy();
    });

    // Destroy in db
    await post.destroy();

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Read all PostFile on Post id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.readFiles = async (req, res) => {
  try {
    let post = await db.Post.findByPk(req.params.postId);
    if (post == null) throw new Error("Ce poste n'existe pas.");

    // Get image files
    let files = await post.getPostFiles();
    const baseUri = req.protocol + "://" + req.get("host");

    files.forEach((image) => {
      image.file = baseUri + "/" + prefixPath + "/" + image.file;
    });

    return Helper.successResponse(req, res, { files }, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Upload a PostFile on Post id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.upload = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      throw new Error("Aucune image n'as été envoyé.");
    }

    let post = await db.Post.findByPk(req.params.postId);
    if (post == null) throw new Error("Ce poste n'existe pas.");

    // Get image file
    let image = req.files.image;

    // Add file to DB
    await db.PostFile.create({
      PostId: post.id,
      file: image.name,
    });

    // Move image to public folder
    image.mv(imagePath + image.name);

    return Helper.successResponse(req, res, {}, hateoas(req));
  } catch (error) {
    console.error(error);
    return Helper.errorResponse(req, res, error.message);
  }
};

/**
 * Delete one PostFile by Post id
 * @param {*} req
 * @param {*} res
 * @returns response
 */
exports.deleteFile = async (req, res) => {
  try {
    // All checks for permisions are made in middleware
    let post = await db.Post.findByPk(req.params.postId);
    if (post == null) throw new Error("Ce poste n'existe pas.");

    // get image in db
    let image = await db.PostFile.findOne({
      id: req.body.imageId,
      PostId: post.id,
    });

    // delete old image
    if (fs.existsSync(imagePath + image.file))
      fs.unlinkSync(imagePath + image.file);

    // Delete from db
    await image.destroy();

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
      rel: "upload",
      method: "POST",
      title: "Upload a file to a post",
      href: baseUri + "/api/post" + (req.params.postId || ":postId") + "/file",
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
      rel: "readFiles",
      method: "GET",
      title: "Read all files from this post",
      href:
        baseUri + "/api/post/" + (req.params.postId || ":postId") + "/files",
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
      href:
        baseUri + "/api/post/" + (req.params.postId || ":postId") + "/report",
    },
    {
      rel: "update",
      method: "PUT",
      title: "Update a Post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId") + "",
    },
    {
      rel: "delete",
      method: "DELETE",
      title: "Delete a Post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId") + "",
    },
    {
      rel: "deleteFile",
      method: "DELETE",
      title: "Delete a File from this post",
      href: baseUri + "/api/post/" + (req.params.postId || ":postId") + "/file",
    },
  ];
}
