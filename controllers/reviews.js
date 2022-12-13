const {
  selectReviews,
  fetchReviewByID,
  selectCommentsById,
} = require("../models/reviews.js");

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
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
      console.log(comments);
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
