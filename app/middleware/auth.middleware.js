const jwt = require('jsonwebtoken');
const db = require('../models');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = decodedToken.user;
    req.user = user;

    // Update lastseenAt attribute of current user
    db.User.findByPk(user.userId).then(user => {
      user.lastseenAt = db.sequelize.fn('NOW');
      user.save();
    })
    
    next();
  } catch {
    res.status(401).json({
      error: 'Vous n\'êtes pas connecté. Merci de vous authentifier.'
    });
  }
};