const crypto = require("node:crypto");
const path = require("node:path");
const jsonServer = require("json-server");
const { assertMockApiSecret, config } = require("../config/env");

assertMockApiSecret();

const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, "../../mock-data/db.json"));

server.use(jsonServer.defaults({ noCors: true }));
server.use((request, response, next) => {
  const suppliedKey = Buffer.from(request.get("x-mock-api-key") || "");
  const expectedKey = Buffer.from(config.mockApiKey);

  if (suppliedKey.length !== expectedKey.length || !crypto.timingSafeEqual(suppliedKey, expectedKey)) {
    return response.sendStatus(401);
  }

  next();
});
server.use(router);

server.listen(config.mockApiPort, "127.0.0.1", () => {
  console.log(`Mock data API is listening on http://127.0.0.1:${config.mockApiPort}`);
});
