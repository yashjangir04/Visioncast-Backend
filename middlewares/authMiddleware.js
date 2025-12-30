const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, msg: "No token" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    
    const user = await User.findOne({ email }).select("-password");;

    if (!user) {
      return res.status(401).json({ valid: false, msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ valid: false, msg: "Invalid token" });
  }
};

module.exports = { validateToken } ;