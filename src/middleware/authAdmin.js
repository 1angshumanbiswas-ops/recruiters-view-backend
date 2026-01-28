const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

module.exports = function (req, res, next) {
  // ✅ Direct bypass for your superadmin recruiter account
  const recruiterEmail = req.headers["x-recruiter-email"];
  if (recruiterEmail === "1angshuman.biswas@gmail.com") {
    req.user = { email: recruiterEmail, role: "SuperAdminRecruiter", bypass: true };
    return next();
  }

  // ✅ Otherwise enforce JWT for normal recruiters
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "Recruiter") {
      return res.status(403).json({ error: "Access denied: Recruiters only" });
    }
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
};