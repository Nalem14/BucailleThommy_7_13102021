const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const imageUploadMiddleware = require("../middleware/imageUpload.middleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/read", authMiddleware, authController.readMe);
router.get("/export", authMiddleware, authController.exportMe);
router.put("/update", authMiddleware, imageUploadMiddleware, authController.update);
router.delete("/delete", authMiddleware, authController.delete)

module.exports = router;