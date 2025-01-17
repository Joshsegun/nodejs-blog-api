const express = require("express");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.authenticate);

router
  .route("/")
  .get(commentController.getAllComments)
  .post(commentController.setPostAndUserId, commentController.createComment);

router
  .route("/:id")
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

module.exports = router;
