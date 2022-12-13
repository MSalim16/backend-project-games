const db = require("../db/connection");

exports.selectReviews = () => {
  let reviewsQueryStr = `
    SELECT reviews.*, COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id 
    ORDER BY created_at desc `;

  return db.query(reviewsQueryStr).then((results) => {
    return results.rows;
  });
};

exports.fetchReviewByID = (id) => {
  return db
    .query(
      "SELECT reviews.*, COUNT (comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          message: "Review ID does not exist",
        });

      return rows[0];
    });
};
