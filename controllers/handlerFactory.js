const asyncHandler = require("../utils/asyncHandler");
const ErrorHandler = require("../utils/errorHandler");

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const docs = await Model.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        docs,
      },
    });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc)
      return next(
        new ErrorHandler("The document with this given id cannot be found", 401)
      );

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(
        new ErrorHandler("The doc with this given id cannot be found", 401)
      );

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(
        new ErrorHandler("The doc with this given id cannot be found", 401)
      );

    res.status(200).json({
      status: "success",
      message: "Successfully deleted",
    });
  });
