import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        // ✅ Add this line to log the raw header and the token itself
        console.log('Received Header:', authHeader);
        
        if (!authHeader) {
            // ... (rest of your code)
            return next();
        }

        const token = authHeader.split(" ")[1];
        
        // ✅ And this line to see the token after the split
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