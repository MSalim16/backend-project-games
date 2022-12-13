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
    .query("SELECT * FROM reviews WHERE review_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: "Review ID does not exist",
        });

      return rows[0];
    });
};

exports.selectCommentsById = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
