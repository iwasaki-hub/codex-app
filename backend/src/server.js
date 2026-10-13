const { assertAuthSecrets, config } = require("./config/env");

assertAuthSecrets();

const app = require("./app");

app.listen(config.port, "127.0.0.1", () => {
  console.log(`Backend server is listening on http://127.0.0.1:${config.port}`);
});
