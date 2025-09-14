// backend/testConnection.js
import http from "http";

function testHealthCheck() {
  console.log("🔍 Testing backend health check...");

  const options = {
    hostname: "localhost",
    port: 5000, // Updated to match frontend
    path: "/",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log(`✅ Backend is running on port 5000`);
      console.log(`Response: ${data}`);
      testRegistration();
    });
  });

  req.on("error", (error) => {
    console.error("❌ Backend not reachable on port 5000:", error.message);
    console.log("💡 Make sure to start your backend with: npm run dev");
  });

  req.end();
}

function testRegistration() {
  console.log("\n🧪 Testing registration endpoint...");

  const testData = JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(testData),
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log(`📡 Registration endpoint response (${res.statusCode}):`);
      console.log(data);

      if (res.statusCode === 201) {
        console.log("✅ Registration working!");
      } else if (res.statusCode === 400) {
        console.log(
          "⚠️  Registration endpoint working, but user may exist or validation failed"
        );
      }

      process.exit(0);
    });
  });

  req.on("error", (error) => {
    console.error("❌ Registration test failed:", error.message);
    process.exit(1);
  });

  req.write(testData);
  req.end();
}

console.log("🚀 Testing backend connection on port 5000...");
testHealthCheck();
