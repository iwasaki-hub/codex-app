const express = require("express");
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

function validateRequest(request, response, next) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}

const emailValidation = body("email")
  .isString()
  .withMessage("有効なメールアドレスを入力してください。")
  .bail()
  .trim()
  .customSanitizer((email) => email.toLowerCase())
  .isEmail()
  .withMessage("有効なメールアドレスを入力してください。");

const passwordValidation = body("password")
  .isString()
  .withMessage("パスワードを入力してください。")
  .bail()
  .isLength({ min: 8 })
  .withMessage("パスワードは8文字以上で入力してください。")
  .bail()
  .custom((password) => Buffer.byteLength(password, "utf8") <= 72)
  .withMessage("パスワードは UTF-8 で72バイト以内にしてください。");

router.post(
  "/register",
  body("name")
    .isString()
    .withMessage("名前を入力してください。")
    .bail()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage("名前は1〜80文字で入力してください。"),
  emailValidation,
  passwordValidation,
  validateRequest,
  authController.register,
);

router.post(
  "/login",
  emailValidation,
  body("password")
    .isString()
    .withMessage("パスワードを入力してください。"),
  validateRequest,
  authController.login,
);

router.get("/me", requireAuth, authController.currentUser);

module.exports = router;
