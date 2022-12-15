const express = require("express");
const { getCategories } = require("./controllers/categories");
const {
  getReviews,
  getReviewById,
  getCommentsById,
  postCommentById,
  patchReviewById,
} = require("./controllers/reviews");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsById);
app.post("/api/reviews/:review_id/comments", postCommentById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid datatype found" });
  } else if (err.code === "23503" || err.code === "23502") {
    res.status(404).send({ msg: "Review ID does not exist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
