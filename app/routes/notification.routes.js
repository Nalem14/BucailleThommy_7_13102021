const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, notificationController.readAll);
router.get("/count", authMiddleware, notificationController.count);

module.exports = router;