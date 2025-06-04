const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.jwtSecret);
    if (!decoded) {
      throw "Invalid token";
    }
    console.log("The decoded token is :", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = isAuthenticated;
