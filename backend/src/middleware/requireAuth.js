const jwt = require("jsonwebtoken");
const { config } = require("../config/env");

function requireAuth(request, response, next) {
  const authorization = request.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return response.status(401).json({ message: "ログインが必要です。" });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || payload.sub.length === 0) {
      return response.status(401).json({ message: "認証情報が無効です。" });
    }
    request.auth = { userId: payload.sub };
    next();
  } catch {
    response.status(401).json({ message: "認証情報の有効期限が切れたか、無効です。" });
  }
}

module.exports = requireAuth;
