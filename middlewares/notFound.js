// middlewares/notFound.js

module.exports = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
};
