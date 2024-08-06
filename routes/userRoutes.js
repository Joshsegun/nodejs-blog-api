const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.logIn);

router.get(
  "/myProfile",
  authController.authenticate,
  userController.getProfile,
  userController.getUser
);
router.patch(
  "/updateMyProfile",
  authController.authenticate,
  userController.updateMyProfile
);

router.post(
  "/follow/:userId",
  authController.authenticate,
  userController.followUser
);
router.post(
  "/unfollow/:userId",
  authController.authenticate,
  userController.unfollowUser
);

router.get(
  "/:userId/followers",
  authController.authenticate,
  userController.getFollowers
);
router.get(
  "/:userId/followings",
  authController.authenticate,
  userController.getFollowings
);
router.get(
  "/myFollowers",
  authController.authenticate,
  userController.getMyFollowers
);
router.get(
  "/myFollowings",
  authController.authenticate,
  userController.getMyFollowings
);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
