const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const communityRoutes = require("./community.routes");
const postRoutes = require("./post.routes");
const commentRoutes = require("./comment.routes");
const privateMessageRoutes = require("./privateMessage.routes");
const notificationRoutes = require("./notification.routes");

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


router.get("/", (req, res) => {
    res.json("Groupomania API 1.0.0");
});


router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes);
router.use("/api/community", communityRoutes);
router.use("/api/post", postRoutes);
router.use("/api/comment", commentRoutes);
router.use("/api/message", privateMessageRoutes);
router.use("/api/notification", notificationRoutes);


router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));


module.exports = router;