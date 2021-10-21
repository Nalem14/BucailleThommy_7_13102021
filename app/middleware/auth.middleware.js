const jwt = require('jsonwebtoken');
const db = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const decodedUser = decodedToken.user;
    req.user = decodedUser;

    // Update lastseenAt attribute of current user
    let user = await db.User.findByPk(decodedUser.userId);
    if(user == null)
      throw new Error("Token invalide");
      
    user.lastseenAt = db.sequelize.fn('NOW');
    user.save();
    
    next();
  } catch {
    res.status(401).json({
      error: 'Vous n\'êtes pas connecté. Merci de vous authentifier.'
    });
  }
};