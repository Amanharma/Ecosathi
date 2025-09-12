import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // TEMP: If no token, use placeholder user
    if (!authHeader) {
      console.log("No token, using placeholder user for testing");
      req.user = { id: "64faae32abcdef1234567890", role: "user" }; // dummy userId from DB
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
