const User = require("../models/userModel");
const factory = require("./handlerFactory");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);
