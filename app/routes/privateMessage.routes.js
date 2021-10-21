const express = require("express");
const router = express.Router();
const privateMessageController = require("../controllers/privateMessage.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, privateMessageController.readAll);
router.get("/:fromUserId", authMiddleware, privateMessageController.readFrom);
router.post("/:toUserId", authMiddleware, privateMessageController.create);

module.exports = router;