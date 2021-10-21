const db = require('../models');

module.exports = async (req, res, next) => {
  try {

    let community = null;
    let isModerator = false;
    let isAdmin = false;
    let isAuthor = false;
    let isOwner;

    // Find for community 
    if(req.params.communityId)
        community = await db.Community.findByPk(req.params.communityId);

    if(community == null && req.params.id) {
        let post = await db.Post.findByPk(req.params.id);
        if(post != null) {
            community = post.getCommunity();
        }else{
            community = await db.Community.findByPk(req.params.id);
        }
    }

    // Find current user
    let user = await db.user.findByPk(req.user.userId);
    if(user == null)
        throw new Error("Vous n'êtes pas authentifié.");

    // Check is community moderator
    if(community != null && community.hasCommunityModerator(user))
        isModerator = true;
    // Check is owner
    if(community != null && community.hasUser(user))
        isOwner = true;
    
    if(isAdmin || isModerator || isAuthor || isOwner)
        return next();

    throw new Error("Vous n'avez pas la permission d'accéder à ce contenu.");
  } catch(error) {
    res.status(403).json({
      error: error
    });
  }
};