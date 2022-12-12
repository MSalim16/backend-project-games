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
