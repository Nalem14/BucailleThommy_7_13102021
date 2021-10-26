const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const authMiddleware = require("../middleware/auth.middleware");
const communityModeratorMiddleware = require("../middleware/communityModerator.middleware");
const imageUploadMiddleware = require("../middleware/imageUpload.middleware");

router.post("/", authMiddleware, communityController.create);
router.get("/", communityController.readAll);
router.get("/:communityId", communityController.readOne);
router.get("/:communityId/reports", authMiddleware, communityModeratorMiddleware, communityController.readReports);
router.put("/:communityId", authMiddleware, communityModeratorMiddleware, imageUploadMiddleware, communityController.update);
router.delete("/:communityId", authMiddleware, communityModeratorMiddleware, communityController.delete);
router.post("/:communityId/follow", authMiddleware, communityController.follow);
router.delete("/:communityId/unfollow", authMiddleware, communityController.unfollow);
router.post("/:communityId/moderator", authMiddleware, communityModeratorMiddleware, communityController.addModerator);
router.delete("/:communityId/moderator", authMiddleware, communityModeratorMiddleware, communityController.deleteModerator);

module.exports = router;