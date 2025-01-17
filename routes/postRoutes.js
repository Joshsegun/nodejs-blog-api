const express = require("express");
const postController = require("../controllers/postController");
const authController = require("../controllers/authController");
const commentRouter = require("../routes/commentRoutes");

const router = express.Router();

// POST /posts/:postId/comments
//GET /posts/:postId/comments
//GET /posts/:postId/comments/:commentId

router.use("/:postId/comments", commentRouter);

router.use(authController.authenticate);

router
  .route("/")
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
