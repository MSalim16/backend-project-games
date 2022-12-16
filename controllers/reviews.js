const {
  selectReviews,
  fetchReviewByID,
  selectCommentsById,
  insertCommentById,
  updateReviewById,
} = require("../models/reviews.js");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;

  const promises = [selectReviews(category, sort_by, order)];
  Promise.all(promises)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews[0] });
    })
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewByID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  fetchReviewByID(req.params.review_id)
    .then(() => {
      return selectCommentsById(req.params.review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  const newReview = req.body;

  insertCommentById(req.params.review_id, newReview)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { inc_votes } = req.body;
  updateReviewById(req.params.review_id, req.body.inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
