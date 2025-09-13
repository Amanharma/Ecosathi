import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzViMzZjMmQ5NzVlMzI2ODUzNmMwNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU3Nzg2OTk4LCJleHAiOjE3NTgzOTE3OTh9.jsBZYg34No8nF1Rhx6ms3CSDDO6NJWiZVfxHea4AZiE";

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("✅ Token is valid:", decoded);
} catch (err) {
  console.error("❌ Token invalid:", err.message);
}
