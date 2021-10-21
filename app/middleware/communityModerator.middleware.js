const Helper = require("../helpers");
const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    let community = null;
    let post = null;
    let comment = null;

    let isModerator = false;
    let isAdmin = false;
    let isAuthor = false;
    let isOwner;

    // Find for community
    if (req.params.communityId) {
      community = await db.Community.findByPk(req.params.communityId);
      if(community == null)
        throw new Error("Cette communauté n'existe pas.");
    }

    if (req.params.postId) {
      post = await db.Post.findByPk(req.params.postId);
      if(post == null)
        throw new Error("Ce poste n'existe pas.");

      community = await post.getCommunity();
    }

    if(req.params.commentId) {
      comment = await db.PostComment.findByPk(req.params.commentId);
      if(comment == null)
        throw new Error("Ce commentaire n'existe pas.");
      
      post = await comment.getPost();
      community = await post.getCommunity();
    }

    // Find current user
    let user = await db.User.findByPk(req.user.userId);
    if (user == null) throw new Error("Vous n'êtes pas authentifié.");

    // Check is community moderator / owner
    if (community != null) {
      isModerator = await community.hasCommunityModerator(user);
      let communityUser = await community.getUser();
      isOwner = communityUser.id === user.id;
    }

    // Check is post owner
    if (post != null) {
      let postUser = await post.getUser();
      isAuthor = postUser.id === user.id;
    }

    // Check is comment owner
    if(comment != null) {
      let userComment = await comment.getUser();
      isAuthor = userComment.id === user.id;
    }

    // Access denied
    if (!isAdmin && !isModerator && !isAuthor && !isOwner)
      throw new Error("Vous n'avez pas la permission d'accéder à ce contenu.");

    // Access granted
    next();
  } catch (error) {
    console.error(error.message);
    Helper.errorResponse(req, res, error.message, 403);
  }
};
