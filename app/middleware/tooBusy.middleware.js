const toobusy = require('toobusy-js');

module.exports = (req, res, next) => {
    if (toobusy()) {
        res.status(503).json("Server Too Busy");
    } else {
        next();
    }
};