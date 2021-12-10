const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const moderatorMiddleware = require("../middleware/communityModerator.middleware");
const imageUploadMiddleware = require("../middleware/imageUpload.middleware");

router.get("/", postController.readFeed);
router.post("/", authMiddleware, postController.create);
router.get("/:postId", postController.readOne);
router.put("/:postId", authMiddleware, moderatorMiddleware, postController.update);
router.delete("/:postId", authMiddleware, moderatorMiddleware, postController.delete);
router.post("/:postId/file", authMiddleware, moderatorMiddleware, imageUploadMiddleware, postController.upload);
router.delete("/:postId/file", authMiddleware, moderatorMiddleware, postController.deleteFile);
router.get("/:postId/files", postController.readFiles);
router.post("/:postId/like", authMiddleware, postController.like);
router.post("/:postId/favorite", authMiddleware, postController.favorite);
router.delete("/:postId/unfavorite", authMiddleware, postController.unfavorite);
router.post("/:postId/report", authMiddleware, postController.report);
router.get("/community/:communityId", postController.readAll);

module.exports = router;