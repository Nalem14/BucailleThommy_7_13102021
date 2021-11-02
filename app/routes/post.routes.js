const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const moderatorMiddleware = require("../middleware/communityModerator.middleware");
const imageUploadMiddleware = require("../middleware/imageUpload.middleware");

router.post("/", authMiddleware, postController.create);
router.get("/:postId", postController.readOne);
router.put("/:postId", authMiddleware, moderatorMiddleware, postController.update);
router.delete("/:postId", authMiddleware, moderatorMiddleware, postController.delete);
router.post("/:postId/file", authMiddleware, imageUploadMiddleware, postController.upload);
router.delete("/:postId/file", authMiddleware, moderatorMiddleware, postController.deleteFile);
router.get("/:postId/files", postController.readFiles);
router.post("/:postId/like", authMiddleware, postController.like);
router.post("/:postId/report", authMiddleware, postController.report);
router.get("/community/:communityId", postController.readAll);

module.exports = router;