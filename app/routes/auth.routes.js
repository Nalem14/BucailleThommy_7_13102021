const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const imageUploadMiddleware = require("../middleware/imageUpload.middleware");
const bouncer = require('express-bouncer')(5000, 900000, 10); // (min, max, attempts)

// Configure spam-protection
bouncer.whitelist.push('127.0.0.1'); // allow an IP address
// give a custom error message
bouncer.blocked = function (req, res, next, remaining) {
    res.status(429).json({ error: "Vous avez effectué trop de requêtes. Ré-essayez dans " + remaining/1000 + " secondes." });
};

router.post("/signup", bouncer.blocked, authController.signup);
router.post("/login", bouncer.blocked, authController.login);
router.get("/read", authMiddleware, authController.readMe);
router.get("/export", authMiddleware, authController.exportMe);
router.get("/admin/reports", authMiddleware, authController.adminReports);
router.put("/update", authMiddleware, imageUploadMiddleware, authController.update);
router.delete("/delete", authMiddleware, authController.delete)

module.exports = router;