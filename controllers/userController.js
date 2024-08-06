const User = require("../models/userModel");
const factory = require("./handlerFactory");
const asyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User, { path: "posts" });

exports.getProfile = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMyProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);

exports.followUser = asyncHandler(async (req, res, next) => {
  //1) Get the currently logged in user and the user you want to follow
  const currentUser = await User.findById(req.user.id);
  const userToFollow = await User.findById(req.params.userId);

  //2) Check if the user that you want to follow exists
  if (!userToFollow) return next(new ErrorHandler("User not Found", 404));

  //3a) Check if you are not trying to follow yourself
  if (req.params.userId === currentUser.id)
    return next(new ErrorHandler("You cannot follow yourself", 400));

  //3b) Check if current user is not following the user already
  if (currentUser.followings.includes(userToFollow.id))
    return next(new ErrorHandler("You are already following this user", 400));

  //4) The follow process
  //push the user into the following array
  currentUser.followings.push(userToFollow.id);
  // push the current user into the other user followers array
  userToFollow.followers.push(currentUser.id);

  await currentUser.save();
  await userToFollow.save();

  res.status(200).json({
    status: "success",
    message: "User followed successfully",
    data: {
      user: userToFollow,
    },
  });
});

exports.unfollowUser = async (req, res, next) => {
  //1) Get the currently logged in user and the user you want to unfollow
  const currentUser = await User.findById(req.user.id);
  const userToUnfollow = await User.findById(req.params.userId);

  //2) Check if the user that you want to unfollow exists
  if (!userToUnfollow) return next(new ErrorHandler("User not Found", 404));

  //3a) Check if you are not trying to unfollow yourself
  if (req.params.userId === currentUser.id)
    return next(new ErrorHandler("You cannot unfollow yourself", 400));

  //3b) Check if current user is following the user
  if (!currentUser.followings.includes(userToUnfollow.id))
    return next(new ErrorHandler("You are not following this user", 400));

  //4) The follow process
  //filter
  currentUser.followings = currentUser.followings.filter(
    (id) => id.toString() !== userToUnfollow.id.toString()
  );
  // push the current user into the other user followers array
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (id) => id.toString() !== currentUser.id.toString()
  );

  await currentUser.save();
  await userToUnfollow.save();

  res.status(200).json({
    status: "success",
    message: "User unfollowed successfully",
    data: {
      user: userToUnfollow,
    },
  });
};

const getFollow = (doc) =>
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      status: "success",
      data: {
        name: user.name,
        [doc]: user[doc],
        [`${doc}Count`]: user[`${doc}Count`],
      },
    });
  });

exports.getFollowers = getFollow("followers");

exports.getFollowings = getFollow("followings");

const getMyFollow = (doc) =>
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
      status: "success",
      data: {
        name: user.name,
        [doc]: user[doc],
        [`${doc}Count`]: user[`${doc}Count`],
      },
    });
  });

exports.getMyFollowers = getMyFollow("followers");

exports.getMyFollowings = getMyFollow("followings");
