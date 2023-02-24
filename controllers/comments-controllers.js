const {
  removeCommentById,
  updateCommentById,
} = require("../models/comments-models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { body } = req;
  updateCommentById(comment_id, body)
    .then((patchedComment) => {
      res.status(200).send({ patchedComment });
    })
    .catch((err) => {
      next(err);
    });
};
