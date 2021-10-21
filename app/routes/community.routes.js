const express = require("express");
const { route } = require(".");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", communityController.readAll);
router.get("/:id", communityController.readOne);
router.post("/", communityController.add);

module.exports = router;