const Post = require("../models/postModel");
const factory = require("./handlerFactory");
const asyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");

// exports.getAllPosts = asyncHandler(async (req, res, next) => {
//   const posts = await Post.find().sort({ createdAt: -1 });

//   res.status(200).json({
//     status: "success",
//     results: posts.length,
//     data: {
//       posts,
//     },
//   });
// });

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post, { path: "comments" });

// exports.getPost = asyncHandler(async (req, res, next) => {
//   const post = await Post.findById(req.params.id).populate("comments");

//   if (!post)
//     return next(
//       new ErrorHandler("The post with this given id cannot be found", 401)
//     );

//   res.status(200).json({
//     status: "success",
//     data: {
//       post,
//     },
//   });
// });

exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create({
    title: req.body.title,
    body: req.body.body,
    author: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post)
    return next(
      new ErrorHandler("The post with this given id cannot be found", 404)
    );

  if (post.author._id.toString() !== req.user._id.toString())
    return next(
      new ErrorHandler("You can only update a post you created", 401)
    );

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return next(
      new ErrorHandler("The post with this given id cannot be found", 401)
    );

  if (post.author._id.toString() !== req.user._id.toString())
    return next(
      new ErrorHandler("You can only delete a post you created", 401)
    );

  await post.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Successfully deleted",
  });
});
