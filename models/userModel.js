const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLenght: [5, "Name must not be less than 5"],
      maxLenght: [50, "Name must not be greater than 50"],
      required: [true, "Please input your name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please input your email"],
      validate: [validator.isEmail, "Please input a valid email address"],
    },
    password: {
      type: String,
      minLenght: [8, "A password must not be less than 8"],
      required: [true, "Please input your password"],
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  //If the password hasn't been modified, skip
  if (!this.isModified("password")) return next();

  //Hashing password
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "author",
  localField: "_id",
});

// userSchema.virtual("followersCount").get(function () {
//   return this.followers.length;
// });

// userSchema.virtual("followingsCount").get(function () {
//   return this.followings.length;
// });

const User = mongoose.model("User", userSchema);

module.exports = User;
