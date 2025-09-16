import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
