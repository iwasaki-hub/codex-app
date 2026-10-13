const express = require("express");
const { body, validationResult } = require("express-validator");
const postController = require("../controllers/postController");
const requireAuth = require("../middleware/requireAuth");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

function validateRequest(request, response, next) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ message: errors.array()[0].msg });
  }
  next();
}

router.get("/", optionalAuth, postController.list);

router.post(
  "/",
  requireAuth,
  body("title")
    .isString()
    .withMessage("記事タイトルを入力してください。")
    .bail()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage("タイトルは1〜120文字で入力してください。"),
  body("content")
    .isString()
    .withMessage("記事本文を入力してください。")
    .bail()
    .trim()
    .isLength({ min: 1, max: 20000 })
    .withMessage("本文は1〜20000文字で入力してください。"),
  body("isPublished")
    .optional()
    .custom((value) => typeof value === "boolean")
    .withMessage("公開状態が無効です。"),
  validateRequest,
  postController.create,
);

router.patch(
  "/:id/visibility",
  requireAuth,
  body("isPublished")
    .custom((value) => typeof value === "boolean")
    .withMessage("公開状態を選択してください。"),
  validateRequest,
  postController.updateVisibility,
);

module.exports = router;
