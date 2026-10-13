const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("node:path");
const { config } = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan("dev"));
app.use(express.json({ limit: "128kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/docs-assets", express.static(path.resolve(__dirname, "../public")));
app.get("/", (_request, response) => {
  response.render("api-docs", {
    baseUrl: `http://127.0.0.1:${config.port}`,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use((error, _request, response, _next) => {
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) {
    console.error(error);
  }

  response.status(status).json({
    message: status >= 500 ? "サーバーでエラーが発生しました。" : error.message,
  });
});

module.exports = app;
