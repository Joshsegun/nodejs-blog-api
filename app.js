// ()
const express = require("express");

const globalErrorHander = require("./controllers/errorController");
const ErrorHandler = require("./utils/errorHandler");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);

app.use("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} does not exist`, 404));
});

app.use(globalErrorHander);

module.exports = app;
