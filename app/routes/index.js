const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const bouncer = require('express-bouncer')(5000, 900000, 10); // (min, max, attempts)
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const communityRoutes = require("./community.routes");
const postRoutes = require("./post.routes");

// Configure spam-protection
bouncer.whitelist.push('127.0.0.1'); // allow an IP address
// give a custom error message
bouncer.blocked = function (req, res, next, remaining) {
    res.status(429).json({ error: "Vous avez effectué trop de requêtes. Ré-essayez dans " + remaining/1000 + " secondes." });
};

router.get("/", (req, res) => {
    res.json("Groupomania API 1.0.0");
});
router.use("/api/auth", bouncer.block, authRoutes);
router.use("/api/user", bouncer.block, userRoutes);
router.use("/api/community", bouncer.block, communityRoutes);
router.use("/api/post", bouncer.block, postRoutes);

module.exports = router;