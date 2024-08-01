const User = require("../models/userModel");
const factory = require("./handlerFactory");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User, {path : "posts"});

exports.getProfile = (req, res, next)=> {
  req.params.id = req.user.id
  next()
}

exports.updateMyProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead'
    });
  };

exports.deleteUser = factory.deleteOne(User)
exports.updateUser =  factory.updateOne(User)
