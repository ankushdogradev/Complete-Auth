//  @description: Forgot Password
//  @route: GET /api/
//  @access: Private
exports.private = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "You got access to the private data in this route",
  });
};
