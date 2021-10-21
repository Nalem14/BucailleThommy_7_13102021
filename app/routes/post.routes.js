const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, postController.create);
router.get("/community/:communityId", postController.readAll);
router.get("/:id", postController.readOne);
router.put("/:id", authMiddleware, postController.update);
router.delete("/:id", authMiddleware, postController.delete);

module.exports = router;