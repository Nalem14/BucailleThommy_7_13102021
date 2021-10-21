const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const moderatorMiddleware = require("../middleware/communityModerator.middleware");

router.post("/", authMiddleware, commentController.create);
router.get("/post/:postId", commentController.readAll);
router.get("/:commentId", commentController.readOne);
router.post("/:commentId/like", authMiddleware, commentController.like);
router.post("/:commentId/report", authMiddleware, commentController.report);
router.put("/:commentId", authMiddleware, moderatorMiddleware, commentController.update);
router.delete("/:commentId", authMiddleware, moderatorMiddleware, commentController.delete);

module.exports = router;