// backend/src/middleware/authAdmin.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "Admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
};