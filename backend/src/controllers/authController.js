const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { config } = require("../config/env");

function publicUser(user) {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
  };
}

function createToken(user) {
  return jwt.sign({ sub: String(user.id) }, config.jwtSecret, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
}

function sendSession(response, user, status = 200) {
  response.status(status).json({
    user: publicUser(user),
    token: createToken(user),
  });
}

async function register(request, response) {
  const name = request.body.name.trim();
  const email = request.body.email;
  const password = request.body.password;

  if (await userRepository.findByEmail(email)) {
    return response.status(409).json({ message: "このメールアドレスはすでに登録されています。" });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await userRepository.create({
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  sendSession(response, user, 201);
}

async function login(request, response) {
  const email = request.body.email;
  const password = request.body.password;
  const user = await userRepository.findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return response.status(401).json({ message: "メールアドレスまたはパスワードが正しくありません。" });
  }

  sendSession(response, user);
}

async function currentUser(request, response) {
  const user = await userRepository.findById(request.auth.userId);
  if (!user) {
    return response.status(401).json({ message: "ユーザーが見つかりません。再度ログインしてください。" });
  }

  response.json({ user: publicUser(user) });
}

module.exports = { currentUser, login, register };
