const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minLenght: [5, "A post title must not be less than 5"],
    maxLenght: [50, "A post title must not be greater than 50"],
    required: [true, "A post must have a title"],
    trim: true,
  },
  body: {
    type: String,
    minLenght: [5, "A post body must not be less than 5"],
    required: [true, "A post must have a body"],
  },
  user: {
    type: String,
    required: [true, "A post must have a user that posted it"],
  },
  comments: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
