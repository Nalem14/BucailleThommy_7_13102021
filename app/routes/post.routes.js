const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const moderatorMiddleware = require("../middleware/communityModerator.middleware");
const imageUploadMiddleware = require("../middleware/imageUpload.middleware");

router.post("/", authMiddleware, postController.create);
router.get("/community/:communityId", postController.readAll);
router.get("/:postId", postController.readOne);
router.get("/:postId/files", postController.readFiles);
router.post("/:postId/like", authMiddleware, postController.like);
router.post("/:postId/report", authMiddleware, postController.report);
router.post("/:postId/file", authMiddleware, imageUploadMiddleware, postController.upload);
router.put("/:postId", authMiddleware, moderatorMiddleware, postController.update);
router.delete("/:postId", authMiddleware, moderatorMiddleware, postController.delete);
router.delete("/:postId/file", authMiddleware, moderatorMiddleware, postController.deleteFile);

module.exports = router;