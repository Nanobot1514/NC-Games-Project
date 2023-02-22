const {
  fetchReviews,
  fetchReviewById,
  fetchReviewComments,
  updateReview,
  insertReviewComment,
} = require("../models/reviews-models");

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewComments = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  updateReview(review_id, body)
    .then((patchedReview) => {
      res.status(200).send({ patchedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postReviewComment = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  insertReviewComment(review_id, body)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
};
