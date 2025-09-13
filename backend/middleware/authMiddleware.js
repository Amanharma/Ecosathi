import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      console.log("No token, using placeholder user for testing");
      req.user = { id: "64faae32abcdef1234567890", role: "user" };
      return next();
    }

    // ✅ Direct assignment for testing
    const receivedValue = authHeader.split(" ");
    console.log('Split Array:', receivedValue); // Print the array
    const token = receivedValue[1];

    // ✅ Add a console.log to see the token right before verification
    console.log('Token to Verify:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;