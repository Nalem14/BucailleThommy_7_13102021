const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");
const moderatorMiddleware = require("../middleware/communityModerator.middleware");

router.post("/", authMiddleware, postController.create);
router.get("/community/:communityId", postController.readAll);
router.get("/:postId", postController.readOne);
router.put("/:postId", authMiddleware, moderatorMiddleware, postController.update);
router.delete("/:postId", authMiddleware, moderatorMiddleware, postController.delete);

module.exports = router;