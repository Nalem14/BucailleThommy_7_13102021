const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", userController.readAll);
router.get("/:id", userController.readOne);
router.post("/:id/report", authMiddleware, userController.report);
router.delete("/:id/report/:reportId", authMiddleware, userController.deleteReport);
router.post("/:id/follow", authMiddleware, userController.follow);
router.delete("/:id/unfollow", authMiddleware, userController.unfollow);

module.exports = router;