const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
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
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A post must have an author"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email",
  });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
