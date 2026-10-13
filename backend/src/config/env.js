const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const config = Object.freeze({
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "",
  mockApiKey: process.env.MOCK_API_KEY || "",
  mockApiUrl: (process.env.MOCK_API_URL || "http://127.0.0.1:3001").replace(/\/+$/, ""),
  mockApiPort: Number(process.env.MOCK_API_PORT) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
});

function assertSecret(name, value) {
  if (value.length < 32 || value.startsWith("replace-this")) {
    throw new Error(`${name} must be set to a random value at least 32 characters long. See backend/.env.example.`);
  }
}

function assertAuthSecrets() {
  assertSecret("JWT_SECRET", config.jwtSecret);
  assertSecret("MOCK_API_KEY", config.mockApiKey);
}

function assertMockApiSecret() {
  assertSecret("MOCK_API_KEY", config.mockApiKey);
}

module.exports = { config, assertAuthSecrets, assertMockApiSecret };
