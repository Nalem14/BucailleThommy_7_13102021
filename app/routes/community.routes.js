const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, communityController.create);
router.get("/", communityController.readAll);
router.get("/:id", communityController.readOne);

module.exports = router;