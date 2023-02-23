const express = require("express");
const { getCategories } = require("./controllers/categories-controllers");
const { getUsers } = require("./controllers/users-controllers");
const { deleteCommentById } = require("./controllers/comments-controllers");

const {
  getReviews,
  getReviewById,
  getReviewComments,
  patchReview,
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

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/reviews/:review_id/comments", getReviewComments);
app.post("/api/reviews/:review_id/comments", postReviewComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handle400Errors);
app.use(handlePSQLErrors);
app.use(handle404Errors);
app.use(handle500Error);

module.exports = app;
