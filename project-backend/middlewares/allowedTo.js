const { httpFaliureStatus } = require("../utils/http_status");

const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role))
      return res.status(401).json(httpFaliureStatus("You are not allowed to access this route"));

    next();
  };
};
module.exports = allowedTo;
