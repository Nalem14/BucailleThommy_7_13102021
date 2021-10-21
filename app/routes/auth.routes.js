const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/read", authMiddleware, userController.readMe);
router.get("/export", authMiddleware, userController.exportMe);
router.get("/update", authMiddleware, userController.update);
router.get("/delete", authMiddleware, userController.delete)

module.exports = router;