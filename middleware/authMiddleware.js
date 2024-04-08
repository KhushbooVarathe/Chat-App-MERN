const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authMiddleware = async (req, res, next) => {
  let token;

  console.log('req.headers.authorization: ', req.headers.authorization);
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      console.log("try running");
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('decoded: ', decoded);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log("catchhhh running");

      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error("Token expired");
      } else {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

module.exports = { authMiddleware };
