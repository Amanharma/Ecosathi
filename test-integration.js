// Integration Test Script for Frontend-Backend Connection
const API_BASE_URL = "http://localhost:5000";

async function testConnection() {
  console.log("🧪 Testing Frontend-Backend Integration...\n");

  try {
    // Test 1: Health Check
    console.log("1. Testing Health Check...");
    const healthResponse = await fetch(`${API_BASE_URL}/`);
    const healthData = await healthResponse.text();
    console.log("✅ Health Check:", healthData);

    // Test 2: Test User Registration
    console.log("\n2. Testing User Registration...");
    const testUser = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "testpassword123"
    };

    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    console.log("✅ Registration Response:", registerData.msg);

    // Test 3: Test User Login
    console.log("\n3. Testing User Login...");
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });

    const loginData = await loginResponse.json();
    console.log("✅ Login Response:", loginData.msg);

    if (loginData.token) {
      console.log("✅ Token received:", loginData.token.substring(0, 20) + "...");

      // Test 4: Test Authenticated Request
      console.log("\n4. Testing Authenticated Request...");
      const complaintsResponse = await fetch(`${API_BASE_URL}/api/complaints/my`, {
        headers: {
          "Authorization": `Bearer ${loginData.token}`
        }
      });

      const complaintsData = await complaintsResponse.json();
      console.log("✅ Authenticated Request:", complaintsData.msg);
    }

    console.log("\n🎉 All tests passed! Integration is working correctly.");
    
  } catch (error) {
    console.error("❌ Integration test failed:", error.message);
    console.log("\n💡 Make sure:");
    console.log("   - Backend server is running on port 5000");
    console.log("   - MongoDB is running and accessible");
    console.log("   - Environment variables are set correctly");
  }
}

// Run the test
testConnection();
