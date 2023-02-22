const express = require("express");
const { getCategories } = require("./controllers/categories-controllers");

const {
  getReviews,
  getReviewById,
  getReviewComments,
  postReviewComment,
} = require("./controllers/reviews-controllers");

const {
  handle500Error,
  handlePSQLErrors,
  handle400Errors,
  handle404Errors,
} = require("./controllers/error-handling-controllers");
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "All Ok" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.use(handle400Errors);
app.use(handlePSQLErrors);
app.use(handle404Errors);
app.use(handle500Error);

module.exports = app;
