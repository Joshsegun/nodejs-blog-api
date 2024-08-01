const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const asyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

const createSignToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  const token = createSignToken(newUser._id);

  //Hide password from output
  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    token,
    message: `Welcome, ${newUser.name}`,
    data: {
      user: newUser,
    },
  });
});

exports.logIn = asyncHandler(async (req, res, next) => {
  //Check if the email and password exist
  const { email, password } = req.body;

  //Error handler if user doesnt email and passwword
  if (!email || !password) {
    next(new ErrorHandler("Please input a valid email and password", 401));
  }

  //Find the corresponding email in the database and if the password correlate
  const user = await User.findOne({ email }).select("+password");

  //Check if user exists in the database and if the password is correct
  if (!user || !(await user.checkPassword(password, user.password))) {
    next(new ErrorHandler("Incorrect email or password...Check again", 400));
  }

  //jwt sign Token
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  const token = createSignToken(user._id);

  //Hide password from output
  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    message: `${user.name} is logged in currently`,
    data: {
      user,
    },
  });
});

exports.authenticate = asyncHandler(async (req, res, next) => {
  //1) Check if token is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ErrorHandler("You are not logged in, Pleae log in to get access", 401)
    );
  }

  //Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Check if user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new ErrorHandler("User not found", 401));
  }

  //Grant access to the protected route and make req.user = current user
  req.user = currentUser;
  next();
});
