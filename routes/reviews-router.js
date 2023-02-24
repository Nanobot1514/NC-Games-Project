const {
  getReviews,
  getReviewById,
  patchReview,
  getReviewComments,
  postReviewComment,
} = require("../controllers/reviews-controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.route("/").get(getReviews);

reviewsRouter.route("/:review_id").get(getReviewById).patch(patchReview);

reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewComments)
  .post(postReviewComment);

module.exports = reviewsRouter;
