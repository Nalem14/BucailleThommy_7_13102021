const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, postController.create);
router.get("/", postController.readAll);
router.get("/:id", postController.readOne);
router.put("/:id", postController.update);
router.delete("/:id", postController.delete);

module.exports = router;