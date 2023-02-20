const express = require("express");
const {
  getCategories,
  getReviews,
} = require("./controllers/categories-controllers");
const {
  handle500Error,
  handle404Errors,
} = require("./controllers/error-handling-controllers");
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "All Ok" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use(handle500Error);

module.exports = app;
