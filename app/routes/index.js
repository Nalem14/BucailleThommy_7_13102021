const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const bouncer = require('express-bouncer')(5000, 900000, 3); // (min, max, attempts)
const usersRoutes = require("./users.routes");

// Configure spam-protection
bouncer.whitelist.push('127.0.0.1'); // allow an IP address
// give a custom error message
bouncer.blocked = function (req, res, next, remaining) {
    res.status(429).json({ error: "Vous avez effectué trop de requêtes. Ré-essayez dans " + remaining/1000 + " secondes." });
};

router.get("/", (req, res) => {
    res.json("Groupomania API 1.0.0");
});
router.use("/api/auth", bouncer.block, usersRoutes);

module.exports = router;