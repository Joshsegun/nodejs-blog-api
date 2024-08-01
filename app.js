// ()
const express = require("express");

const globalErrorHander = require("./controllers/errorController");
const ErrorHandler = require("./utils/errorHandler");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");

const app = express();

app.use(express.json());

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);

app.use("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} does not exist`, 404));
});

app.use(globalErrorHander);

module.exports = app;
